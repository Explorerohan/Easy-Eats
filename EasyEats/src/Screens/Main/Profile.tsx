import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBar from '../../components/BottomNavBar';
import rohan from '../../../assets/rohan.jpg';
import pasta2 from '../../../assets/pasta.webp';
import curry from '../../../assets/curry.webp';
import beef from '../../../assets/beef.jpg';
import { getAuth } from 'firebase/auth';
import { profileAPI } from '../../services/api';
import axios from 'axios';
import { API_URL } from '../../config';

type RootStackParamList = {
  Profile: undefined;
  Home: undefined;
  EditProfile: undefined;
  AddRecipe: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileProps {
  navigation: ProfileScreenNavigationProp;
}

type IconName = keyof typeof Ionicons.glyphMap;

interface StatItem {
  label: string;
  value: string;
  icon: IconName;
}

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

export default function Profile({ navigation }: ProfileProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    profileImage: null,
    recipeCount: 0,
  });
  const slideAnim = useRef(new Animated.Value(-height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const settingsOptions = [
    { icon: 'create-outline', label: 'Edit Profile', color: '#007AFF' },
    { icon: 'add-circle-outline', label: 'New Recipe', color: '#4CAF50' },
    { icon: 'bookmark-outline', label: 'Saved Recipes', color: '#FF9800' },
    { icon: 'heart-outline', label: 'Favorites', color: '#F44336' },
    { icon: 'notifications-outline', label: 'Notifications', color: '#9C27B0' },
    { icon: 'share-social-outline', label: 'Share Profile', color: '#00BCD4' },
    { icon: 'help-circle-outline', label: 'Help & Support', color: '#795548' },
    { icon: 'log-out-outline', label: 'Logout', color: '#FF3B30' },
  ] as const;

  const stats: StatItem[] = [
    { label: 'Recipes', value: '24', icon: 'restaurant' as IconName },
    { label: 'Edit Profile', value: '', icon: 'create-outline' as IconName },
    { label: 'Add Recipe', value: '', icon: 'add-circle-outline' as IconName },
  ];

  useEffect(() => {
    fetchProfile();
    fetchUserRecipes();
    
    // Add focus listener to refresh data when returning from EditProfile or AddRecipe
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfile();
      fetchUserRecipes();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error('No user logged in');
        return;
      }

      const response = await profileAPI.getProfile(user.uid);
      console.log('Profile fetched successfully:', response.data);
      
      // Update profile picture URL to be absolute
      const profileData = response.data;
      if (profileData.profile_picture) {
        profileData.profile_picture = `${API_URL}${profileData.profile_picture}`;
      }
      
      setProfileData({
        name: profileData.user?.first_name || user.displayName || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        profileImage: profileData.profile_picture,
        recipeCount: profileData.recipe_count || 0,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response:', error.response.data);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRecipes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/recipes/my_recipes/`);
      console.log('Fetched user recipes:', response.data);
      // Log the image URLs for debugging
      response.data.forEach(recipe => {
        console.log('Recipe:', recipe.title);
        console.log('Image URL:', recipe.image ? `${API_URL}${recipe.image}` : 'No image');
      });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
      }
    }
  };

  const animate = (show: boolean): Promise<void> => {
    return new Promise((resolve) => {
      setIsAnimating(true);
      if (show) {
        setIsSettingsVisible(true);
      }
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: show ? 1 : 0,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(slideAnim, {
          toValue: show ? 0 : -height,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start(({ finished }) => {
        if (!show && finished) {
          setTimeout(() => {
            setIsSettingsVisible(false);
            setIsAnimating(false);
          }, 50);
        } else {
          setIsAnimating(false);
        }
        resolve();
      });
    });
  };

  const showSettings = async () => {
    try {
      await animate(true);
    } catch (error) {
      console.warn('Animation error:', error);
      setIsSettingsVisible(false);
    }
  };

  const hideSettings = async () => {
    try {
      await animate(false);
    } catch (error) {
      console.warn('Animation error:', error);
      setIsSettingsVisible(false);
    }
  };

  const handleSettingsAction = async (label: string) => {
    try {
      await hideSettings();
      
      switch (label) {
        case 'Logout':
          // Handle logout
          break;
        case 'Edit Profile':
          navigation.navigate('EditProfile');
          break;
        case 'New Recipe':
          navigation.navigate('AddRecipe');
          break;
      }
    } catch (error) {
      console.warn('Settings action error:', error);
    }
  };

  const renderRecipeCard = ({ item }) => {
    // Construct the full image URL
    const imageUrl = item.image 
      ? item.image.startsWith('http') 
        ? item.image 
        : `${API_URL}${item.image}`
      : null;
    
    console.log('Rendering recipe card:', item.title);
    console.log('Image path:', item.image);
    console.log('Full image URL:', imageUrl);
    
    return (
      <TouchableOpacity 
        style={styles.recipeCard}
        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      >
        <Image
          source={imageUrl ? { uri: imageUrl } : pasta2}
          style={styles.recipeImage}
          onError={(error) => {
            console.error('Image loading error for recipe:', item.title);
            console.error('Failed URL:', imageUrl);
            console.error('Error details:', error.nativeEvent.error);
          }}
          defaultSource={pasta2}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.recipeGradient}
        >
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.recipeMetaInfo}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#FFF" />
                <Text style={styles.metaText}>{item.cooking_time} min</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.metaText}>{item.difficulty || 'Easy'}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        scrollEnabled={!isSettingsVisible}
        onScroll={(event) => {
          setScrollPosition(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.headerContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <>
                {profileData.profileImage ? (
                  <Image 
                    source={{ uri: profileData.profileImage }} 
                    style={styles.profileImage} 
                  />
                ) : (
                  <View style={[styles.profileImage, styles.defaultProfileImage]}>
                    <Ionicons name="person" size={40} color="#999" />
                  </View>
                )}
                <View style={styles.profileInfo}>
                  <Text style={styles.name} numberOfLines={2}>{profileData.name}</Text>
                  {profileData.bio && (
                    <View style={styles.infoItem}>
                      <Ionicons name="book-outline" size={16} color="#666" />
                      <Text style={styles.infoText} numberOfLines={3}>{profileData.bio}</Text>
                    </View>
                  )}
                  {profileData.location && (
                    <View style={styles.infoItem}>
                      <Ionicons name="location-outline" size={16} color="#666" />
                      <Text style={styles.infoText} numberOfLines={2}>{profileData.location}</Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={isSettingsVisible ? hideSettings : showSettings}
          >
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => navigation.navigate('EditProfile')}>
              <View style={styles.statIconContainer}>
                <Ionicons name="create-outline" size={24} color="#007AFF" />
              </View>
              <Text style={styles.statLabel}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => handleSettingsAction('New Recipe')}
            >
              <View style={styles.statIconContainer}>
                <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.statLabel}>Add Recipe</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recipeCountContainer}>
            <View style={styles.recipeCountContent}>
              <Ionicons name="restaurant" size={20} color="#007AFF" />
              <Text style={styles.recipeCountText}>{profileData.recipeCount} Recipes</Text>
            </View>
          </View>
        </View>

        {/* Settings Menu */}
        {(isSettingsVisible || isAnimating) && (
          <View style={[styles.menuContainer, { top: scrollPosition }]}>
            <Animated.View 
              style={[
                styles.overlay,
                {
                  opacity: fadeAnim,
                  top: -scrollPosition,
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.fullSize}
                onPress={hideSettings}
                activeOpacity={1}
              />
            </Animated.View>
            <Animated.View 
              style={[
                styles.settingsMenu,
                {
                  transform: [{ translateY: slideAnim }],
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ]}
            >
              <View style={styles.settingsContent}>
                <View style={styles.settingsHeader}>
                  <Text style={styles.settingsHeaderText}>Settings</Text>
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={hideSettings}
                  >
                    <Ionicons name="close" size={24} color="#1A1A1A" />
                  </TouchableOpacity>
                </View>
                <View style={styles.settingsItems}>
                  {settingsOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.settingsItem,
                        index === settingsOptions.length - 1 && { borderBottomWidth: 0 }
                      ]}
                      onPress={() => handleSettingsAction(option.label)}
                    >
                      <View style={[styles.settingsIconContainer, { backgroundColor: `${option.color}10` }]}>
                        <Ionicons name={option.icon} size={22} color={option.color} />
                      </View>
                      <Text style={styles.settingsItemText}>{option.label}</Text>
                      <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Animated.View>
          </View>
        )}

        {/* Recipes Section */}
        <View style={styles.recipesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Recipes</Text>
            <TouchableOpacity 
              style={styles.addRecipeButton}
              onPress={() => navigation.navigate('AddRecipe')}
            >
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          
          {recipes.length === 0 ? (
            <View style={styles.emptyRecipes}>
              <Ionicons name="restaurant-outline" size={48} color="#CCC" />
              <Text style={styles.emptyText}>No recipes yet</Text>
              <TouchableOpacity
                style={styles.createRecipeButton}
                onPress={() => navigation.navigate('AddRecipe')}
              >
                <Text style={styles.createRecipeText}>Create Your First Recipe</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipesContainer}
            >
              {recipes.map((recipe, index) => (
                <View key={recipe.id} style={[
                  styles.recipeCardWrapper,
                  index === 0 && styles.firstRecipeCard,
                  index === recipes.length - 1 && styles.lastRecipeCard,
                ]}>
                  {renderRecipeCard({ item: recipe })}
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Recipe Collections Section */}
        <View style={styles.collectionsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="grid" size={24} color="#1A1A1A" />
              <Text style={styles.sectionTitle}>Recipe Collections</Text>
            </View>
          </View>
          
          <View style={styles.collectionsGrid}>
            <TouchableOpacity style={styles.collectionCard}>
              <LinearGradient
                colors={['#FF6B6B', '#EE5D5D']}
                style={styles.collectionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.collectionContent}>
                  <View style={styles.collectionIconContainer}>
                    <Ionicons name="flame" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.collectionTitle}>Popular</Text>
                  <Text style={styles.collectionCount}>12 recipes</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.collectionCard}>
              <LinearGradient
                colors={['#4ECDC4', '#45B7AF']}
                style={styles.collectionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.collectionContent}>
                  <View style={styles.collectionIconContainer}>
                    <Ionicons name="time" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.collectionTitle}>Quick & Easy</Text>
                  <Text style={styles.collectionCount}>8 recipes</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.collectionCard}>
              <LinearGradient
                colors={['#FFD93D', '#F4C724']}
                style={styles.collectionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.collectionContent}>
                  <View style={styles.collectionIconContainer}>
                    <Ionicons name="star" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.collectionTitle}>Favorites</Text>
                  <Text style={styles.collectionCount}>15 recipes</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.collectionCard}>
              <LinearGradient
                colors={['#6C5CE7', '#5D4ED8']}
                style={styles.collectionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.collectionContent}>
                  <View style={styles.collectionIconContainer}>
                    <Ionicons name="leaf" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.collectionTitle}>Healthy</Text>
                  <Text style={styles.collectionCount}>6 recipes</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.createCollectionButton}>
            <View style={styles.createCollectionContent}>
              <Ionicons name="add-circle" size={20} color="#007AFF" />
              <Text style={styles.createCollectionText}>Create New Collection</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 60,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    flex: 1,
    flexWrap: 'wrap',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginTop: 8,
  },
  statsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  recipeCountContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  recipeCountContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  recipeCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  recipesSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  addRecipeButton: {
    padding: 4,
  },
  recipesContainer: {
    paddingBottom: 16,
  },
  recipeCardWrapper: {
    marginRight: 16,
  },
  firstRecipeCard: {
    marginLeft: 0,
  },
  lastRecipeCard: {
    marginRight: 0,
  },
  recipeCard: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  recipeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    padding: 16,
    justifyContent: 'flex-end',
  },
  recipeInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  recipeMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 4,
  },
  emptyRecipes: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 16,
  },
  createRecipeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createRecipeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  collectionsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
  },
  collectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  collectionCard: {
    width: (width - 52) / 2,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  collectionGradient: {
    flex: 1,
    padding: 16,
  },
  collectionContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  collectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  collectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  collectionCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  createCollectionButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#E8F2FF',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  createCollectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createCollectionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 100,
  },
  fullSize: {
    width: '100%',
    height: '100%',
  },
  settingsMenu: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: Platform.OS === 'android' ? 160 : 180,
    bottom: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 101,
  },
  settingsContent: {
    backgroundColor: '#FFF',
    overflow: 'hidden',
    height: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  settingsItems: {
    paddingVertical: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingsHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
    borderRadius: 20,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  defaultProfileImage: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
import React, { useState, useRef } from 'react';
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
            <Image source={rohan} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>Greshma</Text>
              <Text style={styles.bio}>Passionate food creator</Text>
            </View>
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
              <Text style={styles.recipeCountText}>24 Recipes</Text>
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

        {/* My Recipes Section */}
        <View style={styles.recipesSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="restaurant" size={24} color="#1A1A1A" />
              <Text style={styles.sectionTitle}>My Recipes</Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="arrow-forward" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipesContainer}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + 20}
            snapToAlignment="center"
          >
            {/* Recipe Cards */}
            <TouchableOpacity style={[styles.recipeCard, { width: CARD_WIDTH }]}>
              <Image source={pasta2} style={styles.recipeImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.recipeGradient}
              >
                <View style={styles.recipeInfo}>
                  <View style={styles.recipeBadge}>
                    <Text style={styles.recipeBadgeText}>Italian</Text>
                  </View>
                  <Text style={styles.recipeTitle}>Italian Pasta</Text>
                  <View style={styles.recipeStats}>
                    <View style={styles.recipeStat}>
                      <Ionicons name="time-outline" size={16} color="#fff" />
                      <Text style={styles.recipeStatText}>30m</Text>
                    </View>
                    <View style={styles.recipeStat}>
                      <Ionicons name="heart" size={16} color="#FF3B30" />
                      <Text style={styles.recipeStatText}>128</Text>
                    </View>
                    <View style={styles.recipeStat}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.recipeStatText}>4.8</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.recipeCard, { width: CARD_WIDTH }]}>
              <Image source={curry} style={styles.recipeImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.recipeGradient}
              >
                <View style={styles.recipeInfo}>
                  <View style={[styles.recipeBadge, styles.indianBadge]}>
                    <Text style={styles.recipeBadgeText}>Indian</Text>
                  </View>
                  <Text style={styles.recipeTitle}>Chicken Curry</Text>
                  <View style={styles.recipeStats}>
                    <View style={styles.recipeStat}>
                      <Ionicons name="time-outline" size={16} color="#fff" />
                      <Text style={styles.recipeStatText}>45m</Text>
                    </View>
                    <View style={styles.recipeStat}>
                      <Ionicons name="heart" size={16} color="#FF3B30" />
                      <Text style={styles.recipeStatText}>96</Text>
                    </View>
                    <View style={styles.recipeStat}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.recipeStatText}>4.6</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.recipeCard, { width: CARD_WIDTH }]}>
              <Image source={beef} style={styles.recipeImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.recipeGradient}
              >
                <View style={styles.recipeInfo}>
                  <View style={[styles.recipeBadge, styles.mexicanBadge]}>
                    <Text style={styles.recipeBadgeText}>Mexican</Text>
                  </View>
                  <Text style={styles.recipeTitle}>Beef Tacos</Text>
                  <View style={styles.recipeStats}>
                    <View style={styles.recipeStat}>
                      <Ionicons name="time-outline" size={16} color="#fff" />
                      <Text style={styles.recipeStatText}>25m</Text>
                    </View>
                    <View style={styles.recipeStat}>
                      <Ionicons name="heart" size={16} color="#FF3B30" />
                      <Text style={styles.recipeStatText}>156</Text>
                    </View>
                    <View style={styles.recipeStat}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.recipeStatText}>4.9</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
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
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  profileInfo: {
    gap: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  bio: {
    fontSize: 14,
    color: '#666',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
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
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  recipesContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  recipeCard: {
    height: 320,
    marginRight: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  recipeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    padding: 20,
    justifyContent: 'flex-end',
  },
  recipeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    marginBottom: 8,
  },
  indianBadge: {
    backgroundColor: '#FF9500',
  },
  mexicanBadge: {
    backgroundColor: '#FF3B30',
  },
  recipeBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  recipeInfo: {
    gap: 8,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  recipeStats: {
    flexDirection: 'row',
    gap: 16,
  },
  recipeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeStatText: {
    color: '#FFF',
    fontSize: 14,
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
});
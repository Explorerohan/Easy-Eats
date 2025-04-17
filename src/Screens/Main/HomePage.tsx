import React from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomNavBar from '../../../src/components/BottomNavBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categories, trendingRecipes, Category, Recipe } from '../../../src/data/staticData';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Discover: undefined;
  Favorites: undefined;
  Chat: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomePage({ navigation }: HomeProps) {
  const handleprofile = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Hello Greshma,</Text>
            <Text style={styles.headerTextRecipes}>What would you like to cook?</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeNumber}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search recipes, ingredients..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Featured Recipe */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Recipe</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.featuredCard}>
            <Image
              source={trendingRecipes[0].image}
              style={styles.featuredImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.featuredOverlay}
            >
              <View style={styles.featuredContent}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.badgeText}>Premium</Text>
                </View>
                <Text style={styles.featuredTitle}>{trendingRecipes[0].name}</Text>
                <View style={styles.featuredMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={16} color="#fff" />
                    <Text style={styles.metaText}>{trendingRecipes[0].time}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.metaText}>{trendingRecipes[0].rating}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category: Category) => (
              <View key={category.id} style={styles.categoryItem}>
                <Image
                  source={category.image}
                  style={styles.categoryImage}
                />
                <Text style={styles.categoryIcon}>{category.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Trending Recipes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.trendingList}
          >
            {trendingRecipes.map((recipe: Recipe) => (
              <View key={recipe.id} style={styles.recipeItem}>
                <Image
                  source={recipe.image}
                  style={styles.trendingImage}
                />
                <Text style={styles.recipeInfo}>{recipe.name}</Text>
                <Text style={styles.rating}>⭐ {recipe.rating}</Text>
              </View>
            ))}
          </ScrollView>
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
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 16,
    paddingBottom: 20,
    marginBottom: 8,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 60,
  },
  headerText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  headerTextRecipes: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    letterSpacing: 0.2,
    lineHeight: 34,
  },
  headerIcons: {
    position: 'absolute',
    right: 20,
    top: 16,
  },
  iconButton: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeNumber: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  searchIcon: {
    marginRight: 8,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
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
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  featuredCard: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    padding: 16,
    justifyContent: 'flex-end',
  },
  featuredContent: {
    gap: 8,
  },
  featuredBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  featuredMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#FFF',
    fontSize: 14,
  },
  trendingList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10, 
  },
  recipeItem: {
    width: 160,
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    marginRight: 16,
    marginBottom: 4,
  },
  trendingImage: {
    width: 160,
    height: 160,
  },
  recipeInfo: {
    marginTop: 8,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  rating: {
    color: '#FFA000',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryImage: {
    width: 75,
    height: 75,
    borderRadius: 38,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#424242',
  },
});
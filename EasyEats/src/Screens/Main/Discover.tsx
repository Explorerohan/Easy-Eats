import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBar from '../../components/BottomNavBar';

// Replace with your Spoonacular API key
const API_KEY = 'ab183750946f4bdb957323568bfaad42';

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const searchRecipes = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(searchQuery)}&number=50&addRecipeInformation=true`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRecipes(data.results);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRecipeDetails = async (recipeId) => {
    setLoadingDetails(true);
    
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recipe details');
      }

      const data = await response.json();
      setRecipeDetails(data);
    } catch (err) {
      console.error('Error fetching recipe details:', err);
      setError('Failed to load recipe details. Please try again.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const openRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);
    getRecipeDetails(recipe.id);
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
    setRecipeDetails(null);
  };

  // Recipe Details Modal Component
  const RecipeDetailsModal = () => {
    if (!selectedRecipe) return null;

    return (
      <Modal
        visible={!!selectedRecipe}
        animationType="slide"
        onRequestClose={closeRecipeDetails}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeRecipeDetails} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedRecipe.title}
            </Text>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          </View>

          {loadingDetails ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B6B" />
              <Text style={styles.loadingText}>Loading recipe details...</Text>
            </View>
          ) : recipeDetails ? (
            <ScrollView contentContainerStyle={styles.recipeDetailsContainer}>
              <Image 
                source={{ uri: recipeDetails.image }} 
                style={styles.recipeDetailImage} 
                resizeMode="cover"
              />
              
              <View style={styles.recipeOverview}>
                <View style={styles.recipeStats}>
                  <View style={styles.recipeStat}>
                    <Ionicons name="time-outline" size={24} color="#666" />
                    <Text style={styles.recipeStatValue}>{recipeDetails.readyInMinutes}</Text>
                    <Text style={styles.recipeStatLabel}>minutes</Text>
                  </View>
                  <View style={styles.recipeStat}>
                    <Ionicons name="restaurant-outline" size={24} color="#666" />
                    <Text style={styles.recipeStatValue}>{recipeDetails.servings}</Text>
                    <Text style={styles.recipeStatLabel}>servings</Text>
                  </View>
                  <View style={styles.recipeStat}>
                    <Ionicons name="flame-outline" size={24} color="#666" />
                    <Text style={styles.recipeStatValue}>
                      {Math.round(recipeDetails.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || 0)}
                    </Text>
                    <Text style={styles.recipeStatLabel}>calories</Text>
                  </View>
                </View>

                {/* Diet Tags */}
                {(recipeDetails.vegetarian || recipeDetails.vegan || recipeDetails.glutenFree) && (
                  <View style={styles.dietTags}>
                    {recipeDetails.vegetarian && (
                      <View style={[styles.dietTag, {backgroundColor: '#E8F5E9'}]}>
                        <Ionicons name="leaf" size={16} color="#4CAF50" />
                        <Text style={[styles.dietTagText, {color: '#4CAF50'}]}>Vegetarian</Text>
                      </View>
                    )}
                    {recipeDetails.vegan && (
                      <View style={[styles.dietTag, {backgroundColor: '#DCEDC8'}]}>
                        <Ionicons name="nutrition" size={16} color="#8BC34A" />
                        <Text style={[styles.dietTagText, {color: '#8BC34A'}]}>Vegan</Text>
                      </View>
                    )}
                    {recipeDetails.glutenFree && (
                      <View style={[styles.dietTag, {backgroundColor: '#FFF3E0'}]}>
                        <Ionicons name="medical" size={16} color="#FF9800" />
                        <Text style={[styles.dietTagText, {color: '#FF9800'}]}>Gluten Free</Text>
                      </View>
                    )}
                  </View>
                )}
                
                {/* Ingredients Section */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  {recipeDetails.extendedIngredients?.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientItem}>
                      <View style={styles.ingredientBullet} />
                      <Text style={styles.ingredientText}>
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Instructions Section */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Instructions</Text>
                  {recipeDetails.analyzedInstructions?.[0]?.steps.map((step, index) => (
                    <View key={index} style={styles.instructionItem}>
                      <View style={styles.instructionNumber}>
                        <Text style={styles.instructionNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.instructionText}>{step.step}</Text>
                    </View>
                  ))}
                  {(!recipeDetails.analyzedInstructions || recipeDetails.analyzedInstructions.length === 0) && (
                    <Text style={styles.noInstructionsText}>
                      {recipeDetails.instructions ? 
                        recipeDetails.instructions : 
                        "No detailed instructions available for this recipe."
                      }
                    </Text>
                  )}
                </View>

                {/* Nutrition Section */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Nutrition Information</Text>
                  <View style={styles.nutritionContainer}>
                    {recipeDetails.nutrition?.nutrients?.slice(0, 6).map((nutrient, index) => (
                      <View key={index} style={styles.nutrientItem}>
                        <Text style={styles.nutrientName}>{nutrient.name}</Text>
                        <Text style={styles.nutrientValue}>{Math.round(nutrient.amount)} {nutrient.unit}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={32} color="#FF6B6B" />
              <Text style={styles.errorText}>Failed to load recipe details</Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for recipes..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchRecipes}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton} onPress={searchRecipes}>
          <Text style={styles.searchButtonText}>Find Recipes</Text>
        </TouchableOpacity>

        {/* Loading indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={styles.loadingText}>Searching for delicious recipes...</Text>
          </View>
        )}

        {/* Error message */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Recipe Results */}
        {recipes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipes</Text>
            <View style={styles.recipesGrid}>
              {recipes.map((recipe) => (
                <TouchableOpacity 
                  key={recipe.id} 
                  style={styles.recipeCard}
                  onPress={() => openRecipeDetails(recipe)}
                >
                  <Image
                    source={{ uri: recipe.image }}
                    style={styles.recipeImage}
                    resizeMode="cover"
                  />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeName} numberOfLines={2}>{recipe.title}</Text>
                    <View style={styles.recipeMeta}>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <Text style={styles.recipeTime}>{recipe.readyInMinutes} min</Text>
                      {recipe.vegetarian && (
                        <View style={styles.tagContainer}>
                          <Ionicons name="leaf" size={14} color="#4CAF50" />
                          <Text style={[styles.tagText, {color: '#4CAF50'}]}>Veg</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.recipeMeta}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.recipeRating}>{recipe.spoonacularScore ? (recipe.spoonacularScore / 20).toFixed(1) : "4.5"}</Text>
                      <View style={styles.caloriesContainer}>
                        <Ionicons name="flame-outline" size={16} color="#FF6B6B" />
                        <Text style={styles.calories}>{recipe.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || "250"} cal</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* No Results */}
        {!loading && recipes.length === 0 && searchQuery.length > 0 && (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.noResultsText}>No recipes found</Text>
            <Text style={styles.noResultsSubtext}>Try another search term</Text>
          </View>
        )}

        {/* Initial Empty State */}
        {!loading && recipes.length === 0 && searchQuery.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="restaurant-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>Looking for something delicious?</Text>
            <Text style={styles.emptyStateSubtext}>Search for recipes to get started</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Recipe Details Modal */}
      <RecipeDetailsModal />
      
      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  errorText: {
    marginTop: 16,
    color: '#D32F2F',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recipeCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: 160,
  },
  recipeInfo: {
    padding: 10,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    height: 40,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  recipeTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginRight: 8,
  },
  recipeRating: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
    marginLeft: 4,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  calories: {
    fontSize: 14,
    color: '#FF6B6B',
    marginLeft: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  tagText: {
    fontSize: 12,
    marginLeft: 2,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  noResultsSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  recipeDetailsContainer: {
    flexGrow: 1,
  },
  recipeDetailImage: {
    width: '100%',
    height: 250,
  },
  recipeOverview: {
    padding: 16,
  },
  recipeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recipeStat: {
    alignItems: 'center',
  },
  recipeStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  recipeStatLabel: {
    fontSize: 14,
    color: '#666',
  },
  dietTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dietTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  dietTagText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ingredientBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  noInstructionsText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  nutritionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutrientItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nutrientName: {
    fontSize: 16,
    color: '#333',
  },
  nutrientValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});
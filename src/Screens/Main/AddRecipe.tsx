import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { categories } from '../../../src/data/staticData';

type RootStackParamList = {
  Profile: undefined;
  AddRecipe: undefined;
};

type AddRecipeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddRecipe'>;

interface AddRecipeProps {
  navigation: AddRecipeScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
const CATEGORY_OPTIONS = categories.map(category => category.name);

export default function AddRecipe({ navigation }: AddRecipeProps) {
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const validateForm = () => {
    if (!recipeName.trim()) {
      Alert.alert('Error', 'Please enter a recipe name');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }
    if (!ingredients.trim()) {
      Alert.alert('Error', 'Please enter ingredients');
      return false;
    }
    if (!instructions.trim()) {
      Alert.alert('Error', 'Please enter instructions');
      return false;
    }
    if (!cookingTime.trim()) {
      Alert.alert('Error', 'Please enter cooking time');
      return false;
    }
    if (!servings.trim()) {
      Alert.alert('Error', 'Please enter number of servings');
      return false;
    }
    return true;
  };

  const handleAddRecipe = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically save the recipe to your backend
      Alert.alert(
        'Success',
        'Recipe added successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePicker = () => {
    // Image picker logic would go here
    Alert.alert(
      'Add Recipe Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => {
            // Implement camera functionality
            Alert.alert('Coming Soon', 'Camera functionality will be available soon!');
          }
        },
        {
          text: 'Choose from Library',
          onPress: () => {
            // Implement image picker
            Alert.alert('Coming Soon', 'Image picker functionality will be available soon!');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const renderPickerModal = (visible: boolean, options: string[], selectedValue: string, onSelect: (value: string) => void, onClose: () => void) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Option</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.pickerOptions}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pickerOption,
                  selectedValue === option && styles.selectedOption
                ]}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <Text style={[
                  styles.pickerOptionText,
                  selectedValue === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
                {selectedValue === option && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Recipe</Text>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleAddRecipe}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imagePickerContainer}>
            <TouchableOpacity 
              style={[
                styles.imagePicker,
                selectedImage && styles.imagePickerWithImage
              ]}
              onPress={handleImagePicker}
            >
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.selectedImage}
                />
              ) : (
                <>
                  <Ionicons name="camera" size={40} color="#999" />
                  <Text style={styles.imagePickerText}>Add Recipe Photo</Text>
                  <Text style={styles.imagePickerSubtext}>Recommended size: 1200x800px</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Recipe Name *</Text>
              <TextInput
                style={styles.textInput}
                value={recipeName}
                onChangeText={setRecipeName}
                placeholder="Enter recipe name"
                placeholderTextColor="#999"
                returnKeyType="next"
                onSubmitEditing={() => {
                  // Focus next input
                }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.textInput, styles.textarea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your recipe"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ingredients *</Text>
              <TextInput
                style={[styles.textInput, styles.textarea]}
                value={ingredients}
                onChangeText={setIngredients}
                placeholder="List ingredients (one per line)"
                placeholderTextColor="#999"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Instructions *</Text>
              <TextInput
                style={[styles.textInput, styles.textarea]}
                value={instructions}
                onChangeText={setInstructions}
                placeholder="Step by step instructions"
                placeholderTextColor="#999"
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Cooking Time *</Text>
                <TextInput
                  style={styles.textInput}
                  value={cookingTime}
                  onChangeText={setCookingTime}
                  placeholder="e.g. 30 mins"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Servings *</Text>
                <TextInput
                  style={styles.textInput}
                  value={servings}
                  onChangeText={setServings}
                  placeholder="e.g. 4"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Difficulty</Text>
                <TouchableOpacity 
                  style={styles.pickerContainer}
                  onPress={() => setShowDifficultyPicker(true)}
                >
                  <Text style={styles.pickerText}>{difficulty}</Text>
                  <Ionicons name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Category</Text>
                <TouchableOpacity 
                  style={styles.pickerContainer}
                  onPress={() => setShowCategoryPicker(true)}
                >
                  <Text style={styles.pickerText}>{category}</Text>
                  <Ionicons name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {renderPickerModal(
          showDifficultyPicker,
          DIFFICULTY_OPTIONS,
          difficulty,
          setDifficulty,
          () => setShowDifficultyPicker(false)
        )}

        {renderPickerModal(
          showCategoryPicker,
          CATEGORY_OPTIONS,
          category,
          setCategory,
          () => setShowCategoryPicker(false)
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  saveButton: {
    padding: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  imagePickerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  imagePicker: {
    width: width * 0.8,
    height: 200,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  imagePickerWithImage: {
    borderStyle: 'solid',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  imagePickerSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  formSection: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pickerText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  pickerOptions: {
    padding: 16,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedOption: {
    backgroundColor: '#F5F5F5',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
}); 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { profileAPI } from '../../services/api';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { API_URL } from '../../config';

type RootStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
};

type EditProfileProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EditProfile'>;
};

const { width } = Dimensions.get('window');

export default function EditProfile({ navigation }: EditProfileProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [firebaseUid, setFirebaseUid] = useState<string>('');

  useEffect(() => {
    // Get user info from Firebase auth
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email || '');
      setFirebaseUid(user.uid);
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const user = getAuth().currentUser;
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
      
      // Update state with profile data
      setFirstName(profileData.user?.first_name || '');
      setLastName(profileData.user?.last_name || '');
      setLocation(profileData.location || '');
      setBio(profileData.bio || '');
      setProfileImage(profileData.profile_picture || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          Alert.alert('Error', `Failed to fetch profile: ${error.response.data.detail || 'Unknown error'}`);
        } else if (error.request) {
          console.error('Error request:', error.request);
          Alert.alert('Error', 'Could not connect to the server. Please check your internet connection.');
        } else {
          console.error('Error message:', error.message);
          Alert.alert('Error', `Failed to fetch profile: ${error.message}`);
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      // Create a plain object first to ensure data is correct
      const profileData = {
        bio: bio || '',
        location: location || '',
        user: {
          first_name: firstName || '',
          last_name: lastName || '',
          email: email || '',
        }
      };

      console.log('Sending profile data:', profileData);
      
      // Create form data
      const data = new FormData();
      data.append('bio', profileData.bio);
      data.append('location', profileData.location);
      data.append('user.first_name', profileData.user.first_name);
      data.append('user.last_name', profileData.user.last_name);
      data.append('user.email', profileData.user.email);
      
      if (profileImage) {
        data.append('profile_picture', {
          uri: profileImage,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }

      console.log('Sending update request to:', firebaseUid);
      const response = await profileAPI.updateProfile(firebaseUid, data);
      console.log('Update response:', response.data);
      
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          Alert.alert('Error', `Failed to update profile: ${error.response.data.detail || 'Unknown error'}`);
        } else if (error.request) {
          console.error('Error request:', error.request);
          Alert.alert('Error', 'Could not connect to the server. Please check your internet connection.');
        } else {
          console.error('Error message:', error.message);
          Alert.alert('Error', `Failed to update profile: ${error.message}`);
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    // Password change logic would go here
    Alert.alert('Success', 'Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const renderProfileSection = () => (
    <View style={styles.formSection}>
      <View style={styles.imagePickerContainer}>
        {profileImage ? (
          <Image 
            source={{ uri: profileImage }} 
            style={styles.profileImage} 
          />
        ) : (
          <View style={[styles.profileImage, styles.defaultProfileImage]}>
            <Ionicons name="person" size={40} color="#999" />
          </View>
        )}
        <TouchableOpacity 
          style={styles.changeImageButton}
          onPress={handleImagePicker}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
          <Text style={styles.changeImageText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Name</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Last Name</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Location</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter your location"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Bio</Text>
        <View style={styles.textareaContainer}>
          <Ionicons name="book-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.textareaInput}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );

  const renderPasswordSection = () => (
    <View style={styles.formSection}>
      <View style={styles.sectionIntro}>
        <Ionicons name="lock-closed" size={36} color="#007AFF" />
        <Text style={styles.sectionIntroTitle}>Change Password</Text>
        <Text style={styles.sectionIntroText}>
          Create a new password that is secure and easy to remember
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Current Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            placeholderTextColor="#999"
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons 
              name={passwordVisible ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#999" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>New Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            placeholderTextColor="#999"
            secureTextEntry={!passwordVisible}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="#999"
            secureTextEntry={!passwordVisible}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.changePasswordButton}
        onPress={handleChangePassword}
      >
        <Text style={styles.changePasswordButtonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
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
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>{loading ? <ActivityIndicator size="small" color="#fff" /> : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeSection === 'profile' && styles.activeTab
            ]}
            onPress={() => setActiveSection('profile')}
          >
            <Text style={[
              styles.tabText,
              activeSection === 'profile' && styles.activeTabText
            ]}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeSection === 'password' && styles.activeTab
            ]}
            onPress={() => setActiveSection('password')}
          >
            <Text style={[
              styles.tabText,
              activeSection === 'password' && styles.activeTabText
            ]}>Password</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeSection === 'profile' ? renderProfileSection() : renderPasswordSection()}
        </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  formSection: {
    padding: 20,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  defaultProfileImage: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 12,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  changeImageText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  textareaContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    alignItems: 'flex-start',
  },
  textareaInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A1A',
    height: 100,
  },
  eyeIcon: {
    padding: 8,
  },
  sectionIntro: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionIntroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 8,
  },
  sectionIntroText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  changePasswordButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  changePasswordButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
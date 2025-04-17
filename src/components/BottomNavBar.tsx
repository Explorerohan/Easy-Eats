import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import rohan from '../../assets/rohan.jpg';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Discover: undefined;
  Favorites: undefined;
  Chat: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function BottomNavBar() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();

  const isActive = (routeName: keyof RootStackParamList) => {
    return route.name === routeName;
  };

  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Home')}
      >
        <View style={isActive('Home') ? styles.activeIconBackground : null}>
          <Ionicons 
            name="home" 
            size={24} 
            color={isActive('Home') ? '#007AFF' : '#666'} 
          />
        </View>
        <Text style={isActive('Home') ? styles.navTextActive : styles.navText}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Discover')}
      >
        <View style={isActive('Discover') ? styles.activeIconBackground : null}>
          <Ionicons 
            name="compass-outline" 
            size={24} 
            color={isActive('Discover') ? '#007AFF' : '#666'} 
          />
        </View>
        <Text style={isActive('Discover') ? styles.navTextActive : styles.navText}>Discover</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Favorites')}
      >
        <View style={isActive('Favorites') ? styles.activeIconBackground : null}>
          <Ionicons 
            name="heart-outline" 
            size={24} 
            color={isActive('Favorites') ? '#007AFF' : '#666'} 
          />
        </View>
        <Text style={isActive('Favorites') ? styles.navTextActive : styles.navText}>Favorites</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Chat')}
      >
        <View style={isActive('Chat') ? styles.activeIconBackground : null}>
          <Ionicons 
            name="chatbubble-outline" 
            size={24} 
            color={isActive('Chat') ? '#007AFF' : '#666'} 
          />
        </View>
        <Text style={isActive('Chat') ? styles.navTextActive : styles.navText}>Chat</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Profile')}
      >
        <View style={isActive('Profile') ? styles.activeIconBackground : null}>
          <Image 
            source={rohan} 
            style={[
              styles.profileIcon,
              isActive('Profile') && styles.activeProfileIcon
            ]} 
          />
        </View>
        <Text style={isActive('Profile') ? styles.navTextActive : styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  activeIconBackground: {
    backgroundColor: '#E8F2FF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 4,
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
  },
  activeProfileIcon: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
}); 
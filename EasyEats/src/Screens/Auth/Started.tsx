import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Importing LinearGradient
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Started: undefined;
    Login: undefined;
    Signup: undefined;
    Home: undefined;
};

type StartedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Started'>;

interface StartedProps {
    navigation: StartedScreenNavigationProp;
}

export default function Started({ navigation }: StartedProps) {
    const handleLogin = () => {
        navigation.navigate('Login');
    };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/fryrice.jpg')}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        {/* Gradient overlay on the background image */}
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 0.8)']} 
          style={styles.imageOverlay}
        />

        {/* Content area without dark background */}
        <View style={styles.contentArea}>
          <Text style={styles.title}>Cook Like a Chef</Text>
          <Text style={styles.subtitle}>
            Easy Eats is a user-friendly recipe app designed for those who are new to cooking and want to try new recipes at home.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentArea: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', 
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0', 
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007A4D',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF', 
    fontWeight: 'bold',
  },
});

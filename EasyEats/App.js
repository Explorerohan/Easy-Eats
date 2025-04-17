import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Started from './src/Screens/Auth/Started';
import Login from './src/Screens/Auth/Login';
import Signup from './src/Screens/Auth/Signup';
import HomePage from './src/Screens/Main/HomePage';
import Discover from './src/Screens/Main/Discover';
import Favorites from './src/Screens/Main/Favorites';
import Chat from './src/Screens/Main/Chat';
import Profile from './src/Screens/Main/Profile';
import EditProfile from './src/Screens/Main/Editprofile';
import AddRecipe from './src/Screens/Main/AddRecipe';
import { AuthProvider, useAuth } from './context/AuthContext';

const Stack = createStackNavigator();

function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Started" component={Started} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="Discover" component={Discover} />
            <Stack.Screen name="Favorites" component={Favorites} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="AddRecipe" component={AddRecipe} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

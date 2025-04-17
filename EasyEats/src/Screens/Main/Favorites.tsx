import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNavBar from '../../components/BottomNavBar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Favorites() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Favorites</Text>
          </View>

          {/* Favorites List */}
          <View style={styles.favoritesList}>
            <TouchableOpacity style={styles.recipeCard}>
              <Image
                source={require('../../../assets/pasta.webp')}
                style={styles.recipeImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.recipeGradient}
              >
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeTitle}>Italian Pasta</Text>
                  <View style={styles.recipeMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={16} color="#fff" />
                      <Text style={styles.metaText}>30m</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.metaText}>4.8</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.recipeCard}>
              <Image
                source={require('../../../assets/curry.webp')}
                style={styles.recipeImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.recipeGradient}
              >
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeTitle}>Chicken Curry</Text>
                  <View style={styles.recipeMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={16} color="#fff" />
                      <Text style={styles.metaText}>45m</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.metaText}>4.6</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  favoritesList: {
    padding: 20,
  },
  recipeCard: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#fff',
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
  recipeInfo: {
    gap: 8,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  recipeMeta: {
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
});
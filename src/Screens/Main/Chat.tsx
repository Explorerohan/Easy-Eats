import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import { SafeAreaView as SafeAreaViewRN } from 'react-native-safe-area-context';

export default function Chat() {
  return (
    <SafeAreaViewRN style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chat</Text>
            <TouchableOpacity style={styles.newChatButton}>
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations"
              placeholderTextColor="#666"
            />
          </View>

          {/* Chat List */}
          <ScrollView style={styles.chatList}>
            <TouchableOpacity style={styles.chatItem}>
              <Image
                source={require('../../../assets/rohan.jpg')}
                style={styles.avatar}
              />
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>Chef Support</Text>
                  <Text style={styles.chatTime}>2m ago</Text>
                </View>
                <Text style={styles.lastMessage}>How can I help you today?</Text>
              </View>
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>2</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.chatItem}>
              <Image
                source={require('../../../assets/rohan.jpg')}
                style={styles.avatar}
              />
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>Recipe Community</Text>
                  <Text style={styles.chatTime}>1h ago</Text>
                </View>
                <Text style={styles.lastMessage}>Share your cooking tips!</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.chatItem}>
              <Image
                source={require('../../../assets/rohan.jpg')}
                style={styles.avatar}
              />
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>Cooking Tips</Text>
                  <Text style={styles.chatTime}>2h ago</Text>
                </View>
                <Text style={styles.lastMessage}>Weekly cooking tips and tricks</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No conversations yet</Text>
            <Text style={styles.emptyStateSubtext}>Start chatting with our chefs and community</Text>
          </View>
        </View>
      </ScrollView>
      <BottomNavBar />
    </SafeAreaViewRN>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  newChatButton: {
    padding: 8,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chatTime: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
}); 
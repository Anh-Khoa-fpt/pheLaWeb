import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { authAPI } from '../services/api'
import Layout from '../components/layout/Layout'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const navigation = useNavigation()
  const { isLoggedIn, user, loading: authLoading } = useAuth()
  const slideAnim = useRef(new Animated.Value(-100)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigation.navigate('Login')
      return
    }

    if (isLoggedIn) {
      // Slide down animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isLoggedIn, authLoading, navigation])

  if (authLoading || !isLoggedIn) {
    return (
      <Layout>
        <View style={styles.container}>
          <View style={styles.card}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        </View>
      </Layout>
    )
  }

  return (
    <Layout>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.title}>Dashboard</Text>
          <View style={styles.content}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Chào mừng!</Text>
              {user && (
                <View style={styles.userInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>
                      {user.email || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tên:</Text>
                    <Text style={styles.infoValue}>
                      {user.fullName || user.name || user.email?.split('@')[0] || 'N/A'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 24,
  },
  content: {
    gap: 24,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 16,
  },
  userInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
})

export default Dashboard


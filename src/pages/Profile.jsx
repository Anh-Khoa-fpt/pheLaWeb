import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Layout from '../components/layout/Layout'

const Profile = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (e) {
        console.error('Error loading user:', e)
      }
    }
    loadUser()
  }, [])

  const displayName =
    user?.fullName || user?.name || user?.userName || user?.email?.split('@')[0] || 'Người dùng'

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.heroText}>
            <Text style={styles.eyebrow}>Tài khoản của bạn</Text>
            <Text style={styles.heroTitle}>{displayName}</Text>
            <Text style={styles.heroDesc}>
              Đây là trang tổng quan thông tin tài khoản. Các thông tin như địa chỉ giao hàng, lịch
              sử đơn hàng sẽ được hiển thị tại đây.
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Thông tin cơ bản</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || 'chưa cập nhật'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Họ tên</Text>
              <Text style={styles.infoValue}>
                {user?.fullName || user?.name || 'chưa cập nhật'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Số điện thoại</Text>
              <Text style={styles.infoValue}>{user?.phoneNumber || 'chưa cập nhật'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Vai trò</Text>
              <Text style={styles.infoValue}>{user?.role || 'Khách hàng'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  heroText: {
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroDesc: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
  },
})

export default Profile


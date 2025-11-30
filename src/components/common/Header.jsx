import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { authAPI } from '../../services/api'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const navigation = useNavigation()
  const { isLoggedIn, user, clearAuthState } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalCount, clearCart } = useCart()

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Dù API có lỗi, vẫn xóa token và user ở local
    } finally {
      // Clear auth state (sẽ tự động xóa AsyncStorage)
      await clearAuthState()
      // Xóa giỏ hàng khi đăng xuất
      clearCart()
      navigation.navigate('Home')
    }
  }

  const navItems = [
    { label: 'Trang Chủ', route: 'Home' },
    { label: 'Sản Phẩm', route: 'Products' },
    { label: 'Giới Thiệu', route: 'About' },
    { label: 'Liên Hệ', route: 'Contact' },
  ]

  return (
    <View style={styles.header}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.logo}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.logoIcon}>🐟</Text>
          <Text style={styles.logoText}>Cá Là Bạn</Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {totalCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuOpen(true)}
          >
            <View style={styles.menuIcon}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={menuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.menuContainer}>
            <ScrollView style={styles.menuContent}>
              {navItems.map((item) => (
                <TouchableOpacity
                  key={item.route}
                  style={styles.menuItem}
                  onPress={() => {
                    navigation.navigate(item.route)
                    setMenuOpen(false)
                  }}
                >
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}

              {isLoggedIn ? (
                <View style={styles.authSection}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      navigation.navigate('Profile')
                      setMenuOpen(false)
                    }}
                  >
                    <Text style={styles.menuItemText}>
                      Welcome, {user?.fullName || user?.name || user?.email?.split('@')[0] || 'User'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.menuItem, styles.logoutButton]}
                    onPress={() => {
                      handleLogout()
                      setMenuOpen(false)
                    }}
                  >
                    <Text style={styles.logoutText}>Đăng Xuất</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.authSection}>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => {
                      navigation.navigate('Login')
                      setMenuOpen(false)
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.loginText}>Đăng Nhập</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.signupButton}
                    onPress={() => {
                      navigation.navigate('SignUp')
                      setMenuOpen(false)
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.signupText}>Đăng Ký</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 40,
    paddingBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3c72',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 2,
    backgroundColor: '#2c3e50',
    borderRadius: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 'auto',
    maxHeight: '80%',
  },
  menuContent: {
    padding: 20,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  authSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1e3c72',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginBottom: 12,
  },
  loginText: {
    color: '#1e3c72',
    fontWeight: '700',
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#1e3c72',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    shadowColor: '#1e3c72',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  signupText: {
    color: '#fff',
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})

export default Header


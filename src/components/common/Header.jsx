import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useCart } from '../../contexts/CartContext'

const navItems = [
  { label: 'Trang Chủ', route: 'Home' },
  { label: 'Tất cả sản phẩm', route: 'Product' },
  { label: 'Giới Thiệu', route: 'About' },
  { label: 'Liên Hệ', route: 'Contact' },
  { label: 'Lịch sử đặt hàng', route: 'OrderHistory' },
  { label: 'Giỏ Hàng', route: 'Cart' },
]

const Header = () => {
  const navigation = useNavigation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalCount } = useCart()

  return (
    <View style={styles.header}>
      <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.logo}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.logoIcon}>🍵</Text>
            <Text style={styles.logoText}>Matte Matcha & Teabar</Text>
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
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0b3d24',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(149, 210, 166, 0.2)',
    paddingTop: 36,
    paddingBottom: 12,
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
    color: '#e0f8e8',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartIcon: {
    fontSize: 24,
    color: '#d9ffe4',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#facc15',
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
    backgroundColor: '#c2ffd8',
    borderRadius: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 23, 10, 0.85)',
  },
  menuContainer: {
    backgroundColor: '#042015',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 'auto',
    maxHeight: '80%',
    borderColor: 'rgba(149, 210, 166, 0.4)',
    borderWidth: 1,
  },
  menuContent: {
    padding: 20,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemText: {
    fontSize: 16,
    color: '#f8fafc',
  },
})

export default Header


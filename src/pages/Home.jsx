import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Layout from '../components/layout/Layout'
import { PRODUCTS } from '../data/products'
import { useCart } from '../contexts/CartContext'
import ProductModal from '../components/common/ProductModal'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const navigation = useNavigation()
  const { isLoggedIn } = useAuth()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useCart()

  const featuredProducts = PRODUCTS.slice(0, 4)

  const handleAddToCart = async (product) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Đăng nhập',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      )
      return
    }
    addToCart(product)
    // Show success feedback
    Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng!', [{ text: 'OK' }])
  }

  return (
    <Layout>
      <ScrollView style={styles.container}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image
            source={require('../../public/hero-ocean.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Cá Tươi Sống Chất Lượng Cao</Text>
            <Text style={styles.heroSubtitle}>
              Chuyên cung cấp các loại cá tươi sống, đảm bảo chất lượng và an toàn vệ sinh thực phẩm
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => navigation.navigate('Products')}
                activeOpacity={0.8}
              >
                <Text style={styles.btnPrimaryText}>Xem Sản Phẩm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => navigation.navigate('About')}
                activeOpacity={0.8}
              >
                <Text style={styles.btnSecondaryText}>Tìm Hiểu Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Sản Phẩm Nổi Bật</Text>
          <View style={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => {
                  setSelectedProduct(product)
                  setIsModalOpen(true)
                }}
              >
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productHeader}>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <Text style={styles.productName}>{product.name}</Text>
                </View>
                <Text style={styles.productDescription} numberOfLines={2}>
                  {product.desc}
                </Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <TouchableOpacity
                    style={styles.btnAddCart}
                    onPress={(e) => {
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                  >
                    <Text style={styles.btnAddCartText}>Thêm Vào Giỏ</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.viewAllText}>Xem Tất Cả Sản Phẩm</Text>
          </TouchableOpacity>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          {isLoggedIn ? (
            <>
              <Text style={styles.ctaTitle}>Sẵn Sàng Mua Hàng Ngay?</Text>
              <Text style={styles.ctaSubtitle}>
                Khám phá các sản phẩm cá tươi sống chất lượng cao
              </Text>
              <TouchableOpacity
                style={styles.btnLarge}
                onPress={() => navigation.navigate('Products')}
              >
                <Text style={styles.btnLargeText}>Mua Hàng Ngay</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.ctaTitle}>Sẵn Sàng Đặt Hàng Ngay?</Text>
              <Text style={styles.ctaSubtitle}>
                Đăng ký tài khoản để nhận nhiều ưu đãi đặc biệt
              </Text>
              <TouchableOpacity
                style={styles.btnLarge}
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={styles.btnLargeText}>Đăng Ký Ngay</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
      />
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    height: 400,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 60, 114, 0.7)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    position: 'relative',
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: '#fff',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  btnPrimaryText: {
    color: '#1e3c72',
    fontWeight: '700',
    fontSize: 16,
  },
  btnSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  btnSecondaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  productsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1e3c72',
  },
  productsGrid: {
    gap: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'contain',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  productHeader: {
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#667eea',
  },
  btnAddCart: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  btnAddCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  viewAllButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaSection: {
    backgroundColor: '#1e3c72',
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 28,
    overflow: 'hidden',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.95,
  },
  btnLarge: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  btnLargeText: {
    color: '#1e3c72',
    fontSize: 18,
    fontWeight: '700',
  },
})

export default Home


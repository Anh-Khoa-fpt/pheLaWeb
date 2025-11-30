import React, { useMemo, useState } from 'react'
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
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { PRODUCTS } from '../data/products'
import ProductModal from '../components/common/ProductModal'

const Products = () => {
  const navigation = useNavigation()
  const { isLoggedIn } = useAuth()
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useCart()

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
    Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng!', [{ text: 'OK' }])
  }

  const categories = useMemo(() => {
    const unique = Array.from(new Set(PRODUCTS.map((item) => item.category)))
    return ['all', ...unique]
  }, [])

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS
    return PRODUCTS.filter((product) => product.category === activeCategory)
  }, [activeCategory])

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Danh mục sản phẩm</Text>
          <Text style={styles.heroTitle}>Chọn loại cá tươi theo nhu cầu của bạn</Text>
          <Text style={styles.heroDesc}>
            Hơn 50 loại cá được cập nhật theo mùa, truy xuất nguồn gốc rõ ràng và giao hàng trong
            vòng 24 giờ tại TP.HCM và các tỉnh lân cận.
          </Text>
          <View style={styles.highlight}>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightNumber}>100%</Text>
              <Text style={styles.highlightLabel}>Kiểm định an toàn</Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightNumber}>12+</Text>
              <Text style={styles.highlightLabel}>Kho lạnh khu vực</Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
          contentContainerStyle={styles.categoryFilterContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                activeCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  activeCategory === category && styles.categoryChipTextActive,
                ]}
              >
                {category === 'all' ? 'Tất cả' : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => {
                setSelectedProduct(product)
                setIsModalOpen(true)
              }}
            >
              <View style={styles.productCardContent}>
                <View style={styles.productImageContainer}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.productHeader}>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDesc} numberOfLines={2}>
                    {product.desc}
                  </Text>
                </View>
              </View>
              <View style={styles.productMeta}>
                <Text style={styles.productPrice}>{product.price}</Text>
                <Text style={styles.productFreshness}>{product.freshness}</Text>
              </View>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={(e) => {
                  e.stopPropagation()
                  handleAddToCart(product)
                }}
              >
                <Text style={styles.btnPrimaryText}>Thêm vào giỏ</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  eyebrow: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  heroDesc: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
    marginBottom: 20,
  },
  highlight: {
    flexDirection: 'row',
    gap: 20,
  },
  highlightItem: {
    flex: 1,
  },
  highlightNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  highlightLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  categoryFilter: {
    marginVertical: 20,
  },
  categoryFilterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryChipActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  productsGrid: {
    padding: 20,
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
    position: 'relative',
    overflow: 'hidden',
  },
  productCardContent: {
    position: 'relative',
  },
  productImageContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 1,
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  productHeader: {
    marginBottom: 12,
    paddingRight: 90,
  },
  productCategory: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 4,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  productDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  productFreshness: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  btnPrimary: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default Products


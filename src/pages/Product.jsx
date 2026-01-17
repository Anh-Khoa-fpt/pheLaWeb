import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native'
import Layout from '../components/layout/Layout'
import ProductModal from '../components/common/ProductModal'
import { useCart } from '../contexts/CartContext'
import { PRODUCTS } from '../data/products'

const Product = () => {
  const { addToCart } = useCart()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const categories = useMemo(
    () => ['all', ...new Set(PRODUCTS.map((product) => product.category))],
    []
  )
  const [filter, setFilter] = useState('all')

  const filteredProducts = useMemo(() => {
    if (filter === 'all') return PRODUCTS
    return PRODUCTS.filter((product) => product.category === filter)
  }, [filter])

  const handleOpenModal = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Thực đơn Matte Matcha & Teabarr</Text>
          <Text style={styles.heroDesc}>
            Mọi matcha, trân châu tea, soda và bánh ngọt được tuyển chọn kỹ càng tại Matte Matcha & Teabarr Quận 1.
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                filter === category && styles.filterChipActive,
              ]}
              onPress={() => setFilter(category)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === category && styles.filterTextActive,
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
              activeOpacity={0.8}
              onPress={() => handleOpenModal(product)}
            >
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDesc}>{product.desc}</Text>
                <View style={styles.productMeta}>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(product)}
                  >
                    <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    margin: 16,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#0b3221',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#e2ffe0',
    marginBottom: 8,
  },
  heroDesc: {
    color: '#c7f1d7',
    fontSize: 16,
    lineHeight: 22,
  },
  filterRow: {
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 67, 38, 0.3)',
    backgroundColor: '#f3f9f4',
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: '#0f3e24',
    borderColor: '#0f3e24',
  },
  filterText: {
    color: '#0f3e24',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#d8ffe5',
  },
  productsGrid: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#f6fbf7',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(17, 67, 39, 0.2)',
    overflow: 'hidden',
    marginBottom: 16,
    minHeight: 150,
    alignItems: 'stretch',
  },
  productImage: {
    width: 120,
    height: '100%',
    minHeight: 120,
  },
  productInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  productCategory: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1.2,
    color: '#1f4531',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#153823',
    marginBottom: 6,
  },
  productDesc: {
    fontSize: 14,
    color: '#1a422f',
    lineHeight: 20,
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
  },
  addButton: {
    backgroundColor: '#0a3b21',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: '#fef9c3',
    fontWeight: '600',
  },
})

export default Product

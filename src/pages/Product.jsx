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
import { useCart } from '../contexts/CartContext'
import { PRODUCTS } from '../data/products'

const Product = () => {
  const { addToCart } = useCart()
  const categories = useMemo(
    () => ['all', ...new Set(PRODUCTS.map((product) => product.category))],
    []
  )
  const [filter, setFilter] = useState('all')

  const filteredProducts = useMemo(() => {
    if (filter === 'all') return PRODUCTS
    return PRODUCTS.filter((product) => product.category === filter)
  }, [filter])

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Danh sách đồ uống</Text>
          <Text style={styles.heroDesc}>
            Tất cả sản phẩm hiện có tại Phê La Order đều tập trung ở đây. Lọc theo category, add
            vào giỏ là xong.
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
            <View key={product.id} style={styles.productCard}>
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
            </View>
          ))}
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
    margin: 16,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#0f172a',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fef9c3',
    marginBottom: 8,
  },
  heroDesc: {
    color: '#d1d5db',
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
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  filterText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fef9c3',
  },
  productsGrid: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 16,
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  productCategory: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1.2,
    color: '#475569',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  productDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
  },
  addButton: {
    backgroundColor: '#0f172a',
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

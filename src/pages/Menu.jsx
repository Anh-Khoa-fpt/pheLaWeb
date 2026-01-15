import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native'
import Layout from '../components/layout/Layout'
import { PRODUCTS } from '../data/products'
import { useCart } from '../contexts/CartContext'
import ProductModal from '../components/common/ProductModal'

const CATEGORY_DESCRIPTIONS = {
  'Cà phê truyền thống': 'Bảo chứng bởi tay nghề barista Phê La, phục vụ đậm đà.',
  'Cà phê sữa': 'Sữa tươi làm từ nguồn sạch, cân đối vị ngọt và đắng.',
  'Trà trái cây': 'Trà cold brew kết hợp trái cây thượng hạng, không đường.',
  'Trà xanh': 'Matcha tuyển chọn 100% từ Kyoto, đánh bọt nhẹ.',
  Soda: 'Nước có ga pha cùng thảo mộc và tinh dầu chanh sả.',
}

const Menu = () => {
  const categories = useMemo(
    () => ['all', ...new Set(PRODUCTS.map((product) => product.category))],
    []
  )
  const [activeCategory, setActiveCategory] = useState('all')

  const groupedProducts = useMemo(() => {
    return PRODUCTS.reduce((acc, product) => {
      const section = acc[product.category] || []
      return {
        ...acc,
        [product.category]: [...section, product],
      }
    }, {})
  }, [])

  const filteredGroups = useMemo(() => {
    if (activeCategory === 'all') return groupedProducts
    return Object.keys(groupedProducts).reduce((acc, key) => {
      if (key === activeCategory) {
        acc[key] = groupedProducts[key]
      }
      return acc
    }, {})
  }, [activeCategory, groupedProducts])

  const { addToCart } = useCart()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Thực đơn Phê La Order</Text>
          <Text style={styles.heroTitle}>Tất cả ly nước đều có thể được order trong phút chốc</Text>
          <Text style={styles.heroSubtitle}>
            Chúng mình tổng hợp từng loại đồ uống theo nhóm, ghi rõ vị đặc trưng và khuyến nghị
            phục vụ nóng/lạnh. Nhấn “Thêm vào giỏ” để gom mọi thứ bạn cần trước khi lấy ở quầy.
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
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

        <View style={styles.tagline}>
          <Text style={styles.taglineText}>
            Chọn category để dễ dàng tìm món, mỗi món có thể thêm vào giỏ với số lượng tùy ý.
          </Text>
        </View>

        {Object.entries(filteredGroups).map(([category, items]) => (
            <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View>
                <Text style={styles.categoryTitle}>{category}</Text>
                <Text style={styles.categoryDesc}>
                  {CATEGORY_DESCRIPTIONS[category] || 'Hương vị đặc trưng được đội ngũ chúng mình chọn lọc.'}
                </Text>
              </View>
              <Text style={styles.categoryBadge}>{items.length} món</Text>
            </View>

            <View style={styles.productGrid}>
              {items.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedProduct(product)
                    setIsModalOpen(true)
                  }}
                >
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <View style={styles.productBody}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    <Text style={styles.productDesc} numberOfLines={2}>
                      {product.desc}
                    </Text>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={(event) => {
                        event.stopPropagation()
                        addToCart(product)
                      }}
                    >
                      <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
    margin: 16,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#fef9c3',
    borderWidth: 1,
    borderColor: '#fde68a',
    marginBottom: 12,
  },
  heroLabel: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 2,
    color: '#92400e',
    marginBottom: 8,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#3f1d0a',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#51311b',
    lineHeight: 22,
  },
  tagline: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#0f172a',
    borderRadius: 20,
    marginBottom: 20,
  },
  taglineText: {
    color: '#fef9c3',
    fontSize: 14,
  },
  categorySection: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  categoryDesc: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  categoryBadge: {
    backgroundColor: '#eab308',
    color: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontWeight: '700',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  productCard: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productBody: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
    marginVertical: 4,
  },
  productDesc: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fef9c3',
    fontSize: 14,
    fontWeight: '700',
  },
})

export default Menu

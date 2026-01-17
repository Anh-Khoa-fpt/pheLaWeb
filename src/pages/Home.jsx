import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Layout from '../components/layout/Layout'
import { PRODUCTS } from '../data/products'
import { useCart } from '../contexts/CartContext'
import ProductModal from '../components/common/ProductModal'

const highlights = [
  {
    icon: '🍃',
    title: 'Matcha Nhật Bản',
    desc: 'Bột matcha 100% tự nhiên, chính hãng từ Nhật Bản.',
  },
  {
    icon: '🫖',
    title: 'Thức Uống Cân Vị',
    desc: 'Ngọt nhẹ, dễ uống, rõ vị matcha',
  },
  {
    icon: '📍',
    title: 'Không Gian Q7',
    desc: 'Không gian xanh, yên tĩnh, phù hợp ngồi làm việc.',
  },
]

const steps = [
  {
    label: 'Quét QR Matte',
    detail: 'Mở camera, quét QR Matte Matcha & Teabar.',
  },
  {
    label: 'Chọn món của bạn',
    detail: 'Tùy chọn món mà bạn muốn order.',
  },
  {
    label: 'Thanh toán',
    detail: 'Thanh toán online, ra quầy lấy món nhé.',
  },
]

const Home = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { totalCount, addToCart } = useCart()
  const featuredProducts = PRODUCTS.slice(0, 4)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bankSuccessMessage, setBankSuccessMessage] = useState('')

  useEffect(() => {
    if (route.params?.bankSuccess) {
      const message =
        route.params.bankMessage || 'Thanh toán bằng ngân hàng đã hoàn tất.'
      setBankSuccessMessage(message)
      navigation.setParams({ bankSuccess: false, bankMessage: undefined })
      const timer = setTimeout(() => setBankSuccessMessage(''), 6000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [route.params?.bankSuccess, route.params?.bankMessage, navigation])

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=60',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>Matte Matcha & Teabar · Quận 7</Text>
          <Text style={styles.heroTitle}>Matcha tươi & Tea Bar</Text>
          <Text style={styles.heroSubtitle}>
            Quét QR, chọn nước, thanh toán tức.
          </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={[styles.heroButton, styles.btnPrimary]}
                onPress={() => navigation.navigate('Product')}
                activeOpacity={0.8}
              >
                <Text style={styles.btnPrimaryText}>Khám phá thêm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.heroButton, styles.btnSecondary]}
                onPress={() => navigation.navigate('Cart')}
                activeOpacity={0.8}
              >
                <Text style={styles.btnGiohangText}>Giỏ hàng ({totalCount})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {bankSuccessMessage ? (
          <View style={styles.bankSuccessBanner}>
            <Text style={styles.bankSuccessText}>{bankSuccessMessage}</Text>
            <TouchableOpacity onPress={() => setBankSuccessMessage('')}>
              <Text style={styles.bankSuccessDismiss}>Đóng</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.highlightSection}>
          {highlights.map((item, index) => (
            <View
              key={item.title}
              style={[
                styles.highlightCard,
                index === highlights.length - 1 && styles.highlightCardLast,
              ]}
            >
              <Text style={styles.highlightIcon}>{item.icon}</Text>
              <Text style={styles.highlightTitle}>{item.title}</Text>
              <Text style={styles.highlightDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Thực đơn gợi ý</Text>
          <View style={styles.productGrid}>
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
                <View style={styles.productInfo}>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.8}
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

        <View style={styles.stepsSection}>
          <Text style={styles.stepsTitle}>Bước order trong 30 giây</Text>
          <View style={styles.stepsRow}>
            {steps.map((step, index) => (
            <View
              key={step.label}
              style={[styles.stepCard, index === steps.length - 1 && styles.stepCardLast]}
            >
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.stepLabel}>{step.label}</Text>
                <Text style={styles.stepDetail}>{step.detail}</Text>
              </View>
            ))}
          </View>
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
    height: 420,
    borderRadius: 32,
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
    inset: 0,
    backgroundColor: 'rgba(3, 36, 17, 0.75)',
    opacity: 0.9,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
    position: 'relative',
    zIndex: 2,
  },
  heroEyebrow: {
    color: '#d4ffe7',
    fontSize: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ebffe7',
    marginBottom: 16,
  },
  heroSubtitle: {
    color: '#e8f7ec',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 520,
    marginBottom: 28,
  },
  bankSuccessBanner: {
    backgroundColor: '#e3ffde',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#34d399',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  bankSuccessText: {
    color: '#145332',
    fontSize: 14,
    flex: 1,
  },
  bankSuccessDismiss: {
    color: '#0a361c',
    fontWeight: '600',
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroButton: {
    minWidth: 150,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 6,
    marginBottom: 8,
  },
  btnPrimary: {
    backgroundColor: '#e5f8ea',
  },
  btnPrimaryText: {
    fontWeight: '700',
    color: '#0a3d1d',
    fontSize: 16,
  },
  btnSecondary: {
    borderWidth: 1,
    borderColor: '#7ed0a3',
    backgroundColor: 'transparent',
  },
  btnGiohangText: {
    color: '#e7ffed',
    fontWeight: '600',
    fontSize: 16,
  },
  btnSecondaryText: {
    color: '#d7ffe4',
    fontWeight: '600',
    fontSize: 16,
  },
  highlightSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  highlightCard: {
    flex: 1,
    backgroundColor: '#0f3d24',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(126, 215, 164, 0.4)',
    minHeight: 150,
    marginRight: 12,
  },
  highlightCardLast: {
    marginRight: 0,
  },
  highlightIcon: {
    fontSize: 24,
    marginBottom: 12,
  },
  highlightTitle: {
    color: '#fef9c3',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.5,
    
  },
  highlightDesc: {
    color: '#cbd5f5',
    fontSize: 14,
    lineHeight: 20,
   
  },
  previewSection: {
    backgroundColor: '#ebf7ed',
    borderRadius: 28,
    padding: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(31, 64, 40, 0.2)',
  },
  previewTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0a3d1d',
    marginBottom: 24,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#f6fbf7',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 67, 38, 0.2)',
    marginRight: 12,
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    marginBottom: 12,
  },
  productInfo: {
    paddingBottom: 6,
    flex: 1,
    justifyContent: 'space-between',
  },
  productCategory: {
    color: '#1f4531',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#153823',
  },
  productPrice: {
    color: '#16a34a',
    fontWeight: '700',
  },
  addButton: {
    marginTop: 12,
    backgroundColor: '#0a3b20',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0a3b20',
    shadowColor: '#0a3b20',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
    alignSelf: 'stretch',
  },
  addButtonText: {
    color: '#e8ffe8',
    fontWeight: '700',
  },
  stepsSection: {
    backgroundColor: '#0a311b',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(90, 236, 166, 0.22)',
    marginBottom: 24,
  },
  stepsTitle: {
    color: '#defbdc',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0f2819',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 12,
  },
  stepCardLast: {
    marginRight: 0,
  },
  stepNumber: {
    color: '#76f0b3',
    fontSize: 20,
    fontWeight: '700',
  },
  stepLabel: {
    color: '#d2f7d4',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  stepDetail: {
    color: '#baf4ca',
    fontSize: 14,
    marginTop: 6,
  },
  qrBanner: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 40,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: 'black',
  },
  qrSubtitle: {
    color: 'black',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  btnSecondaryWide: {
    borderWidth: 1,
    borderColor: '#0f172a',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
})

export default Home


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
    icon: '⚡',
    title: 'Nhanh chóng',
    desc: 'Order xong là thanh toán, chờ tới quầy nhận món nhé.',
  },
  {
    icon: '📱',
    title: 'Quét QR là xong',
    desc: 'Hướng dẫn rõ, không cần đăng nhập phức tạp.',
  },
  {
    icon: '🛡️',
    title: 'Tươi mới mỗi ly',
    desc: 'Pha tay theo thứ tự để nhâm nhi ngay.',
  },
]

const steps = [
  { label: 'Quét QR', detail: 'Mở camera, quét QR Phê La Order.' },
  { label: 'Chọn món', detail: 'Chọn trà, cà phê, soda theo tâm trạng.' },
  {
    label: 'Thanh Toán',
    detail: 'Thanh toán online, chờ tới quầy nhận món nhé.',
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
            <Text style={styles.heroEyebrow}>Order nước nhanh tại Phê La</Text>
            <Text style={styles.heroTitle}>Quét QR, gọi món, nhận liền</Text>
            <Text style={styles.heroSubtitle}>
              Giao diện web tươi sáng, giỏ hàng tối giản, đang tập trung vào trải nghiệm đặt nước
              nhanh chóng tại quầy Phê La.
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => navigation.navigate('Product')}
                activeOpacity={0.8}
              >
                <Text style={styles.btnPrimaryText}>Xem thực đơn</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnSecondary}
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
    backgroundColor: 'rgba(3, 7, 18, 0.65)',
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
    color: '#fef9c3',
    fontSize: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
  },
  heroSubtitle: {
    color: '#e2e8f0',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 520,
    marginBottom: 28,
  },
  bankSuccessBanner: {
    backgroundColor: '#ecfccb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#84cc16',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  bankSuccessText: {
    color: '#14532d',
    fontSize: 14,
    flex: 1,
  },
  bankSuccessDismiss: {
    color: '#0f172a',
    fontWeight: '600',
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    backgroundColor: '#fef9c3',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 12,
  },
  btnPrimaryText: {
    fontWeight: '700',
    color: '#0f172a',
    fontSize: 16,
  },
  btnSecondary: {
    borderWidth: 1,
    borderColor: '#fef9c3',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnGiohangText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  btnSecondaryText: {
    color: '##fef9c3',
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
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(254, 249, 195, 0.3)',
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
  },
  highlightDesc: {
    color: '#cbd5f5',
    fontSize: 14,
    lineHeight: 20,
  },
  previewSection: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  previewTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 24,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    color: '#64748b',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  productPrice: {
    color: '#ef4444',
    fontWeight: '700',
  },
  addButton: {
    marginTop: 12,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fef9c3',
    shadowColor: '#0f172a',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
    alignSelf: 'stretch',
  },
  addButtonText: {
    color: '#fef9c3',
    fontWeight: '700',
  },
  stepsSection: {
    backgroundColor: '#0f172a',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(254, 249, 195, 0.4)',
    marginBottom: 24,
  },
  stepsTitle: {
    color: '#fef9c3',
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
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 12,
  },
  stepCardLast: {
    marginRight: 0,
  },
  stepNumber: {
    color: '#fef9c3',
    fontSize: 20,
    fontWeight: '700',
  },
  stepLabel: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  stepDetail: {
    color: '#cbd5f5',
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


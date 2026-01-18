import React, { useMemo, useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Modal,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native'
import Layout from '../components/layout/Layout'
import { useCart } from '../contexts/CartContext'
import { createMoMoPayment } from '../services/paymentService'
import QRCode from 'qrcode'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { formatCurrency } from '../utils/currency'
import { ORDER_HISTORY_KEY } from '../constants/storageKeys'

const MOMO_RETURN_URL =
  process.env.EXPO_PUBLIC_MOMO_RETURN_URL || 'https://matte-matcha.vercel.app/momo-return'
const MOMO_IPN_URL =
  process.env.EXPO_PUBLIC_MOMO_IPN_URL || 'https://matte-matcha.vercel.app/momo-ipn'

const Cart = () => {
  const navigation = useNavigation()
  const [orderMessage, setOrderMessage] = useState('')
  const {
    items,
    totalPrice,
    clearCart,
    removeOne,
    removeItemCompletely,
    addToCart,
  } = useCart()

  const orderCode = useMemo(
    
    () => `A${Math.floor(Math.random() * 900 + 100)}`,
    []
  )

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [isQrModalVisible, setIsQrModalVisible] = useState(false)
  const [lastPayUrl, setLastPayUrl] = useState('')
  const sandboxQrEnabled = process.env.EXPO_PUBLIC_MOMO_ENABLE_QR === 'true'
  const [isBankModalVisible, setIsBankModalVisible] = useState(false)
  const [bankTimerId, setBankTimerId] = useState(null)

  useEffect(() => {
    return () => {
      if (bankTimerId) {
        clearTimeout(bankTimerId)
      }
    }
  }, [bankTimerId])

  const handleOpenLastPayUrl = async () => {
    if (!lastPayUrl) return
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
      window.location.assign(lastPayUrl)
      return
    }
    await Linking.openURL(lastPayUrl)
  }

  const handleCloseBankModal = (cancelTimer = true) => {
    if (cancelTimer && bankTimerId) {
      clearTimeout(bankTimerId)
      setBankTimerId(null)
    }
    setIsBankModalVisible(false)
  }

  const addOrderToHistory = async (entry) => {
    try {
      const stored = await AsyncStorage.getItem(ORDER_HISTORY_KEY)
      const existing = stored ? JSON.parse(stored) : []
      const updated = [entry, ...existing].slice(0, 20)
      await AsyncStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Không lưu được lịch sử đơn hàng', error)
    }
  }

  const finalizeBankPayment = async () => {
    const historyEntry = {
      orderCode,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: totalPrice,
      createdAt: new Date().toISOString(),
    }
    await addOrderToHistory(historyEntry)
    clearCart()
    navigation.navigate('Home', {
      bankSuccess: true,
      bankMessage:
        'Thanh toán bằng ngân hàng đã hoàn tất. Vui lòng đến quầy lấy món nhé.',
    })
  }

  const handleSelectBank = async () => {
    setIsPaymentModalVisible(false)
    setIsBankModalVisible(true)
    const timer = setTimeout(() => {
      handleCloseBankModal(false)
      void finalizeBankPayment()
    }, 30000)
    setBankTimerId(timer)
  }

  const renderQr = async (url) => {
    try {
      const dataUrl = await QRCode.toDataURL(url, { width: 320 })
      setQrDataUrl(dataUrl)
      setIsQrModalVisible(true)
    } catch (qrError) {
      console.error('QR generation failed', qrError)
      Alert.alert('Không thể tạo QR', 'Đang mở MoMo trực tiếp.')
      await handleOpenLastPayUrl()
    }
  }

  const handleOrderSubmit = () => {
    if (items.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Hãy chọn món trước khi đặt hàng nhé.')
      return
    }
    setIsPaymentModalVisible(true)
  }

  const handleSelectMomo = async () => {
    if (items.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Bạn chưa chọn sản phẩm nào để thanh toán.')
      return
    }

    setIsPaymentModalVisible(false)
    setIsProcessingPayment(true)

    try {
    const payload = {
      amount: totalPrice,
      orderInfo: `Đơn hàng ${orderCode} - ${items.length} món`,
      redirectUrl: MOMO_RETURN_URL,
      ipnUrl: MOMO_IPN_URL,
    }

    const response = await createMoMoPayment(payload)
    const payUrl = response?.data?.payUrl
    const qrCodeUrl = response?.data?.qrCodeUrl
    setLastPayUrl(payUrl)

    console.log('MoMo response payload', {
      payUrl,
      errorCode: response?.data?.errorCode,
      responseData: response?.data,
    })

    if (!payUrl) {
      throw new Error('Không nhận được payUrl từ MoMo.')
    }

    setOrderMessage(
      `Đơn ${orderCode} đang được khởi tạo. Chuyển qua cổng thanh toán MoMo...`
    )

    if (sandboxQrEnabled && qrCodeUrl) {
      await renderQr(qrCodeUrl)
      return
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
      window.location.assign(payUrl)
    } else {
      await Linking.openURL(payUrl)
    }
    } catch (error) {
      console.error('Lỗi khi gọi API MoMo:', error)
      Alert.alert(
        'Không thể khởi tạo MoMo',
        error?.response?.data?.message || error?.message || 'Vui lòng thử lại sau.'
      )
    } finally {
      setIsProcessingPayment(false)
    }
  }

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Giỏ hàng Matte Matcha & Teabar</Text>
          <Text style={styles.heroDesc}>
            Tất cả đồ uống matcha, Teabar và soda bạn chuẩn bị thưởng thức đều nằm trong giỏ. Nhấn đặt để hoàn tất.
          </Text>
          {orderMessage ? (
            <View style={styles.orderMessage}>
              <Text style={styles.orderMessageText}>{orderMessage}</Text>
            </View>
          ) : null}
        {isProcessingPayment ? (
          <View style={styles.processingBanner}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.processingBannerText}>
              Đang chuyển tới cổng MoMo...
            </Text>
          </View>
        ) : null}
        </View>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Giỏ hàng hiện đang trống. Hãy thêm một vài loại nước nhé!
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.cartList}>
              {items.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.cartItemMain}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>
                      {formatCurrency(item.price)} / kg
                    </Text>
                  </View>
                  <View style={styles.cartItemMeta}>
                    <Text style={styles.cartQty}>x{item.quantity}</Text>
                    <Text style={styles.cartLineTotal}>
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                    <View style={styles.cartItemActions}>
                      <TouchableOpacity
                        style={styles.cartAction}
                        onPress={() => removeOne(item.id)}
                      >
                        <Text style={styles.cartActionText}>-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cartAction}
                        onPress={() =>
                          addToCart({
                            id: item.id,
                            name: item.name,
                            priceValue: item.price,
                          })
                        }
                      >
                        <Text style={styles.cartActionText}>+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.cartAction, styles.cartActionRemove]}
                        onPress={() => removeItemCompletely(item.id)}
                      >
                        <Text style={styles.cartActionText}>Xóa</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={async () => {
                console.log('🔴 Button clicked! Items count:', items.length)
                console.log('clearCart function:', typeof clearCart)
                
                try {
                  // Xác nhận trước khi xóa
                  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
                    // Trên web, dùng window.confirm
                    const confirmed = window.confirm(
                      `Bạn có chắc muốn xóa tất cả ${items.length} sản phẩm trong giỏ hàng?`
                    )
                    
                    if (confirmed) {
                      console.log('✅ User confirmed, clearing cart...')
                      console.log('Items before clear:', JSON.stringify(items))
                      await clearCart()
                      console.log('✅ Cart cleared!')
                    } else {
                      console.log('❌ User cancelled')
                    }
                  } else {
                    // Trên mobile, dùng Alert
                    Alert.alert(
                      'Xác nhận xóa',
                      `Bạn có chắc muốn xóa tất cả ${items.length} sản phẩm trong giỏ hàng?`,
                      [
                        { text: 'Hủy', style: 'cancel', onPress: () => console.log('❌ User cancelled') },
                        {
                          text: 'Xóa tất cả',
                          style: 'destructive',
                          onPress: async () => {
                            console.log('✅ User confirmed, clearing cart...')
                            console.log('Items before clear:', JSON.stringify(items))
                            await clearCart()
                            console.log('✅ Cart cleared!')
                          },
                        },
                      ]
                    )
                  }
                } catch (error) {
                  console.error('❌ Error in clear button:', error)
                  Alert.alert('Lỗi', 'Không thể xóa giỏ hàng. Vui lòng thử lại.')
                }
              }}
            >
              <Text style={styles.clearButtonText}>🗑️ Xóa tất cả sản phẩm</Text>
            </TouchableOpacity>

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng cộng</Text>
                <Text style={styles.summaryTotal}>{formatCurrency(totalPrice)}</Text>
              </View>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleOrderSubmit}>
                <Text style={styles.checkoutButtonText}>Đặt món ngay</Text>
              </TouchableOpacity>
            </View>
            {qrDataUrl ? (
              <View style={styles.qrBannerInline}>
                <Text style={styles.qrTitleInline}>Quét mã MoMo tại bàn</Text>
                <Text style={styles.qrSubtitleInline}>
                  Mã QR mới nhất được tạo để thanh toán. Quét ngay bằng app MoMo.
                </Text>
                <Image source={{ uri: qrDataUrl }} style={styles.qrImageInline} />
                <TouchableOpacity
                  style={styles.qrButtonInline}
                  onPress={handleOpenLastPayUrl}
                >
                  <Text style={styles.qrButtonText}>Mở MoMo</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </>
        )}

        <Modal
          visible={isPaymentModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsPaymentModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
              <Text style={styles.modalNote}>
                Hỗ trợ MoMo QR (sandbox) và mô phỏng ngân hàng. Chọn MoMo để quét QR hoặc Ngân hàng để xem mã và hoàn tất.
              </Text>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalButtonPink,
                  isProcessingPayment && styles.modalButtonDisabled,
                ]}
                onPress={handleSelectMomo}
                disabled={isProcessingPayment}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonPinkText,
                    isProcessingPayment && styles.modalButtonBorderTextDisabled,
                  ]}
                >
                  MoMo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalButtonBorder,
                  isProcessingPayment && styles.modalButtonDisabled,
                ]}
                onPress={handleSelectBank}
                disabled={isProcessingPayment}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonBorderText,
                    isProcessingPayment && styles.modalButtonBorderTextDisabled,
                  ]}
                >
                  Ngân hàng
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setIsPaymentModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Huỷ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          visible={isQrModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsQrModalVisible(false)}
        >
          <View style={styles.qrModalOverlay}>
            <View style={styles.qrModalContent}>
              <Text style={styles.modalTitle}>Quét mã MoMo</Text>
              <Text style={styles.qrInstruction}>
                Dùng app MoMo để quét mã QR hoặc bấm “Mở MoMo” để mở màn hình thanh toán trực tiếp.
              </Text>
              {qrDataUrl ? (
                <Image source={{ uri: qrDataUrl }} style={styles.qrImage} />
              ) : (
                <ActivityIndicator size="large" color="#0f172a" />
              )}
              <TouchableOpacity style={styles.qrButton} onPress={handleOpenLastPayUrl}>
                <Text style={styles.qrButtonText}>Mở MoMo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setIsQrModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          visible={isBankModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCloseBankModal}
        >
          <View style={styles.bankModalOverlay}>
            <View style={styles.bankModalContent}>
              <Text style={styles.modalTitle}>Thanh toán bằng ngân hàng</Text>
              <Image
                source={require('../../assets/images/acbTestPayment.jpg')}
                style={styles.bankModalImage}
                resizeMode="contain"
              />
              <TouchableOpacity style={styles.modalClose} onPress={handleCloseBankModal}>
                <Text style={styles.modalCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    backgroundColor: '#0b3c24',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e4ffe4',
    marginBottom: 12,
  },
  heroDesc: {
    fontSize: 16,
    color: '#c9f3d1',
    lineHeight: 24,
  },
  orderMessage: {
    marginTop: 16,
    backgroundColor: '#ecfccb',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#84cc16',
  },
  orderMessageText: {
    color: '#14532d',
    fontSize: 14,
    lineHeight: 20,
  },
  processingBanner: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f4b2d',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  processingBannerText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#1d4531',
    textAlign: 'center',
  },
  cartList: {
    padding: 20,
    gap: 16,
  },
  cartItem: {
    backgroundColor: '#f6fbf7',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#0c3e1d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cartItemMain: {
    marginBottom: 12,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0c3a22',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#1d4531',
  },
  cartItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartQty: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  cartLineTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803d',
  },
  cartItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cartAction: {
    backgroundColor: '#e5ffec',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f4b2d',
  },
  cartActionRemove: {
    backgroundColor: '#fde68a',
    borderColor: '#fde68a',
  },
  cartActionText: {
    color: '#0f3c24',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 14,
    backgroundColor: '#0f4b2d',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#14b260',
    shadowColor: '#0a3821',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  clearButtonText: {
    color: '#e8ffe8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summary: {
    backgroundColor: '#f3faf4',
    padding: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(17, 67, 39, 0.2)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 18,
    color: '#0f3c24',
  },
  summaryTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803d',
  },
  checkoutButton: {
    backgroundColor: '#114d2f',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#14b260',
    shadowColor: '#0a351f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  checkoutButtonText: {
    color: '#e8ffe8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#f5faf5',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#0f3d24',
    shadowColor: '#05210f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f3c24',
    marginBottom: 12,
  },
  modalNote: {
    fontSize: 14,
    color: '#1e4330',
    marginBottom: 16,
    lineHeight: 20,
  },
  modalButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#0f4b2d',
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalButtonDark: {
    backgroundColor: '#0f172a',
  },
  modalButtonBorder: {
    borderWidth: 1,
    borderColor: '#14b260',
    backgroundColor: '#e8ffe8',
  },
  modalButtonText: {
    color: '#e8ffe8',
    fontWeight: '700',
  },
  modalButtonBorderText: {
    color: '#0f3d24',
    fontWeight: '700',
  },
  modalButtonBorderTextDisabled: {
    color: '#94a3b8',
  },
  modalClose: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalCloseText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  modalButtonPink: {
    backgroundColor: '#0f4b2d',
    borderWidth: 0,
  },
  modalButtonPinkText: {
    color: '#e8ffe8',
  },
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 24,
  },
  qrModalContent: {
    backgroundColor: '#f5faf5',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3d24',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  qrInstruction: {
    fontSize: 14,
    color: '#1e4330',
    textAlign: 'center',
    marginBottom: 12,
  },
  qrImage: {
    width: 260,
    height: 260,
    marginBottom: 16,
  },
  qrButton: {
    width: '100%',
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  qrButtonText: {
    color: '#fef9c3',
    fontWeight: '700',
  },
  qrBannerInline: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  qrTitleInline: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f3c24',
  },
  qrSubtitleInline: {
    fontSize: 14,
    color: '#1e4330',
    textAlign: 'center',
  },
  qrImageInline: {
    width: 200,
    height: 200,
    marginVertical: 8,
  },
  qrButtonInline: {
    backgroundColor: '#0f4b2d',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  bankModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  bankModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    gap: 12,
  },
  bankModalImage: {
    width: '100%',
    height: 240,
  },
  bankModalText: {
    fontSize: 14,
    color: '#475569',
  },
})

export default Cart


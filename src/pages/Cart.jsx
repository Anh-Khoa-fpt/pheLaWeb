import React, { useMemo, useState } from 'react'
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
} from 'react-native'
import Layout from '../components/layout/Layout'
import { useCart } from '../contexts/CartContext'
import { createMoMoPayment } from '../services/paymentService'

const MOMO_RETURN_URL =
  process.env.EXPO_PUBLIC_MOMO_RETURN_URL || 'https://phela.vercel.app/momo-return'
const MOMO_IPN_URL =
  process.env.EXPO_PUBLIC_MOMO_IPN_URL || 'https://phela.vercel.app/momo-ipn'

const formatCurrency = (value) =>
  value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

const Cart = () => {
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
    () => `PHELA-${Math.floor(Math.random() * 900000 + 100000)}`,
    []
  )

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const handleOrderSubmit = () => {
    if (items.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Hãy chọn món trước khi đặt hàng nhé.')
      return
    }
    setIsPaymentModalVisible(true)
  }

  const handleConfirmCash = async () => {
    await clearCart()
    setOrderMessage(
      `Bạn đã đặt hàng thành công với số mã là ${orderCode}. Khi nhân viên gọi tên, hãy tới quầy thanh toán và lấy món nhé!!.`
    )
    setIsPaymentModalVisible(false)
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
          <Text style={styles.heroTitle}>Giỏ hàng order nước</Text>
          <Text style={styles.heroDesc}>
            Bạn đang gom những ly nước thơm ngon để chuẩn bị đi lấy tại quầy Phê La. Nhấn đặt để lấy
            mã và đợi khi quầy gọi tên.
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
                Nếu đơn hàng có mã giảm giá hoặc khuyến mãi thì chỉ thanh toán tiền mặt mới được nhé.
              </Text>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDark]}
                onPress={handleConfirmCash}
              >
                <Text style={styles.modalButtonText}>Tiền mặt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalButtonBorder,
                  isProcessingPayment && styles.modalButtonDisabled,
                ]}
                onPress={handleSelectMomo}
                disabled={isProcessingPayment}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonBorderText,
                    isProcessingPayment && styles.modalButtonBorderTextDisabled,
                  ]}
                >
                  MoMo 
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
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#1e3a8a',
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
    color: '#7f8c8d',
    textAlign: 'center',
  },
  cartList: {
    padding: 20,
    gap: 16,
  },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartItemMain: {
    marginBottom: 12,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#7f8c8d',
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
    color: '#e74c3c',
  },
  cartItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cartAction: {
    backgroundColor: '#fef9c3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f172a',
  },
  cartActionRemove: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  cartActionText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 14,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fef9c3',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  clearButtonText: {
    color: '#fef9c3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summary: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 18,
    color: '#2c3e50',
  },
  summaryTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  checkoutButton: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fef9c3',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  checkoutButtonText: {
    color: '#fef9c3',
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
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  modalNote: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 16,
    lineHeight: 20,
  },
  modalButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalButtonDark: {
    backgroundColor: '#0f172a',
  },
  modalButtonBorder: {
    borderWidth: 1,
    borderColor: '#0f172a',
  },
  modalButtonText: {
    color: '#fef9c3',
    fontWeight: '700',
  },
  modalButtonBorderText: {
    color: '#0f172a',
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
})

export default Cart


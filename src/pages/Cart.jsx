import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native'
import Layout from '../components/layout/Layout'
import { useCart } from '../contexts/CartContext'

const formatCurrency = (value) =>
  value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

const Cart = () => {
  const {
    items,
    totalPrice,
    clearCart,
    removeOne,
    removeItemCompletely,
    addToCart,
  } = useCart()

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Giỏ Hàng Của Bạn</Text>
          <Text style={styles.heroDesc}>
            Danh sách sản phẩm bạn đã chọn. Khi tích hợp thanh toán, bước tiếp theo chỉ cần xác
            nhận đơn và chọn địa chỉ giao hàng.
          </Text>
        </View>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Giỏ hàng hiện đang trống. Hãy thêm một vài loại cá tươi nhé!
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
              onPress={() => {
                Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa tất cả sản phẩm?', [
                  { text: 'Hủy', style: 'cancel' },
                  {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: clearCart,
                  },
                ])
              }}
            >
              <Text style={styles.clearButtonText}>Xóa tất cả sản phẩm</Text>
            </TouchableOpacity>

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng cộng</Text>
                <Text style={styles.summaryTotal}>{formatCurrency(totalPrice)}</Text>
              </View>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => Alert.alert('Thông báo', 'Chưa làm ạ!')}
              >
                <Text style={styles.checkoutButtonText}>Thanh toán</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  cartActionRemove: {
    backgroundColor: '#e74c3c',
  },
  cartActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e74c3c',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
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
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default Cart


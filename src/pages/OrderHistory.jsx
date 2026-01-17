import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Layout from '../components/layout/Layout'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { formatCurrency } from '../utils/currency'
import { ORDER_HISTORY_KEY } from '../constants/storageKeys'

const formatDateTime = (value) => {
  try {
    return new Date(value).toLocaleString('vi-VN')
  } catch {
    return value
  }
}

const OrderHistory = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(ORDER_HISTORY_KEY)
      setHistory(stored ? JSON.parse(stored) : [])
    } catch (error) {
      console.error('Không lấy được lịch sử đơn hàng', error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadHistory()
    }, [])
  )

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Lịch sử đơn hàng</Text>
        {loading ? (
          <Text style={styles.message}>Đang tải...</Text>
        ) : history.length === 0 ? (
          <Text style={styles.message}>Chưa có đơn hàng nào được lưu.</Text>
        ) : (
          history.map((order) => (
            <View key={`${order.orderCode}-${order.createdAt}`} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderCode}>{order.orderCode}</Text>
                <Text style={styles.orderDate}>{formatDateTime(order.createdAt)}</Text>
              </View>
              <Text style={styles.orderTotal}>Tổng đơn: {formatCurrency(order.total)}</Text>
              {order.items.map((item) => (
                <View key={`${order.orderCode}-${item.id}`} style={styles.orderItem}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>
                    {item.quantity} × {formatCurrency(item.price)}
                  </Text>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f3d24',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#1f4531',
    marginVertical: 12,
  },
  orderCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f5faf5',
    borderWidth: 1,
    borderColor: 'rgba(17, 67, 39, 0.2)',
    shadowColor: '#0c3c22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f3d24',
  },
  orderDate: {
    fontSize: 12,
    color: '#1f4531',
  },
  orderTotal: {
    fontSize: 14,
    marginBottom: 8,
    color: '#0f3d24',
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    color: '#0f3d24',
  },
  itemMeta: {
    fontSize: 14,
    color: '#1f4531',
  },
})

export default OrderHistory

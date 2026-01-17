import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import Layout from '../components/layout/Layout'

const sampleOrders = [
  { id: 'A106', status: 'Đang chuẩn bị', timer: '2 phút' },
  { id: 'A107', status: 'Đang chờ', timer: '5 phút' },
  { id: 'A108', status: 'Đơn hàng của bạn', timer: '7 phút', current: true },
]

const OrderQueue = () => {
  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Trạng thái Order</Text>
          <Text style={styles.heroSubtitle}>
            Theo dõi vị trí món nước của bạn trong hàng chờ tại Matte Matcha & Teabar.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Order #</Text>
            <Text style={styles.tableHeaderText}>Trạng thái</Text>
            <Text style={styles.tableHeaderText}>Thời gian chờ</Text>
          </View>
          {sampleOrders.map((order) => (
            <View
              key={order.id}
              style={[
                styles.tableRow,
                order.current && styles.tableRowActive,
              ]}
            >
              <Text style={styles.cell}>{order.id}</Text>
              <Text style={styles.cell}>{order.status}</Text>
              <Text style={styles.cell}>{order.timer}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  hero: {
    marginBottom: 12,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#0b3d24',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e2ffe0',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#c7f1d7',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#f7fbf6',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(17, 67, 39, 0.15)',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tableHeaderText: {
    fontWeight: '700',
    color: '#0f3d24',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ec',
  },
  tableRowActive: {
    backgroundColor: '#d8fde1',
    borderRadius: 12,
    marginBottom: 6,
    borderBottomWidth: 0,
    paddingHorizontal: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#0f3d24',
    fontWeight: '600',
    textAlign: 'center',
  },
})

export default OrderQueue

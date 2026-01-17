import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import Layout from '../components/layout/Layout'

const OrderReady = () => {
  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Image
            source={{
              uri: 'https://i.postimg.cc/qRrtCD9n/vn-11134505-7ras8-mbm7u1ims8yobe.jpg',
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.title}>Đơn hàng của bạn đã sẵn sàng!</Text>
          <Text style={styles.meta}>Order #A108</Text>
          <Text style={styles.message}>Xin vui lòng ra quầy nhận ly.</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Đã nhận!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.info}>
          <Text style={styles.infoTitle}>Chi tiết đơn</Text>
          <Text style={styles.infoText}>Matcha Latte Signature · 1 ly</Text>
          <Text style={styles.infoText}>Giờ 0rder:19:10</Text>
          <Text style={styles.infoText}>Vị trí: Quầy Matte Matcha & Teabar</Text>
        </View>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fdf7ef',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2cfa4',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f3d24',
    marginBottom: 8,
  },
  meta: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b8c6d',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#3c3c3c',
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#f97316',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 999,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  info: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
    color: '#0f3d24',
  },
  infoText: {
    color: '#475569',
    marginBottom: 6,
  },
})

export default OrderReady

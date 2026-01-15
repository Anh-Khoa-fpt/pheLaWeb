import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import Layout from '../components/layout/Layout'

const Contact = () => {
  const contacts = [
    { label: 'Địa chỉ', value: 'Số 125 Hồ Tùng Mậu, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh' },
    { label: 'Điện thoại', value: '1900 3013' },
    { label: 'Email', value: 'order@phela.com' },
    { label: 'Giờ mở cửa', value: '07:30 - 22:00 (Hằng ngày)' },
  ]

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.title}>Liên hệ Phê La Order</Text>
          <Text style={styles.subtitle}>
            Mọi câu hỏi liên quan đến đơn hàng, hợp tác quán nước hay hỗ trợ QR menu đều được phản hồi
            trong vòng 30 phút.
          </Text>
        </View>

        <View style={styles.card}>
          {contacts.map((contact) => (
            <View key={contact.label} style={styles.row}>
              <Text style={styles.label}>{contact.label}</Text>
              <Text style={styles.value}>{contact.value}</Text>
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
    backgroundColor: '#fef9c3',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#92400e',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#51311b',
    lineHeight: 24,
  },
  card: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  label: {
    fontWeight: '700',
    color: '#0f172a',
  },
  value: {
    color: '#475569',
    textAlign: 'right',
  },
  note: {
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: '#0f172a',
    borderRadius: 20,
  },
  noteTitle: {
    color: '#fef9c3',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  noteText: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
  },
})

export default Contact

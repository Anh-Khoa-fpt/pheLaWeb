import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import Layout from '../components/layout/Layout'

const Contact = () => {
  const contacts = [
    { label: 'Địa chỉ', value: '25-27 Mỹ Kim 2, Tân Phong, Quận 7, Thành phố Hồ Chí Minh' },
    { label: 'Điện thoại', value: '0901 528 408' },
    { label: 'Email', value: 'Contact@mattetea.com' },
    { label: 'Giờ mở cửa', value: '08:00 - 21:45 (Hằng ngày)' },
  ]

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.title}>Liên hệ Matte Matcha & Teabar</Text>
          <Text style={styles.subtitle}>
            Hỗ trợ order nhóm, sự kiện pop-up và mọi thắc mắc về Matte Matcha & Teabar.
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
    backgroundColor: '#e7f8ed',
    borderWidth: 1,
    borderColor: '#7ed0a3',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0d3d1f',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#0f5133',
    lineHeight: 24,
  },
  card: {
    margin: 16,
    backgroundColor: '#fbfffa',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(17, 67, 38, 0.15)',
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
    color: '#0b3d1f',
  },
  value: {
    color: '#1f4531',
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

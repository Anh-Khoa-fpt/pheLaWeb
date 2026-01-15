import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import Layout from '../components/layout/Layout'

const About = () => {
  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.title}>Phê La Order</Text>
          <Text style={styles.subtitle}>
            Không chỉ là quán nước, mà là trải nghiệm đặt hàng nhanh – quét QR, chọn món, nhận mã và
            lấy ngay tại quầy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tầm nhìn</Text>
          <Text style={styles.sectionContent}>
            Mang đến cho khách hàng cách gọi món hiện đại, tối ưu thời gian xếp hàng tại quầy bằng
            giao diện web mobile-first. Mọi lượt order đều được ghi nhận và cho phép điều chỉnh dễ
            dàng.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đội ngũ</Text>
          <Text style={styles.sectionContent}>
            Barista và developer cùng phối hợp để duy trì chất lượng đồ uống và trải nghiệm kỹ thuật số
            trên mọi thiết bị, từ điện thoại đến máy tính bảng.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cam kết</Text>
          <Text style={styles.sectionContent}>
            - Nguồn nguyên liệu sạch, kiểm định đầy đủ.{'\n'}
            - Quản lý đơn hàng qua QR và mã call để tránh nhầm đơn.{'\n'}
            - Lưu trữ tạm thời giỏ hàng giúp khách quay lại đặt tiếp dễ dàng.
          </Text>
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
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fef9c3',
    marginBottom: 12,
  },
  subtitle: {
    color: '#e2e8f0',
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#0f172a',
  },
  sectionContent: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 22,
  },
})

export default About

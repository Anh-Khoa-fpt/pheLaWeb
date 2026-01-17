import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import Layout from '../components/layout/Layout'

const About = () => {
  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.title}>Matte Matcha & Teabarr</Text>
          <Text style={styles.subtitle}>
            Từ matcha tươi Nhật Bản đến teabarr cold brew, mỗi ly đều được điều chỉnh theo khẩu vị bạn chọn.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tầm nhìn</Text>
          <Text style={styles.sectionContent}>
            Lấy matcha và trà cao cấp làm trung tâm, kết hợp công nghệ để khách order nhanh hơn và tận hưởng không gian teabarr.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đội ngũ</Text>
          <Text style={styles.sectionContent}>
            Barista chuyên matcha và đội kỹ thuật hợp lực để giữ chất lượng, từ ly matcha latte đến giao diện web mượt mà.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cam kết</Text>
          <Text style={styles.sectionContent}>
            - Nhập matcha, trà và topping hữu cơ, đảm bảo không chất bảo quản.{'\n'}
            - QR menu riêng cho từng bàn, tránh chờ lâu vào giờ cao điểm.{'\n'}
            - Giỏ hàng giữ đơn cũ để khách dễ order lại vị ưa thích.
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
    backgroundColor: '#0b3221',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#e2ffe0',
    marginBottom: 12,
  },
  subtitle: {
    color: '#c6f2d6',
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f5fbf7',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#0b371d',
  },
  sectionContent: {
    fontSize: 16,
    color: '#1a422f',
    lineHeight: 22,
  },
})

export default About

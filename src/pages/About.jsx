import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import Layout from '../components/layout/Layout'

const milestones = [
  { year: '2018', title: 'Khởi đầu', desc: 'Mở cơ sở cá tươi đầu tiên tại TP.HCM với 5 bể cá lớn.' },
  { year: '2020', title: 'Mở rộng', desc: 'Thiết lập chuỗi cung ứng lạnh, phục vụ 8 tỉnh lân cận.' },
  { year: '2023', title: 'Chuyển đổi số', desc: 'Ra mắt hệ thống Metrohcmc với ứng dụng đặt hàng trực tuyến.' },
]

const values = [
  { icon: '💧', title: 'Tươi 100%', desc: 'Nguồn cá được vận chuyển trong vòng 12h, đảm bảo giữ lạnh liên tục.' },
  { icon: '🧊', title: 'Chuỗi lạnh khép kín', desc: 'Kho lạnh tự động giúp duy trì nhiệt độ lý tưởng cho từng loại cá.' },
  { icon: '🔍', title: 'Truy xuất nguồn gốc', desc: 'Mỗi lô hàng có QR code giúp khách kiểm tra thông tin nuôi trồng.' },
]

const team = [
  { name: 'Trần Đức Hiệu', role: 'Founder & CEO', quote: 'Mang cá tươi đến mọi căn bếp Việt.' },
  { name: 'Trần Mạnh Phú', role: 'Head of Supply Chain', quote: 'Chúng tôi kiểm soát từng km vận chuyển.' },
  { name: 'Nguyễn Quốc Anh Khoa', role: 'Customer Success Lead', quote: 'Khách hàng hài lòng là kim chỉ nam.' },
]

const About = () => {
  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Về Fish App</Text>
          <Text style={styles.heroTitle}>
            Câu chuyện mang cá tươi từ biển đến bàn ăn của bạn
          </Text>
          <Text style={styles.heroDesc}>
            Chúng tôi xây dựng hệ thống phân phối cá tươi minh bạch, ứng dụng công nghệ để khách hàng
            đặt hàng mọi lúc và nhận hàng trong ngày.
          </Text>
          <View style={styles.statGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>120+</Text>
              <Text style={styles.statLabel}>Đối tác nuôi trồng</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24h</Text>
              <Text style={styles.statLabel}>Thời gian giao tối đa</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4/5</Text>
              <Text style={styles.statLabel}>Đánh giá khách hàng</Text>
            </View>
          </View>
        </View>

        <View style={styles.valuesSection}>
          {values.map((value) => (
            <View key={value.title} style={styles.valueCard}>
              <Text style={styles.valueIcon}>{value.icon}</Text>
              <Text style={styles.valueTitle}>{value.title}</Text>
              <Text style={styles.valueDesc}>{value.desc}</Text>
            </View>
          ))}
        </View>

        <View style={styles.milestoneSection}>
          <Text style={styles.sectionTitle}>Dấu mốc phát triển</Text>
          <View style={styles.timeline}>
            {milestones.map((item) => (
              <View key={item.year} style={styles.timelineItem}>
                <Text style={styles.timelineYear}>{item.year}</Text>
                <Text style={styles.timelineTitle}>{item.title}</Text>
                <Text style={styles.timelineDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Tại Sao Chọn Chúng Tôi?</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🚚</Text>
              <Text style={styles.featureTitle}>Giao Hàng Nhanh</Text>
              <Text style={styles.featureDesc}>
                Giao hàng tận nơi trong vòng 2 giờ, đảm bảo cá tươi sống
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureTitle}>Chất Lượng Đảm Bảo</Text>
              <Text style={styles.featureDesc}>
                100% cá tươi sống, có giấy chứng nhận vệ sinh an toàn thực phẩm
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>💰</Text>
              <Text style={styles.featureTitle}>Giá Cả Hợp Lý</Text>
              <Text style={styles.featureDesc}>
                Giá cả cạnh tranh, nhiều ưu đãi cho khách hàng thân thiết
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureTitle}>Đa Dạng Sản Phẩm</Text>
              <Text style={styles.featureDesc}>
                Hơn 50 loại cá tươi sống, đáp ứng mọi nhu cầu của bạn
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>Đội ngũ dẫn dắt</Text>
          <View style={styles.teamGrid}>
            {team.map((member) => (
              <View key={member.name} style={styles.teamCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
                </View>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.role}</Text>
                <Text style={styles.teamQuote}>"{member.quote}"</Text>
              </View>
            ))}
          </View>
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
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  eyebrow: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 8,
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
    marginBottom: 20,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  statItem: {
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  valuesSection: {
    padding: 20,
    gap: 16,
  },
  valueCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  valueIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  valueTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  valueDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  milestoneSection: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  timeline: {
    gap: 20,
  },
  timelineItem: {
    paddingLeft: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
    paddingBottom: 20,
  },
  timelineYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  timelineDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  featuresSection: {
    padding: 20,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  teamSection: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  teamGrid: {
    gap: 20,
  },
  teamCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 8,
  },
  teamQuote: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
})

export default About


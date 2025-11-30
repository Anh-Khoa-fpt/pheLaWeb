import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native'
import Layout from '../components/layout/Layout'

const contactCards = [
  {
    title: 'Hotline 24/7',
    info: '1900 222 888',
    desc: 'Tư vấn sản phẩm, nhận đơn gấp và hỗ trợ kỹ thuật bảo quản.',
  },
  {
    title: 'Email hỗ trợ',
    info: 'support@test.com',
    desc: 'Phản hồi trong 2h làm việc đối với mọi yêu cầu từ khách hàng.',
  },
  {
    title: 'Kho trung tâm',
    info: 'Số 62 Quốc lộ 13, Thủ Đức, TP.HCM',
    desc: 'Đón tiếp khách tham quan quy trình nuôi trồng & kho lạnh.',
  },
]

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin')
      return
    }
    Alert.alert('Thành công', 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.')
    setFormData({ name: '', phone: '', email: '', message: '' })
  }

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Liên hệ với Fish App Supporter</Text>
          <Text style={styles.heroDesc}>
            Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn đặt hàng, tư vấn bảo quản cá tươi và
            giải đáp mọi thắc mắc liên quan tới đơn hàng.
          </Text>
        </View>

        <View style={styles.contactGrid}>
          {contactCards.map((card) => (
            <View key={card.title} style={styles.contactCard}>
              <Text style={styles.contactCardTitle}>{card.title}</Text>
              <Text style={styles.contactInfo}>{card.info}</Text>
              <Text style={styles.contactDesc}>{card.desc}</Text>
            </View>
          ))}
        </View>

        <View style={styles.formSection}>
          <View style={styles.formInfo}>
            <Text style={styles.formInfoTitle}>Gửi thông tin cho chúng tôi</Text>
            <Text style={styles.formInfoDesc}>
              Điền biểu mẫu bên dưới, chuyên viên sẽ gọi lại trong vòng 30 phút làm việc.
            </Text>
            <View style={styles.formInfoList}>
              <Text style={styles.formInfoItem}>• Hỗ trợ báo giá số lượng lớn</Text>
              <Text style={styles.formInfoItem}>• Tư vấn thiết kế bếp hải sản</Text>
              <Text style={styles.formInfoItem}>• Giải quyết sự cố đơn hàng</Text>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.formRow}>
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="Họ và tên"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="Số điện thoại"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email liên hệ"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Nội dung yêu cầu..."
              value={formData.message}
              onChangeText={(text) => setFormData({ ...formData, message: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Gửi yêu cầu</Text>
            </TouchableOpacity>
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
  contactGrid: {
    padding: 20,
    gap: 16,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 8,
  },
  contactDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  formSection: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  formInfo: {
    marginBottom: 24,
  },
  formInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  formInfoDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 16,
  },
  formInfoList: {
    gap: 8,
  },
  formInfoItem: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputHalf: {
    flex: 1,
  },
  textarea: {
    height: 100,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default Contact


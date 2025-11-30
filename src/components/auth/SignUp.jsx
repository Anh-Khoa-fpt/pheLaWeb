import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

const SignUp = () => {
  const navigation = useNavigation()
  const { updateAuthState } = useAuth()
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')

    // Validation
    if (!formData.fullName || formData.fullName.trim() === '') {
      setError('Vui lòng nhập họ và tên')
      return
    }

    if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
      setError('Vui lòng nhập số điện thoại')
      return
    }

    if (!formData.email || formData.email.trim() === '') {
      setError('Vui lòng nhập email')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setError('Email không đúng định dạng')
      return
    }

    // Validate phone number (ít nhất 9 số sau +84)
    const phoneRegex = /^\+84[0-9]{9,10}$/
    let testPhone = formData.phoneNumber.trim()
    if (!testPhone.startsWith('+')) {
      if (testPhone.startsWith('0')) {
        testPhone = '+84' + testPhone.substring(1)
      } else if (testPhone.startsWith('84')) {
        testPhone = '+' + testPhone
      } else {
        testPhone = '+84' + testPhone
      }
    }
    if (!phoneRegex.test(testPhone)) {
      setError('Số điện thoại không đúng định dạng. Vui lòng nhập số điện thoại hợp lệ (10-11 số)')
      return
    }

    setLoading(true)

    try {
      let formattedPhone = formData.phoneNumber.trim()
      if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+84' + formattedPhone.substring(1)
        } else if (formattedPhone.startsWith('84')) {
          formattedPhone = '+' + formattedPhone
        } else {
          formattedPhone = '+84' + formattedPhone
        }
      }

      const userData = {
        phoneNumber: formattedPhone,
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        fullName: formData.fullName.trim(),
      }

      const response = await authAPI.signup(userData)

      const isSuccess =
        response.httpStatus === 200 ||
        response.isSuccess === true ||
        response.statusCode === 200 ||
        response.statusCode === 0

      if (isSuccess) {
        // Sau khi đăng ký thành công, luôn chuyển về trang đăng nhập
        const successMessage =
          response.message || response.result || 'Đăng ký thành công! Vui lòng đăng nhập.'
        Alert.alert('Thành công', successMessage, [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ])
      } else {
        // Nếu isSuccess = false
        const errorMsg =
          response.message || response.result || 'Đăng ký thất bại. Vui lòng thử lại.'
        setError(errorMsg)
      }
    } catch (err) {
      console.error('SignUp error:', err)
      console.error('SignUp error details:', JSON.stringify(err, null, 2))
      
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.'

      // Ưu tiên hiển thị lỗi network
      if (err.isNetworkError) {
        errorMessage = err.message || 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.'
      } 
      // Xử lý validation errors từ server (thường là object với các field)
      else if (err.errors && typeof err.errors === 'object') {
        const errorMessages = []
        Object.keys(err.errors).forEach((key) => {
          const fieldErrors = Array.isArray(err.errors[key]) 
            ? err.errors[key] 
            : [err.errors[key]]
          fieldErrors.forEach((msg) => {
            if (msg) errorMessages.push(`${key}: ${msg}`)
          })
        })
        errorMessage = errorMessages.length > 0 
          ? errorMessages.join('\n') 
          : 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.'
      }
      // Xử lý errors là array
      else if (err.errors && Array.isArray(err.errors)) {
        errorMessage = err.errors.join('\n')
      }
      // Ưu tiên message từ server
      else if (err.message) {
        errorMessage = err.message
      } 
      else if (err.error) {
        errorMessage = err.error
      } 
      else if (typeof err === 'string') {
        errorMessage = err
      } 
      else if (err.isSuccess === false && err.message) {
        errorMessage = err.message
      } 
      else if (err.result) {
        errorMessage = err.result
      }
      // Nếu có httpStatus 400, thêm thông tin chi tiết
      else if (err.httpStatus === 400) {
        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin đăng ký.'
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backLinkText}>← Về trang chủ</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Đăng Ký</Text>
        <Text style={styles.subtitle}>Tạo tài khoản mới</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập họ và tên của bạn"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
              keyboardType="phone-pad"
              editable={!loading}
            />
            <Text style={styles.hint}>
              Hệ thống sẽ tự động thêm mã quốc gia +84 nếu chưa có
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Đăng Ký</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backLink: {
    marginBottom: 16,
  },
  backLinkText: {
    fontSize: 14,
    color: '#3498db',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 24,
    textAlign: 'center',
  },
  error: {
    color: '#e74c3c',
    marginBottom: 16,
    textAlign: 'center',
    padding: 12,
    backgroundColor: '#fee',
    borderRadius: 8,
  },
  form: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  footerLink: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
})

export default SignUp


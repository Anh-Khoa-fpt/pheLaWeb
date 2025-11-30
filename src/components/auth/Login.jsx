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
  Image,
  Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { authAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

// Google Client ID
const GOOGLE_CLIENT_ID =
  '1005948093328-sttru7648vl1fr495elo13gsab2e82cq.apps.googleusercontent.com'

// Complete auth session
WebBrowser.maybeCompleteAuthSession()

const Login = () => {
  const navigation = useNavigation()
  const { updateAuthState } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleAuthResponse = async (response, fallbackUser = null, email = '') => {
    console.log('handleAuthResponse - Full response:', JSON.stringify(response, null, 2))
    
    // Kiểm tra success theo Swagger: isSuccess === true hoặc statusCode === 0
    const isSuccess =
      response?.httpStatus === 200 ||
      response?.isSuccess === true ||
      response?.statusCode === 200 ||
      response?.statusCode === 0

    if (!isSuccess) {
      const errorMsg =
        response?.message || response?.result || 'Đăng nhập thất bại. Vui lòng thử lại.'
      console.log('Login failed - not success:', errorMsg)
      setError(errorMsg)
      return false
    }

    // Theo Swagger, token có thể nằm trong result (nếu result là string) hoặc các vị trí khác
    const token =
      response?.token ||
      response?.data?.token ||
      response?.result?.token ||
      response?.result?.accessToken ||
      (typeof response?.result === 'string' && response.result.length > 20 ? response.result : null) ||
      response?.data?.result ||
      (response?.result && typeof response.result === 'object' ? response.result.token : null)

    console.log('Extracted token:', token ? 'Token found' : 'No token found')

    if (token) {
      // Lấy thông tin user từ response
      const user =
        response?.user ||
        response?.data?.user ||
        response?.result?.user ||
        response?.data?.result?.user ||
        fallbackUser ||
        (email ? {
          email: email,
          fullName: email.split('@')[0],
        } : null)

      console.log('User data:', user)

      // Update auth state (sẽ tự động lưu vào AsyncStorage)
      await updateAuthState(token, user)

      navigation.navigate('Home')
      return true
    }

    // Nếu không có token nhưng response thành công
    const successMessage = response?.message || response?.result || 'Đăng nhập thành công!'
    console.log('Login success but no token:', successMessage)
    setError('Đăng nhập thành công nhưng không nhận được token. Vui lòng thử lại.')
    return false
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login(
        formData.email.trim(),
        formData.password,
        formData.rememberMe
      )
      await handleAuthResponse(response, null, formData.email.trim())
    } catch (err) {
      console.error('Login catch error:', err)
      let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.'

      // Ưu tiên hiển thị lỗi network
      if (err.isNetworkError) {
        errorMessage = err.message || 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.'
      } else if (err.message) {
        errorMessage = err.message
      } else if (err.error) {
        errorMessage = err.error
      } else if (typeof err === 'string') {
        errorMessage = err
      } else if (err.isSuccess === false && err.message) {
        errorMessage = err.message
      } else if (err.result) {
        errorMessage = err.result
      }

      // Xử lý validation errors
      if (err.errors && Array.isArray(err.errors)) {
        errorMessage = err.errors.join(', ')
      } else if (err.errors && typeof err.errors === 'object') {
        errorMessage = Object.values(err.errors).flat().join(', ')
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Xử lý đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')

    try {
      // Tạo discovery document cho Google OAuth
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      }

      // Tạo redirect URI - xử lý khác nhau cho web và mobile
      let redirectUri
      let useProxy = false
      
      if (Platform.OS === 'web') {
        // Trên web, sử dụng origin hiện tại với path /auth/callback
        // Phải khớp với cấu hình trong Google Console
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:19006'
        redirectUri = `${origin}/auth/callback`
        useProxy = false
        console.log('🔵 Web - Redirect URI:', redirectUri)
      } else {
        // Trên mobile, sử dụng Expo proxy
        redirectUri = AuthSession.makeRedirectUri({
          useProxy: true,
        })
        useProxy = true
        console.log('📱 Mobile - Redirect URI:', redirectUri)
      }

      console.log('🔑 Client ID:', GOOGLE_CLIENT_ID)

      // Tạo request
      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Token,
        redirectUri,
        usePKCE: false,
      })

      // Thực hiện authentication
      const result = await request.promptAsync(discovery, {
        useProxy,
      })

      if (result.type === 'success') {
        const { access_token } = result.params

        if (!access_token) {
          throw new Error('Không nhận được access token từ Google.')
        }

        // Lấy thông tin profile từ Google
        const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })

        if (!profileResponse.ok) {
          throw new Error('Không lấy được thông tin người dùng từ Google.')
        }

        const profile = await profileResponse.json()
        const fullName =
          profile.name ||
          `${profile.given_name || ''} ${profile.family_name || ''}`.trim() ||
          'Google User'

        if (!profile.email) {
          throw new Error('Google không trả về email. Không thể đăng nhập.')
        }

        // Gọi API đăng nhập với Google
        const response = await authAPI.loginWithGoogle({
          email: profile.email,
          fullName,
          rememberMe: formData.rememberMe,
        })

        await handleAuthResponse(
          response,
          {
            email: profile.email,
            fullName,
            name: profile.name,
            avatar: profile.picture,
          },
          profile.email
        )
      } else if (result.type === 'error') {
        let errorMessage = result.error?.message || 'Đăng nhập bằng Google thất bại. Vui lòng thử lại.'
        
        // Log chi tiết lỗi để debug
        console.error('❌ Google OAuth Error:', {
          type: result.type,
          error: result.error,
          errorCode: result.error?.code,
          errorDescription: result.error?.description,
          redirectUri,
          platform: Platform.OS,
        })
        
        // Xử lý lỗi redirect_uri_mismatch
        if (result.error?.code === 'redirect_uri_mismatch' || 
            errorMessage.toLowerCase().includes('redirect_uri') ||
            errorMessage.toLowerCase().includes('redirect')) {
          errorMessage = `Lỗi redirect URI không khớp!\n\n` +
            `Redirect URI đang dùng: ${redirectUri}\n\n` +
            `Vui lòng kiểm tra trong Google Console:\n` +
            `- Authorized redirect URIs phải có: ${redirectUri}\n` +
            `- Phải khớp chính xác (http/https, domain, port, path)`
        }
        
        throw new Error(errorMessage)
      } else if (result.type === 'cancel') {
        // User cancelled, không cần hiển thị lỗi
        setGoogleLoading(false)
        return
      }
    } catch (err) {
      setError(
        err.message ||
          err.error ||
          'Đăng nhập bằng Google thất bại. Vui lòng thử lại.'
      )
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Đăng Nhập</Text>
        <Text style={styles.subtitle}>Chào mừng bạn trở lại!</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.form}>
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
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() =>
              setFormData({ ...formData, rememberMe: !formData.rememberMe })
            }
          >
            <View style={styles.checkbox}>
              {formData.rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Ghi nhớ đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, (loading || googleLoading) && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading || googleLoading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Đăng Nhập</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Hoặc</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={[styles.googleButton, (loading || googleLoading) && styles.buttonDisabled]}
          onPress={handleGoogleLogin}
          disabled={loading || googleLoading}
          activeOpacity={0.7}
        >
          {googleLoading ? (
            <ActivityIndicator color="#4285F4" />
          ) : (
            <>
              <Image
                source={require('../../../assets/images/google_logo.jpg')}
                style={styles.googleLogo}
                resizeMode="contain"
                onError={(error) => console.log('Image load error:', error)}
              />
              <Text style={styles.googleButtonText}>Đăng nhập bằng Google</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerLink}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backLinkText}>← Quay lại trang chủ</Text>
        </TouchableOpacity>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#2c3e50',
  },
  button: {
    backgroundColor: '#3498db',
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
  backLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  backLinkText: {
    fontSize: 14,
    color: '#3498db',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#7f8c8d',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#3c4043',
    fontSize: 16,
    fontWeight: '500',
  },
})

export default Login


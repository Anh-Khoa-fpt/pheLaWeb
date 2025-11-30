import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

// Sử dụng proxy khi chạy trên web để tránh CORS
const API_BASE_URL = Platform.OS === 'web' 
  ? '' // Sử dụng relative path khi chạy trên web (sẽ được proxy)
  : 'https://api.metrohcmc.xyz' // Sử dụng full URL cho mobile

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 giây timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
  },
  // Thêm cấu hình cho React Native/Expo
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Chấp nhận status từ 200-499
  },
  // Cấu hình cho web (tránh CORS issues)
  withCredentials: false,
  // Cho phép redirect
  maxRedirects: 5,
})

// Interceptor để thêm token vào header nếu có
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Error getting token:', error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor để xử lý response và lỗi
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      try {
        await AsyncStorage.removeItem('token')
        await AsyncStorage.removeItem('user')
        // Navigation sẽ được xử lý ở component level
      } catch (e) {
        console.error('Error removing token:', e)
      }
    }
    return Promise.reject(error)
  }
)

// API functions
export const authAPI = {
  // Đăng nhập
  login: async (email, password, rememberMe = false) => {
    try {
      console.log('Login request:', { email, rememberMe })
      const response = await api.post('/api/Auth/sign-in', {
        email,
        password,
        rememberMe,
      })
      console.log('Login response:', response.data)
      return {
        ...response.data,
        httpStatus: response.status,
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      })
      
      // Xử lý lỗi network
      if (
        error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNABORTED' ||
        error.message?.includes('ERR_FAILED') ||
        error.message?.includes('Network Error') ||
        !error.response
      ) {
        throw {
          message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.',
          isNetworkError: true,
        }
      }
      
      // Xử lý lỗi từ server
      if (error.response) {
        throw {
          ...error.response.data,
          httpStatus: error.response.status,
        }
      }
      
      throw { message: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.' }
    }
  },

  signup: async (userData) => {
    try {
      console.log('Signup request:', JSON.stringify(userData, null, 2))
      const response = await api.post('/api/Auth/customer/register', userData)
      console.log('Signup response:', response.data)
      
      // Kiểm tra nếu response status không phải 200-299
      if (response.status >= 400) {
        // Nếu server trả về lỗi nhưng vẫn có response data
        const errorData = response.data || {}
        throw {
          ...errorData,
          httpStatus: response.status,
          message: errorData.message || errorData.result || `Server error: ${response.status}`,
        }
      }
      
      return {
        ...response.data,
        httpStatus: response.status,
      }
    } catch (error) {
      console.error('Signup error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error,
      })
      
      // Xử lý lỗi network (ERR_FAILED, ERR_NETWORK, timeout)
      if (
        error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNABORTED' ||
        error.message?.includes('ERR_FAILED') ||
        error.message?.includes('Network Error') ||
        !error.response
      ) {
        throw {
          message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.',
          isNetworkError: true,
        }
      }
      
      // Xử lý lỗi từ server (400, 401, 500, etc.)
      if (error.response) {
        const errorData = error.response.data || {}
        const errorMessage = 
          errorData.message || 
          errorData.result || 
          errorData.error ||
          (errorData.errors && Array.isArray(errorData.errors) ? errorData.errors.join(', ') : null) ||
          (errorData.errors && typeof errorData.errors === 'object' ? Object.values(errorData.errors).flat().join(', ') : null) ||
          `Lỗi từ server (${error.response.status})`
        
        throw {
          ...errorData,
          httpStatus: error.response.status,
          message: errorMessage,
        }
      }
      
      throw { message: error.message || 'Đăng ký thất bại. Vui lòng thử lại.' }
    }
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Đăng nhập bằng Google
  loginWithGoogle: async ({ email, fullName, rememberMe = true }) => {
    try {
      const response = await api.post('/api/Auth/sign-in-by-google', {
        email,
        fullName,
        rememberMe,
      })
      return {
        ...response.data,
        httpStatus: response.status,
      }
    } catch (error) {
      if (error.response) {
        throw {
          ...error.response.data,
          httpStatus: error.response.status,
        }
      }
      throw { message: error.message }
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      await api.post('/api/Auth/logout')
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('user')
      return { success: true }
    } catch (error) {
      // Dù API có lỗi, vẫn xóa token và user ở local
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('user')
      if (error.response) {
        throw {
          ...error.response.data,
          httpStatus: error.response.status,
        }
      }
      throw { message: error.message }
    }
  },
}

export default api


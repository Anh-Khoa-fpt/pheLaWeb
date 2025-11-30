import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const savedUser = await AsyncStorage.getItem('user')
      
      if (token) {
        setIsLoggedIn(true)
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser))
          } catch (e) {
            console.error('Error parsing user data:', e)
            setUser(null)
          }
        }
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setIsLoggedIn(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthStatus()
    
    // Check auth status periodically
    const interval = setInterval(checkAuthStatus, 2000)
    return () => clearInterval(interval)
  }, [])

  const updateAuthState = async (token, userData) => {
    try {
      if (token) {
        await AsyncStorage.setItem('token', token)
        setIsLoggedIn(true)
        if (userData) {
          await AsyncStorage.setItem('user', JSON.stringify(userData))
          setUser(userData)
        }
      } else {
        await AsyncStorage.removeItem('token')
        await AsyncStorage.removeItem('user')
        setIsLoggedIn(false)
        setUser(null)
      }
      // Trigger re-check for all components
      await checkAuthStatus()
    } catch (error) {
      console.error('Error updating auth state:', error)
    }
  }

  const clearAuthState = async () => {
    try {
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('user')
      setIsLoggedIn(false)
      setUser(null)
    } catch (error) {
      console.error('Error clearing auth state:', error)
    }
  }

  const value = {
    isLoggedIn,
    user,
    loading,
    updateAuthState,
    clearAuthState,
    checkAuthStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return ctx
}


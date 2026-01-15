import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Header from '../common/Header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Layout = ({ children, showBack = false }) => {
  const navigation = useNavigation()
  const route = useRoute()
  const insets = useSafeAreaInsets()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(15)).current

  const canGoBack = navigation.canGoBack()
  const showToolbar = route.name !== 'Home' && showBack !== false
  const showFloatingBack = route.name !== 'Home' && canGoBack

  // Get page name for display
  const getPageName = (routeName) => {
    const names = {
      Menu: 'Thực Đơn theo category',
      Product: 'Tổng sản phẩm',
      About: 'Giới Thiệu',
      Contact: 'Liên Hệ',
      Cart: 'Giỏ Hàng',
      Dashboard: 'Dashboard',
      Profile: 'Hồ Sơ',
      Login: 'Đăng Nhập',
      SignUp: 'Đăng Ký',
    }
    return names[routeName] || routeName
  }

  useEffect(() => {
    // Reset animation values when route changes
    fadeAnim.setValue(0)
    translateY.setValue(15)
    
    // Page transition animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }, [route.name])

  // Handle back navigation with animation
  const handleGoBack = () => {
    // Reverse animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -15,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.goBack()
    })
  }

  return (
    <View style={styles.layout}>
      <Header />
      {showToolbar && (
        <View style={styles.toolbar}>
          <View style={styles.toolbarContent}>
            {canGoBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleGoBack}
                activeOpacity={0.7}
              >
                <Text style={styles.backButtonText}>← Quay lại</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.currentPath}>{getPageName(route.name)}</Text>
          </View>
        </View>
      )}
      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {children}
        </ScrollView>
      </Animated.View>

      {/* Floating Back Button - Sticky */}
      {showFloatingBack && (
        <View
          style={[
            styles.floatingBackButton,
            {
              top: insets.top + 100, // Below header
            },
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            style={styles.floatingBackButtonInner}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Text style={styles.floatingBackButtonText}>←</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#020617',
  },
  toolbar: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
  },
  toolbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#1e3c72',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3c72',
  },
  currentPath: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textTransform: 'capitalize',
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    padding: 16,
    width: '100%',
    maxWidth: 1100,
  },
  floatingBackButton: {
    position: 'absolute',
    right: 16,
    zIndex: 1000,
  },
  floatingBackButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  floatingBackButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3c72',
  },
})

export default Layout


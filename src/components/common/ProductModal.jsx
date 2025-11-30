import React from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'

const ProductModal = ({ product, isOpen, onClose }) => {
  const navigation = useNavigation()
  const { addToCart } = useCart()
  const { isLoggedIn } = useAuth()

  if (!isOpen || !product) return null

  const handleAddToCart = async () => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.',
        [
          { text: 'Hủy', style: 'cancel', onPress: onClose },
          {
            text: 'Đăng nhập',
            onPress: () => {
              onClose()
              navigation.navigate('Login')
            },
          },
        ]
      )
      return
    }
    addToCart(product)
    Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng!', [
      { text: 'OK', onPress: onClose },
    ])
  }

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <ScrollView 
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: product.image }} 
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <View style={styles.info}>
              <Text style={styles.category}>{product.category}</Text>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.desc}>{product.desc}</Text>
              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Giá:</Text>
                  <Text style={styles.detailValue}>{product.price}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Độ tươi:</Text>
                  <Text style={styles.detailValue}>{product.freshness}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                <Text style={styles.addButtonText}>Thêm Vào Giỏ</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 24,
    maxWidth: 600,
    width: '100%',
    maxHeight: '90%',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#64748b',
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 24,
    gap: 24,
  },
  imageContainer: {
    width: '100%',
    minHeight: 300,
    maxHeight: 400,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 18,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    minHeight: 250,
  },
  info: {
    gap: 16,
  },
  category: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  desc: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  details: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3c72',
  },
  addButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})

export default ProductModal


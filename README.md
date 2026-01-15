# Fish App - React Native



## Cấu trúc dự án

```
nativeWeb/
├── App.js                 # Entry point với React Navigation
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── SignUp.jsx
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   └── ProductModal.jsx
│   │   └── layout/
│   │       └── Layout.jsx
│   ├── contexts/
│   │   └── CartContext.jsx
│   ├── data/
│   │   └── products.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── Cart.jsx
│   │   ├── Dashboard.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── Profile.jsx
│   └── services/
│       └── api.js
├── package.json
├── app.json
└── babel.config.js
```

## Tính năng

- ✅ Đăng nhập / Đăng ký
- ✅ Quản lý giỏ hàng với AsyncStorage
- ✅ Xem danh sách sản phẩm
- ✅ Chi tiết sản phẩm (Modal)
- ✅ Dashboard người dùng
- ✅ Trang giới thiệu
- ✅ Trang liên hệ
- ✅ Profile người dùng
- ✅ Navigation với React Navigation
- ✅ API integration với axios

## Cài đặt

1. Cài đặt dependencies:

```bash
cd nativeWeb
npm install
```

2. Chạy ứng dụng:

```bash
# iOS
npm run ios

# Android
npm run android

# Web (để test)
npm run web
```

## Cấu hình

### API Base URL




Để sử dụng Google Sign-In, bạn cần cấu hình trong `app.json` và thêm Google Client ID.

## Công nghệ sử dụng

- **React Native** với Expo
- **React Navigation** - Navigation
- **AsyncStorage** - Local storage
- **Axios** - HTTP client
- **React Context** - State management

## So sánh với phiên bản Web

| Tính năng | Web (fishAppAuth) | Native (nativeWeb) |
|-----------|-------------------|-------------------|
| Routing | react-router-dom | @react-navigation/native |
| Storage | localStorage | AsyncStorage |
| Components | HTML/CSS | React Native Components |
| Styling | CSS files | StyleSheet |
| Navigation | BrowserRouter | NavigationContainer |

## Lưu ý

- Ứng dụng sử dụng Expo để dễ dàng phát triển và test
- AsyncStorage được sử dụng thay cho localStorage
- Tất cả components đã được chuyển đổi sang React Native components
- Styling sử dụng StyleSheet thay vì CSS files

## Phát triển tiếp

- [ ] Thêm Google Sign-In
- [ ] Tích hợp thanh toán
- [ ] Push notifications
- [ ] Offline mode
- [ ] Image caching

## Tích hợp thanh toán MoMo sandbox

1. Chạy backend MoMo tại `momoPayment/payment/nodejs/backend` (hoặc deploy lên Vercel) để expose `POST /api/momo/create-payment`.
2. Trong Expo web (`pheLaOrderWeb`), thêm biến môi trường khi chạy/test:
   ```
   EXPO_PUBLIC_PAYMENT_API=http://localhost:3000
   EXPO_PUBLIC_MOMO_RETURN_URL=https://demo.your-frontend/momo-return
   EXPO_PUBLIC_MOMO_IPN_URL=https://demo.your-frontend/momo-ipn
   ```
3. Ở trang `Cart`, chọn `MoMo (sandbox)` sẽ gọi API, lấy `payUrl` từ MoMo sandbox và chuyển hướng người dùng tới cổng thanh toán.  
4. Kết thúc thanh toán, MoMo sẽ gửi IPN tới URL bạn khai báo, backend sẽ log payload ra console để test.  

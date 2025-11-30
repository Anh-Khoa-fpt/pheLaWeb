# Fish App - React Native

Ứng dụng React Native tương tự như phiên bản web `fishAppAuth`, được thiết kế cho mobile với cấu trúc chuẩn và đầy đủ tính năng.

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

API base URL được cấu hình trong `src/services/api.js`:
- Mặc định: `https://api.metrohcmc.xyz`

### Google Sign-In

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


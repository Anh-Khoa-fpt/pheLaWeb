import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { CartProvider } from './src/contexts/CartContext'
import { AuthProvider } from './src/contexts/AuthContext'

// Pages
import Home from './src/pages/Home'
import Products from './src/pages/Products'
import About from './src/pages/About'
import Contact from './src/pages/Contact'
import Login from './src/components/auth/Login'
import SignUp from './src/components/auth/SignUp'
import Dashboard from './src/pages/Dashboard'
import Profile from './src/pages/Profile'
import Cart from './src/pages/Cart'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Products" component={Products} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="Contact" component={Contact} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Cart" component={Cart} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  )
}


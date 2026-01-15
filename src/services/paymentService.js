import axios from 'axios'

const API_BASE =
  process.env.EXPO_PUBLIC_PAYMENT_API || 'https://momo-api-olive.vercel.app'

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
})

export const createMoMoPayment = (payload) => {
  return client.post('/api/momo/create-payment', {
    amount: String(payload.amount ?? 0),
    orderInfo: payload.orderInfo || 'Đơn hàng Phê La',
    extraData: payload.extraData || '',
    redirectUrl: payload.redirectUrl,
    ipnUrl: payload.ipnUrl,
  })
}

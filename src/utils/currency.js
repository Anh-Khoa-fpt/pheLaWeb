export const formatCurrency = (value) =>
  value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '₫0'

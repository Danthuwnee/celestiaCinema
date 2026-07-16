import axiosClient from './axiosClient'

const paymentApi = {
  initiateBankPayment: (bookingId) => axiosClient.post(`/payments/bank/initiate/${bookingId}`),
  createZaloPayPayment: (bookingId) => axiosClient.post(`/payments/zalopay/create/${bookingId}`),
  getPaymentStatus: (bookingId) => axiosClient.get(`/payments/${bookingId}/status`),
}

export default paymentApi

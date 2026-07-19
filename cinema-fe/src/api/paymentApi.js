import axiosClient from './axiosClient'

const paymentApi = {
  initiateBankPayment: (bookingId) => axiosClient.post(`/payments/bank/initiate/${bookingId}`),
  getPaymentStatus: (bookingId) => axiosClient.get(`/payments/${bookingId}/status`),
}

export default paymentApi

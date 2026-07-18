import axiosClient from './axiosClient'

const couponApi = {
  applyCoupon: (data) => axiosClient.post('/coupons/apply', data),
  getActiveCoupons: () => axiosClient.get('/coupons/active-coupons'),
}

export default couponApi

import axiosClient from './axiosClient'

const authApi = {
  register: (data) => axiosClient.post('/auth/register', data),
  login: (data) => axiosClient.post('/auth/login', data),
  getProfile: () => axiosClient.get('/auth/profile'),
  updateProfile: (data) => axiosClient.put('/auth/profile', data),
  changePassword: (data) => axiosClient.put('/auth/change-password', data),
  forgotPassword: (email) => axiosClient.post('/auth/forgot-password', { email }),
  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),
  checkEmail: (email) => axiosClient.get('/auth/check-email', { params: { email } }),
}

export default authApi

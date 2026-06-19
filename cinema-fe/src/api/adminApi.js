import axiosClient from './axiosClient'

const adminApi = {
  getMovies: (params) => axiosClient.get('/admin/movies', { params }),
  createMovie: (data) => axiosClient.post('/admin/movies', data),
  updateMovie: (id, data) => axiosClient.put(`/admin/movies/${id}`, data),
  deleteMovie: (id) => axiosClient.delete(`/admin/movies/${id}`),

  getRooms: () => axiosClient.get('/admin/rooms'),
  createRoom: (data) => axiosClient.post('/admin/rooms', data),
  updateRoom: (id, data) => axiosClient.put(`/admin/rooms/${id}`, data),

  getShowtimes: () => axiosClient.get('/admin/showtimes'),
  createShowtime: (data) => axiosClient.post('/admin/showtimes', data),
  cancelShowtime: (id) => axiosClient.delete(`/admin/showtimes/${id}`),

  getCoupons: (params) => axiosClient.get('/admin/coupons', { params }),
  createCoupon: (data) => axiosClient.post('/admin/coupons', data),
  deleteCoupon: (id) => axiosClient.delete(`/admin/coupons/${id}`),

  getCombos: (params) => axiosClient.get('/admin/combos', { params }),
  createCombo: (data) => axiosClient.post('/admin/combos', data),
  deleteCombo: (id) => axiosClient.delete(`/admin/combos/${id}`),

  getDashboard: () => axiosClient.get('/admin/statistics/dashboard'),
  getRevenue: (params) => axiosClient.get('/admin/statistics/revenue', { params }),
}

export default adminApi

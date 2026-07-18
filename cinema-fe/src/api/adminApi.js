import axiosClient from './axiosClient'

const adminApi = {
  getMovies: (params) => axiosClient.get('/admin/movies', { params }),
  createMovie: (data) => axiosClient.post('/admin/movies', data),
  updateMovie: (id, data) => axiosClient.put(`/admin/movies/${id}`, data),
  deleteMovie: (id) => axiosClient.delete(`/admin/movies/${id}`),
  updateMovieStatus: (id, status) => axiosClient.put(`/admin/movies/${id}/status?status=${status}`),

  getRooms: () => axiosClient.get('/admin/rooms'),
  getSeatTypes: () => axiosClient.get('/admin/rooms/seat-types'),
  getRoomSeats: (roomId) => axiosClient.get(`/admin/rooms/${roomId}/seats`),
  createRoom: (data) => axiosClient.post('/admin/rooms', data),
  updateRoom: (id, data) => axiosClient.put(`/admin/rooms/${id}`, data),
  deleteRoom: (id) => axiosClient.delete(`/admin/rooms/${id}`),

  getShowtimes: (params) => axiosClient.get('/admin/showtimes', { params }),
  createShowtime: (data) => axiosClient.post('/admin/showtimes', data),
  batchCancelShowtimes: (ids) => axiosClient.post('/admin/showtimes/batch-cancel', ids),
  cancelShowtime: (id) => axiosClient.delete(`/admin/showtimes/${id}`),
  getShowtimeSlots: (params) => axiosClient.get('/admin/showtimes/slots', { params }),
  batchCreateShowtimes: (data) => axiosClient.post('/admin/showtimes/batch', data),

  getCoupons: (params) => axiosClient.get('/admin/coupons', { params }),
  createCoupon: (data) => axiosClient.post('/admin/coupons', data),
  updateCoupon: (id, data) => axiosClient.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => axiosClient.delete(`/admin/coupons/${id}`),

  getCombos: (params) => axiosClient.get('/admin/combos', { params }),
  createCombo: (data) => axiosClient.post('/admin/combos', data),
  updateCombo: (id, data) => axiosClient.put(`/admin/combos/${id}`, data),
  deleteCombo: (id) => axiosClient.delete(`/admin/combos/${id}`),

  getDashboard: () => axiosClient.get('/admin/statistics/dashboard'),
  getRevenue: (startDate, endDate) => axiosClient.get('/admin/statistics/revenue', { params: { startDate, endDate } }),
}

export default adminApi

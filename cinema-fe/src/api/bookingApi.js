import axiosClient from './axiosClient'

const bookingApi = {
  getSeatsByShowtime: (showtimeId) => axiosClient.get(`/seats/showtime/${showtimeId}`),
  lockSeats: (data) => axiosClient.post('/seats/lock', data),
  unlockSeats: (data) => axiosClient.post('/seats/unlock', data),
  createBooking: (data) => axiosClient.post('/bookings', data),
  getUserBookings: (params) => axiosClient.get('/bookings', { params }),
  getBookingDetail: (id) => axiosClient.get(`/bookings/${id}`),
  getShowtimesByMovie: (movieId) => axiosClient.get(`/showtimes/movie/${movieId}`),
}

export default bookingApi

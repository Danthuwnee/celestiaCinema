import axiosClient from './axiosClient'

const showtimeApi = {
  getShowtimesByMovie: (movieId) => axiosClient.get(`/showtimes/movie/${movieId}`),
}

export default showtimeApi

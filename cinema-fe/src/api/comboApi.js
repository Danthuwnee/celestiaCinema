import axiosClient from './axiosClient'

const comboApi = {
  getCombos: () => axiosClient.get('/combos'),
}

export default comboApi

import axios from 'axios'

export const Axios = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 5000
})

export const AxiosUser = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
})

// export default Axios

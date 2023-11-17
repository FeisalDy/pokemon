import axios from 'axios'

const Axios = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 5000
})

export default Axios

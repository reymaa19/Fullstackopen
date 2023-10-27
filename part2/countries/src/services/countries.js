import axios from 'axios'
const BASE_URL = 'https://studies.cs.helsinki.fi/restcountries'

const getCountries = () => {
  return axios.get(`${BASE_URL}/api/all`)
    .then((response) => response.data)
}

export default { getCountries }


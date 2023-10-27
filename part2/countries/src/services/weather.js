import axios from 'axios'
const API_KEY = import.meta.env.VITE_SOME_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

const getWeather = (city) => {
  return axios
    .get(`${WEATHER_URL}?q=${city}&units=metric&APPID=${API_KEY}`)
    .then((response) => response.data)
}

export default { getWeather }


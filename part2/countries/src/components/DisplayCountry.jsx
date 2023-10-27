import { useEffect, useState } from 'react'
import weatherService from '../services/weather'

const DisplayCountry = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const ICON_URL = 'https://openweathermap.org/img/wn'

  useEffect(() => {
    weatherService
      .getWeather(country.capital)
      .then((weather) => setWeather(weather))
  }, [])

  return (
    <>
      <h2>{country.name.common}</h2>
      <div>
        <p>
          capital {country.capital}
          <br />
          area {country.area}
        </p>
      </div>
      <div>
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
      </div>
      <img src={country.flags.png} />
      <div>
        <h2>Weather in {country.capital}</h2>
        <p>temperature {weather && weather.main.temp} Celsius</p>
        <img src={weather && `${ICON_URL}/${weather.weather[0].icon}@2x.png`} />
        <p>wind {weather && weather.wind.speed} m/s</p>
      </div>
    </>
  )
}

export default DisplayCountry

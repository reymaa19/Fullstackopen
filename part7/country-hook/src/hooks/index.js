import axios from 'axios'
import { useEffect, useState } from 'react'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const BASE_URL = 'https://studies.cs.helsinki.fi/restcountries/api/name/'

  useEffect(() => {
    const searchCountry = async () => {
      try {
        const foundCountry = await axios.get(BASE_URL + name)
        setCountry({ ...foundCountry, found: true })
      } catch {
        setCountry({ found: false })
      }
    }

    name && searchCountry()
  }, [name])

  return country
}

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange,
  }
}

import { useEffect, useState } from 'react'
import DisplayCountries from './components/DisplayCountries'
import countryService from './services/countries'

const App = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [countries, setCountries] = useState([])

  useEffect(() => {
    countryService.getCountries().then((countries) => setCountries(countries))
  }, [])

  const handleQueryChange = (event) => {
    setSearchQuery(event.target.value)

    const results = countries.filter((country) =>
      country.name.common
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    )

    results.length > 10 ? setSearchResults(null) : setSearchResults(results)
  }

  return (
    <div>
      find countries <input value={searchQuery} onChange={handleQueryChange} />
      <div>
        {!searchResults && searchQuery ? (
          'Too many matches, specify another filter'
        ) : (
          <DisplayCountries
            countries={searchResults}
            showCountry={(country) => setSearchResults(country)}
          />
        )}
      </div>
    </div>
  )
}

export default App

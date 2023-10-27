import DisplayCountry from './DisplayCountry'

const DisplayCountries = ({ countries, showCountry }) => {
  if (countries)
    return (
      <>
        {countries.length !== 1 ? (
          countries.map((country) => (
            <div key={country.name.common}>
              {country.name.common}{' '}
              <button onClick={() => showCountry([country])}>show</button>
            </div>
          ))
        ) : (
          <DisplayCountry country={countries[0]} />
        )}
      </>
    )
}

export default DisplayCountries

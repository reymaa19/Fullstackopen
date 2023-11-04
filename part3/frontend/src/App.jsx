import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
// I moved some event handlers and states from the App root component to their own separate components.

const App = () => {
  const [persons, setPersons] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then((allPersons) => setPersons(allPersons))
  }, [])

  const handleAddPerson = (newPerson) => {
    personService
      .addPerson(newPerson)
      .then((addedPerson) =>
        setPersons((prevPersons) => [...prevPersons, addedPerson])
      )
      .then((result) => {
        setErrorMessage(`Added ${newPerson.name}`)
        setTimeout(() => setErrorMessage(null), 5000)
      })
      .catch((error) => {
        console.log(error.response.data.error)
        setErrorMessage(error.response.data.error)
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const changeNumber = (changedPerson) => {
    personService
      .changeNumber(changedPerson)
      .then((cp) =>
        setPersons(persons.map((person) => (person.id !== cp.id ? person : cp)))
      )
      .catch((error) => {
        setErrorMessage(
          error.response ? error.response.data.error : error.toString()
        )
        setTimeout(() => {
          setErrorMessage(null)
          setPersons((prevPersons) =>
            prevPersons.filter((person) => person.id !== changedPerson.id)
          )
        }, 5000)
      })
  }

  const deletePerson = (id) => {
    personService.deletePerson(id)
    setPersons(persons.filter((person) => person.id !== id))
  }

  const findSearchResults = (search) => {
    setSearching(true)
    setSearchResults(
      persons.filter((person) => person.name.toLowerCase().includes(search))
    )

    if (search === '') setSearching(false)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter handleSearch={findSearchResults} />
      <PersonForm
        persons={persons}
        handleAddPerson={handleAddPerson}
        handleChangeNumber={changeNumber}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        searching={searching}
        searchResults={searchResults}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App

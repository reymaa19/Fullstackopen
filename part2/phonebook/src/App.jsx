import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
// I moved some event handlers and states from the App root component to their own separate components.

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error' style={{color: message.includes('removed') ? 'red' : 'green'}}>
      {message}
    </div>
  )
}

const Filter = ({ handleSearch }) => {
  const [search, setSearch] = useState('')

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    handleSearch(event.target.value)
  }

  return <div>
    filter shown with <input value={search} onChange={handleSearchChange} />
    </div>
}

const PersonForm = ({ persons, handleAddPerson, handleChangeNumber }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {name: newName, number: newNumber}
    let foundPerson = persons.find(person => person.name === newName)

    if (foundPerson) { 
      if (confirm(`${foundPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        foundPerson.number = newNumber
        handleChangeNumber(foundPerson)
      }
    }
    else {
      handleAddPerson(newPerson)
      setNewName('')
      setNewNumber('')
    }
  }


  return <form onSubmit={addPerson}>
    <h2>add a new</h2>
    <div>
      name: <input value={newName} onChange={(event) => setNewName(event.target.value)}/>
    </div>
    <div>
      number <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
}

const Persons = ({ persons, searching, searchResults, deletePerson }) => {
  return searching ? 
    searchResults.map(person => 
      <div key={person.name}>
        {person.name} {person.number}{' '} 
        <button onClick={() => confirm(`Delete ${person.name}?`) && deletePerson(person.id)}>delete</button>
      </div>)
    :
    persons.map(person => <div key={person.name}>
      {person.name} {person.number}{' '}
      <button onClick={() => confirm(`Delete ${person.name}?`) && deletePerson(person.id)}>delete</button>
      </div>)
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
      personService.getAll().then(allPersons => setPersons(allPersons))
  }, [])

  const handleAddPerson = (newPerson) => {
    personService.addPerson(newPerson)
      .then(addedPerson => setPersons((prevPersons) => [...prevPersons, addedPerson]))
    setErrorMessage(`Added ${newPerson.name}`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const changeNumber = (changedPerson) => {
   personService.changeNumber(changedPerson)
    .then(cp => setPersons(persons.map(person => person.id !== cp.id ? person : cp)))
    .catch(() => {
      setErrorMessage(`Information of ${changedPerson.name} has already been removed from server`)
      setTimeout(() => {
        personService.getAll().then(allPersons => setPersons(allPersons))
        setErrorMessage(null)
      }, 5000)      
    })
  }

  const deletePerson = (id) => {
    personService.deletePerson(id)
    setPersons(persons.filter(person => person.id !== id))
  }

  const findSearchResults = (search) => {
    setSearching(true)
    setSearchResults(persons.filter(person => person.name.toLowerCase().includes(search)))

    if (search === '') setSearching(false)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter handleSearch={findSearchResults}/>
      <PersonForm 
        persons={persons} 
        handleAddPerson={handleAddPerson} 
        handleChangeNumber={changeNumber}/>
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

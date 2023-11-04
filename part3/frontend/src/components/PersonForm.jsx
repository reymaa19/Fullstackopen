import { useState } from 'react'

const PersonForm = ({ persons, handleAddPerson, handleChangeNumber }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }
    let foundPerson = persons.find((person) => person.name === newName)

    if (foundPerson) {
      if (
        confirm(
          `${foundPerson.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        foundPerson.number = newNumber
        handleChangeNumber(foundPerson)
      }
    } else {
      handleAddPerson(newPerson)
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <form onSubmit={addPerson}>
      <h2>add a new</h2>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
      </div>
      <div>
        number{' '}
        <input
          value={newNumber}
          onChange={(event) => setNewNumber(event.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm

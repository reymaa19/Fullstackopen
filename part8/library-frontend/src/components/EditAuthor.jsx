import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const EditAuthor = ({ names, token }) => {
  const [name, setName] = useState('')
  const [birthYear, setBirthYear] = useState('')

  const [changeBirthYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!token) return null

  const submit = (event) => {
    event.preventDefault()

    changeBirthYear({ variables: { name, setBornTo: parseInt(birthYear) } })

    setName('')
    setBirthYear('')
  }

  return (
    <div>
      <h2>Set birth year</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="names">Choose an author: </label>
          <select
            name="names"
            id="names"
            onChange={({ target }) => setName(target.value)}
            value={name}
          >
            <option value="" disabled={true}></option>
            {names.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          birth year{' '}
          <input
            type="number"
            value={birthYear}
            onChange={({ target }) => setBirthYear(target.value)}
          />
        </div>
        <button type="submit">change birth year</button>
      </form>
    </div>
  )
}

export default EditAuthor

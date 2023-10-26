import { useState } from 'react'

const Filter = ({ handleSearch }) => {
  const [search, setSearch] = useState('')

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    handleSearch(event.target.value)
  }

  return (
    <div>
      filter shown with <input value={search} onChange={handleSearchChange} />
    </div>
  )
}

export default Filter

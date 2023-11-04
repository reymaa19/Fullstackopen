const Persons = ({ persons, searching, searchResults, deletePerson }) => {
  return searching
    ? searchResults.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}{' '}
          <button
            onClick={() =>
              confirm(`Delete ${person.name}?`) && deletePerson(person.id)
            }
          >
            delete
          </button>
        </div>
      ))
    : persons.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}{' '}
          <button
            onClick={() =>
              confirm(`Delete ${person.name}?`) && deletePerson(person.id)
            }
          >
            delete
          </button>
        </div>
      ))
}

export default Persons

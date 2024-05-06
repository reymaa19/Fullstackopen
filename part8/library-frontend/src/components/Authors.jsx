import EditAuthor from './EditAuthor'

const Authors = ({ show, authors, token }) => {
  if (!show) return null

  return (
    <>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditAuthor names={authors.map((a) => a.name)} token={token} />
    </>
  )
}

export default Authors

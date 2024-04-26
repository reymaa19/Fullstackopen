import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import EditAuthor from './EditAuthor'

const Authors = (props) => {
  if (!props.show) return null

  const result = useQuery(ALL_AUTHORS)

  if (result.loading) return <div>loading...</div>

  const authors = result.data.allAuthors

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
      <EditAuthor names={authors.map((a) => a.name)} />
    </>
  )
}

export default Authors

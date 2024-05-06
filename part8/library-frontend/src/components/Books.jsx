import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = ({ show, genres, client }) => {
  const [genreToFind, setGenreToFind] = useState(null)

  const result = useQuery(ALL_BOOKS, {
    variables: { genreToFind },
  })

  const onChangeGenreToFind = (newGenre) => {
    setGenreToFind(newGenre)
    client.refetchQueries({ include: [ALL_BOOKS] })
  }

  useEffect(() => {
    show && onChangeGenreToFind(null)
  }, [show])

  if (result.loading) return <div>loading...</div>

  if (!show) return null

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>
      {genres.map((g) => (
        <button onClick={() => onChangeGenreToFind(g)} key={g}>
          {g}
        </button>
      ))}
      <button onClick={() => onChangeGenreToFind(null)}>all genres</button>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books

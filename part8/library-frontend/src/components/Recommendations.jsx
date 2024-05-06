import { useLazyQuery } from '@apollo/client'
import { useEffect } from 'react'
import { ALL_BOOKS } from '../queries'
const Recommendations = ({ show, me }) => {
  const [getBooks, { loading, data }] = useLazyQuery(ALL_BOOKS)

  useEffect(() => {
    me &&
      !loading &&
      !data &&
      getBooks({ variables: { genreToFind: me.favoriteGenre } })
  }, [me, loading, data])

  if (!show) return null

  if (!me) return null

  if (loading) return <div>loading...</div>

  const books = data.allBooks

  return (
    <>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{me.favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data &&
            books.map((b) => {
              if (b.genres.includes(me.favoriteGenre))
                return (
                  <tr key={b.title}>
                    <td>{b.title}</td>
                    <td>{b.author.name}</td>
                    <td>{b.published}</td>
                  </tr>
                )
            })}
        </tbody>
      </table>
    </>
  )
}

export default Recommendations

import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, ME } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`The book '${addedBook.title}' added`)
      client.refetchQueries({ include: [ALL_AUTHORS, ALL_BOOKS] })
    },
  })

  const logout = () => {
    setPage('authors')
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const res1 = useQuery(ALL_BOOKS)
  const res2 = useQuery(ALL_AUTHORS)
  const res3 = useQuery(ME)

  if (res1.loading || res2.loading || res3.loading) return <div>loading...</div>

  const books = res1.data.allBooks
  const authors = res2.data.allAuthors
  const me = res3.data.me

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('recommendations')}>
              recommend
            </button>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} authors={authors} token={token} />

      <Books
        show={page === 'books'}
        genres={[...new Set(books.map((b) => b.genres).flat())]}
        client={client}
      />

      <Recommendations show={page === 'recommendations'} me={me} />

      <NewBook show={page === 'add'} />

      <LoginForm
        show={page === 'login'}
        setToken={(newToken) => {
          setToken(newToken)
          client.refetchQueries({ include: [ME] })
        }}
        setPage={(newPage) => setPage(newPage)}
      />
    </div>
  )
}

export default App

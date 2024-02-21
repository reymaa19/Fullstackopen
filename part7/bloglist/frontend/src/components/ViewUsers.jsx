import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, useMatch } from 'react-router-dom'
import { useUserValue } from '../reducers/UserContext'
import userService from '../services/users'
import Login from './Login'

const ViewUsers = () => {
  const user = useUserValue()
  const match = useMatch('/users/:id')

  const result = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (!user) return <Navigate to="/" />
  if (result.isLoading) return <div>loading users...</div>
  const users = result.data

  const viewedUser = match
    ? users.find((user) => user.id === match.params.id)
    : null

  const viewingUser = () => {
    if (!viewedUser) {
      return (
        <>
          <h2>Users</h2>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>blogs created</th>
              </tr>
              {users.map((user) => {
                return (
                  <tr key={user.id}>
                    <td>
                      <Link to={`/users/${user.id}`}>{user.name}</Link>
                    </td>
                    <td>{user.blogs.length}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      )
    } else {
      return (
        <>
          <h2>{viewedUser.name}</h2>
          <h3>added blogs</h3>
          <ul>
            {viewedUser.blogs.map((blog) => {
              return <li key={blog.id}>{blog.title}</li>
            })}
          </ul>
        </>
      )
    }
  }

  return (
    <>
      {!user ? (
        <Login />
      ) : (
        <Box sx={{ fontSize: '1.5em' }}>{viewingUser()}</Box>
      )}
    </>
  )
}

export default ViewUsers

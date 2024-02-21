import { Box, Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { setUser, useUserDispatch, useUserValue } from '../reducers/UserContext'

const Navigation = () => {
  const navigate = useNavigate()
  const user = useUserValue()
  const userDispatch = useUserDispatch()

  return (
    <Box sx={{ fontSize: '1.5em' }}>
      {!user ? (
        <h2>log in to application</h2>
      ) : (
        <>
          <div style={{ backgroundColor: 'lightgrey', padding: 5 }}>
            <Link to="/blogs">blogs</Link> <Link to="/users">users</Link> logged
            in as {user.name}{' '}
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setUser(userDispatch, null)
                window.localStorage.removeItem('loggedBloglistUser')
                navigate('/')
              }}
            >
              logout
            </Button>
          </div>
          <h2>
            <Link to="/" style={{ textDecoration: 'none' }}>
              blog app
            </Link>
          </h2>
        </>
      )}
    </Box>
  )
}

export default Navigation

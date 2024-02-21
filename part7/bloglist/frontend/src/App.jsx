import { Box } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import {
  setNotification,
  useNotificationDispatch,
} from './reducers/NotificationContext'
import { useUserValue } from './reducers/UserContext'
import blogService from './services/blogs'

const App = () => {
  const [error, setError] = useState(false)
  const blogFormRef = useRef()
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const user = useUserValue()

  const newBlogMutation = useMutation({
    mutationFn: blogService.addBlog,
    onSuccess: (newBlog) => {
      newBlog.user = user
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      handleNotificationChange(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      )
    },
    onError: (error) =>
      handleNotificationChange(error.response.data.error, true),
  })

  const handleNotificationChange = (newNotification, newError) => {
    setNotification(notificationDispatch, newNotification, 5000)
    setError(newError)
  }

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (result.isLoading) return <div>loading blogs...</div>

  const blogs = result.data.sort((blogA, blogB) => {
    if (blogA.likes > blogB.likes) return -1
    else if (blogA.likes < blogB.likes) return 1
    else return 0
  })

  return (
    <Box sx={{ fontSize: '1.5em' }}>
      {!user ? (
        <Login />
      ) : (
        <>
          <Notification error={error} />
          <Togglable buttonLabel={'create new'} ref={blogFormRef}>
            <BlogForm
              createBlog={(newBlog) => {
                blogFormRef.current.toggleVisibility()
                newBlogMutation.mutate(newBlog)
              }}
            />
          </Togglable>
          {blogs.map((blog) => (
            <Box
              key={blog.id}
              sx={{
                padding: 1,
                borderWidth: 1,
                marginBottom: 1,
              }}
            >
              <Link to={`/blogs/${blog.id}`}>
                {blog.title} {blog.author}{' '}
              </Link>
            </Box>
          ))}
        </>
      )}
    </Box>
  )
}

export default App

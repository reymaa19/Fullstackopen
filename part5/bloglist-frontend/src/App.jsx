import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(false)
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }

    loggedUserJSON && getAllBlogs()
  }, [])

  const getAllBlogs = async () => {
    try {
      const allBlogs = await blogService.getAll()
      setBlogs(allBlogs)
    } catch (error) {
      handleNotificationChange(error.response.data.error, true)
    }
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      handleNotificationChange(`Successfully logged in as ${user.name}`)
      getAllBlogs()
    } catch (error) {
      handleNotificationChange(error.response.data.error, true)
    }
  }

  const handleLogout = async () => {
    blogService.setToken(null)
    setUser(null)
    window.localStorage.removeItem('loggedBloglistUser')
  }

  const handleNotificationChange = (newNotification, newError) => {
    setNotification(newNotification)
    setError(newError)
    setTimeout(() => {
      setNotification(null)
      setError(false)
    }, 5000)
  }

  const createBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()

      const savedBlog = await blogService.addBlog(newBlog)
      savedBlog.user = user

      setBlogs(blogs.concat(savedBlog))

      handleNotificationChange(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      )
    } catch (error) {
      handleNotificationChange(error.response.data.error, true)
    }
  }

  const sortedByLikes = blogs.sort((blogA, blogB) => {
    if (blogA.likes > blogB.likes) return -1
    else if (blogA.likes < blogB.likes) return 1
    else return 0
  })

  const handleRemoveBlog = async (blog) => {
    await blogService.removeBlog(blog.id)
    setBlogs(blogs.filter((b) => b != blog))
  }

  const handleLikeBlog = async (id) => await blogService.likeBlog(id)

  return (
    <div>
      <h2>{user ? 'blogs' : 'log in to application'}</h2>
      <Notification notification={notification} error={error} />
      {!user ? (
        <LoginForm login={handleLogin} />
      ) : (
        <>
          <p>
            logged in as {user.name}{' '}
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel={'new note'} ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>

          {sortedByLikes.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              removeBlog={handleRemoveBlog}
              likeBlog={handleLikeBlog}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default App

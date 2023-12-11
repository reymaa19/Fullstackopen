import { useEffect, useState } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(false)

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

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      handleNotificationChange(`Successfully logged in as ${user.name}`)
      getAllBlogs()
      setUsername('')
      setPassword('')
    } catch (error) {
      handleNotificationChange(error.response.data.error, true)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username:{' '}
        <input
          name="Username"
          value={username}
          type="text"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password:{' '}
        <input
          name="Password"
          value={password}
          type="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleLogout = async () => {
    blogService.setToken(null)
    setUser(null)
    window.localStorage.removeItem('loggedBloglistUser')
  }

  const handleBlogChange = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value })
  }

  const handleNotificationChange = (newNotification, newError) => {
    setNotification(newNotification)
    setError(newError)
    setTimeout(() => {
      setNotification(null)
      setError(false)
    }, 5000)
  }

  const handleAddBlog = async (e) => {
    e.preventDefault()
    try {
      const savedBlog = await blogService.addBlog(newBlog)

      setBlogs(blogs.concat(savedBlog))

      handleNotificationChange(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      )

      setNewBlog({
        title: '',
        author: '',
        url: '',
      })
    } catch (error) {
      handleNotificationChange(error.response.data.error, true)
    }
  }

  const blogForm = () => (
    <form onSubmit={handleAddBlog}>
      <input
        placeholder="title"
        name="title"
        value={newBlog.title}
        onChange={handleBlogChange}
      />
      <br />
      <input
        placeholder="author"
        name="author"
        value={newBlog.author}
        onChange={handleBlogChange}
      />
      <br />
      <input
        placeholder="url"
        name="url"
        value={newBlog.url}
        onChange={handleBlogChange}
      />
      <br />
      <button type="submit">create</button>
    </form>
  )

  return (
    <div>
      <h2>{user ? 'blogs' : 'log in to application'}</h2>
      <Notification notification={notification} error={error} />
      {!user ? (
        loginForm()
      ) : (
        <>
          <p>
            logged in as {user.name}{' '}
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}

          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  )
}

export default App

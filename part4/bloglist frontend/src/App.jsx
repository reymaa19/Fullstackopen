import { useEffect, useState } from 'react'
import blogService from './services/blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const addBlog = (e) => {
    e.preventDefault
    blogService.addBlog(newBlog).then((blog) => {
      setBlogs(blogs.concat(blog))
      setNewBlog({
        title: '',
        author: '',
        url: '',
      })
    })
  }

  const handleBlogChange = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value })
  }

  return (
    <div>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            {blog.author} <a href={blog.url}>{blog.title}</a>
          </li>
        ))}
      </ul>
      <form onSubmit={addBlog}>
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
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App

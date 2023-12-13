import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleBlogChange = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value })
  }

  const addBlog = (e) => {
    e.preventDefault()
    createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
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
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm

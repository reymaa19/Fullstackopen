import { Button, TextField } from '@mui/material'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleBlogChange = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value })
  }

  const addBlog = async (e) => {
    e.preventDefault()
    await createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <form onSubmit={addBlog}>
      <TextField
        variant="outlined"
        size="small"
        sx={{ mb: 1 }}
        placeholder="title"
        name="title"
        value={newBlog.title}
        onChange={handleBlogChange}
      />
      <br />
      <TextField
        variant="outlined"
        size="small"
        sx={{ mb: 1 }}
        placeholder="author"
        name="author"
        value={newBlog.author}
        onChange={handleBlogChange}
      />
      <br />
      <TextField
        variant="outlined"
        size="small"
        sx={{ mb: 1 }}
        placeholder="url"
        name="url"
        value={newBlog.url}
        onChange={handleBlogChange}
      />
      <br />
      <Button variant="contained" size="small" type="submit">
        create
      </Button>
    </form>
  )
}

export default BlogForm

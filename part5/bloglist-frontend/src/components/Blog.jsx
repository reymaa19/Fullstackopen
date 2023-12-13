import { useState } from 'react'
import blogServices from '../services/blogs'

const Blog = ({ blog, removeBlog }) => {
  const [view, setView] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLikeClick = async () => {
    await blogServices.likeBlog(blog.id)
    setLikes(likes + 1)
  }

  const handleRemoveClick = async () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogServices.removeBlog(blog.id)
      removeBlog(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}{' '}
        <button onClick={() => setView(!view)}>{view ? 'hide' : 'view'}</button>
      </div>

      <div style={{ display: !view && 'none' }}>{blog.url}</div>
      <div style={{ display: !view && 'none' }}>
        likes {likes} <button onClick={handleLikeClick}>like</button>
      </div>
      <div style={{ display: !view && 'none' }}>{blog.user.name}</div>
      <button style={{ display: !view && 'none' }} onClick={handleRemoveClick}>
        remove
      </button>
    </div>
  )
}

export default Blog

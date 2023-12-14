import { useState } from 'react'

const Blog = ({ blog, removeBlog, likeBlog }) => {
  const [view, setView] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleRemoveClick = async () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await removeBlog(blog)
    }
  }

  const handleLikeClick = async () => {
    await likeBlog(blog.id)
    setLikes(likes + 1)
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setView(!view)}>{view ? 'hide' : 'view'}</button>
      </div>

      <div className="details" style={{ display: !view && 'none' }}>
        <div>{blog.url}</div>
        <div>
          likes {likes} <button onClick={handleLikeClick}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <button onClick={handleRemoveClick}>remove</button>
      </div>
    </div>
  )
}

export default Blog

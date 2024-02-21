import { useState } from 'react'
import blogService from '../services/blogs'
import CommentForm from './CommentForm'

const Comments = ({ blog }) => {
  const [comments, setComments] = useState(blog.comments || [])

  const addComment = async (comment) => {
    await blogService.addComment(blog.id, comment)
    setComments([...comments, comment])
  }

  return (
    <>
      <h3>comments</h3>
      <CommentForm addComment={addComment} />
      <ul>
        {comments.map((comment, i) => (
          <li key={i}>{comment}</li>
        ))}
      </ul>
    </>
  )
}

export default Comments

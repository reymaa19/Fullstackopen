import { Button, TextField } from '@mui/material'
import { useState } from 'react'

const CommentForm = ({ addComment }) => {
  const [comment, setComment] = useState('')

  const handleCommentChange = (e) => setComment(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addComment(comment)
    setComment('')
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          size="small"
          name="comment"
          value={comment}
          onChange={handleCommentChange}
        ></TextField>
        <Button variant="contained" size="small" sx={{ m: 0.5 }} type="submit">
          add comment
        </Button>
      </form>
    </>
  )
}

export default CommentForm

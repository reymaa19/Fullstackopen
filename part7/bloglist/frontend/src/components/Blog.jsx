import { Box, Button } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Navigate, useMatch, useNavigate } from 'react-router-dom'
import { useUserValue } from '../reducers/UserContext'
import blogService from '../services/blogs'
import Comments from './Comments'

const Blog = () => {
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const user = useUserValue()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (!user) return <Navigate to="/" />
  if (result.isLoading) return <div>loading blog...</div>
  const blogs = result.data

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  const [likes, setLikes] = useState(blog.likes)

  const removeBlogMutation = useMutation({
    mutationFn: async (blog) => {
      await blogService.removeBlog(blog.id)
      handleNotificationChange(`the blog ${blog.title} has been removed`)
    },
    onSuccess: () => queryClient.invalidateQueries('blogs'),
    onError: (error) =>
      handleNotificationChange(error.response.data.error, true),
  })

  const likeBlogMutation = useMutation({
    mutationFn: async (id) => await blogService.likeBlog(id),
    onError: (error) =>
      handleNotificationChange(error.response.data.error, true),
  })

  return (
    <Box sx={{ fontSize: '1.5em' }}>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {likes}{' '}
        <Button
          variant="contained"
          size="small"
          color="success"
          onClick={() => {
            likeBlogMutation.mutateAsync(blog.id)
            setLikes(likes + 1)
          }}
        >
          like
        </Button>
      </div>
      <div>added by {blog.user.name}</div>
      {blog.user.username === user.username && (
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={() => {
            if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
              removeBlogMutation.mutate(blog)
              navigate(0)
            }
          }}
        >
          remove
        </Button>
      )}
      <Comments blog={blog} />
    </Box>
  )
}

export default Blog

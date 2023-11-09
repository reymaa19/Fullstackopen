const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  let blogToUpdate = await Blog.findById(request.params.id)

  blogToUpdate.likes = blogToUpdate.likes + 1

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blogToUpdate,
    {
      new: true,
    }
  )

  response.json(updatedBlog)
})

module.exports = blogsRouter

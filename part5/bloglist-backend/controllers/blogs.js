const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

const isValidToken = (request) => {
  if (!request.user)
    return response.status(401).json({ error: 'invalid token' })
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  isValidToken(request)
  const blog = new Blog(request.body)
  blog.user = request.user

  const savedBlog = await blog.save()

  const user = await User.findById(request.user)
  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  isValidToken(request)
  const blog = await Blog.findById(request.params.id)

  if (request.user.toString() === blog.user.toString()) {
    await Blog.deleteOne(blog)

    response.status(204).end()
  }

  response.status(401).end()
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  isValidToken(request)
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

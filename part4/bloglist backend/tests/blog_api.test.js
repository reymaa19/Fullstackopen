const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb } = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('all blogs have unique properties named id', async () => {
  const blogs = await blogsInDb()

  for (let i = 0; i < blogs.length; i++) {
    expect(blogs[i].id).toBeDefined()
  }
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Google',
    author: 'Ted',
    url: 'https://www.google.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await blogsInDb()
  expect(blogsAfter).toHaveLength(initialBlogs.length + 1)

  const contents = blogsAfter.map((b) => b.url)
  expect(contents).toContain('https://www.google.com')
})

test('all blog have the likes property', async () => {
  const blogs = await blogsInDb()

  for (let i = 0; i < blogs.length; i++) {
    expect(blogs[i].likes).toBeDefined()
  }
})

test('a valid blog can be added with no likes property', async () => {
  const newBlog = {
    title: 'YouTube',
    author: 'Amy',
    url: 'https://www.youtube.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blog = await blogsInDb()

  expect(blog[blog.length - 1].likes).toBe(0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'not be added',
    url: 'https://www.notbeadded.com',
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAfter = await blogsInDb()

  expect(blogsAfter).toHaveLength(initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'not be added',
    author: 'this wont work',
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAfter = await blogsInDb()

  expect(blogsAfter).toHaveLength(initialBlogs.length)
})

test('deleting a blog succeeds with status code 204', async () => {
  const blogsBefore = await blogsInDb()
  const blogToDelete = blogsBefore[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAfter = await blogsInDb()

  expect(blogsAfter).toHaveLength(initialBlogs.length - 1)

  expect(blogsAfter.map((b) => b)).not.toContain(blogToDelete)
})

test('updating an individual blog increases likes', async () => {
  const blogs = await blogsInDb()
  const blogToUpdate = blogs[0]

  const response = await api.put(`/api/blogs/${blogToUpdate.id}`)

  expect(response.body.likes).toBe(blogToUpdate.likes + 1)
})

afterAll(async () => await mongoose.connection.close())

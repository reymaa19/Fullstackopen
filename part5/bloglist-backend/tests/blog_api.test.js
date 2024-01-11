const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDb, usersInDb } = require('./test_helper')

let token = null

describe('user tests', () => {
  beforeEach(async () => {
    await User.deleteMany()

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  const newUser = {
    username: 'reymaa19',
    name: 'Reynald',
    password: '123321',
  }

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('a user with an invalid username is not created', async () => {
    const shortUsername = { username: 'in', password: 'invalid' }
    const noUsername = { password: 'invalid' }

    const shortUsernameRequest = await api
      .post('/api/users')
      .send(shortUsername)
      .expect(400)

    const noUsernameRequest = await api
      .post('/api/users')
      .send(noUsername)
      .expect(400)

    expect(noUsernameRequest.body.error).toContain('`username` is required')
    expect(shortUsernameRequest.body.error).toContain(
      'is shorter than the minimum allowed length'
    )
  })

  test('a user with an existing username is not created', async () => {
    await api.post('/api/users').send(newUser)

    const invalidRequest = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(invalidRequest.body.error).toContain(
      'expected `username` to be unique'
    )
  })

  test('a user with an invalid password is not created', async () => {
    const shortPassword = { username: 'invalid', password: 'in' }
    const noPassword = { username: 'invalid' }

    const shortPasswordRequest = await api
      .post('/api/users')
      .send(shortPassword)
      .expect(401)

    const noPasswordRequest = await api
      .post('/api/users')
      .send(noPassword)
      .expect(401)

    expect(shortPasswordRequest.body.error).toContain('at least 3 characters')
    expect(noPasswordRequest.body.error).toContain('password is required')
  })
})

describe('blog tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const root = await User.findOne({ username: 'root' })

    const blogObjects = initialBlogs.map((blog) => {
      const newBlog = new Blog(blog)
      newBlog.user = root._id.toString()
      return newBlog
    })

    const promiseArray = blogObjects.map((blog) => blog.save())

    await Promise.all(promiseArray)
    const credentials = {
      username: 'root',
      password: 'secret',
    }

    token = (
      await api
        .post('/api/login')
        .send(credentials)
        .expect('Content-Type', /application\/json/)
    ).body.token
  })
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
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

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter).toHaveLength(initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'not be added',
      author: 'this wont work',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter).toHaveLength(initialBlogs.length)
  })

  test('deleting a blog succeeds with status code 204', async () => {
    const blogsBefore = await blogsInDb()
    const blogToDelete = blogsBefore[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter).toHaveLength(initialBlogs.length - 1)

    expect(blogsAfter.map((b) => b)).not.toContain(blogToDelete)
  })

  test('updating an individual blog increases likes', async () => {
    const blogs = await blogsInDb()
    const blogToUpdate = blogs[0]

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.body.likes).toBe(blogToUpdate.likes + 1)
  })

  test('adding a blog without a token fails with status code 401', async () => {
    const newBlog = {
      title: 'YouTube',
      author: 'Amy',
      url: 'https://www.youtube.com',
    }

    await api.post('/api/blogs').send(newBlog).expect(401)
  })
})

afterAll(async () => await mongoose.connection.close())

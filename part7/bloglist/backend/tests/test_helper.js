const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'My GitHub',
    author: 'Me',
    url: 'https://github.com/reymaa19',
  },
  {
    title: 'FullStackOpen',
    author: 'Not me',
    url: 'https://fullstackopen.com/',
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
}

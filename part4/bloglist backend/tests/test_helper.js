const Blog = require('../models/blog')

const initialBlogs = [
  { title: 'My GitHub', author: 'Me', url: 'https://github.com/reymaa19' },
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

module.exports = {
  initialBlogs,
  blogsInDb,
}

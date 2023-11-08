const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce(
    (favorite, blog) => (favorite.likes > blog.likes ? favorite : blog),
    {}
  )
}

const mostBlogs = (blogs) => {
  const authorCounts = _.countBy(blogs, 'author')

  const authorWithMostBlogs = _.maxBy(
    _.toPairs(authorCounts),
    ([author, count]) => count
  ) || ['', 0]

  return {
    author: authorWithMostBlogs[0],
    blogs: authorWithMostBlogs[1],
  }
}

const mostLikes = (blogs) => {
  const likesByAuthor = _.groupBy(blogs, 'author')

  const authorWithMostLikes = _.maxBy(
    _.toPairs(likesByAuthor),
    ([author, blogs]) => totalLikes(blogs)
  ) || ['', []]

  return {
    author: authorWithMostLikes[0],
    likes: totalLikes(authorWithMostLikes[1]),
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}

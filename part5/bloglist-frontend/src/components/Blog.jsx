const Blog = ({ blog }) => (
  <div>
    <a href={blog.url} target="_blank">
      {blog.title}
    </a>{' '}
    {blog.author}
  </div>
)

export default Blog

import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => (token = `Bearer ${newToken}`)

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const addBlog = async (newBlog) => {
  const config = { headers: { Authorization: token } }
  const request = await axios.post(baseUrl, newBlog, config)
  return request.data
}

const likeBlog = async (likedBlogId) => {
  const config = { headers: { Authorization: token } }
  const request = await axios.put(`${baseUrl}/${likedBlogId}`, {}, config)
  return request.data
}

const removeBlog = async (removedBlogId) => {
  const config = { headers: { Authorization: token } }
  const request = await axios.delete(`${baseUrl}/${removedBlogId}`, config)
  return request.data
}
export default { getAll, addBlog, setToken, likeBlog, removeBlog }

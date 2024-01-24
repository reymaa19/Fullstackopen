import axios from 'axios'

const BASE_URL = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => axios.get(BASE_URL).then((res) => res.data)

export const createAnecdote = (newAnecdote) =>
  axios.post(BASE_URL, newAnecdote).then((res) => res.data)

export const updateAnecdote = (updatedAnecdote) =>
  axios
    .put(`${BASE_URL}/${updatedAnecdote.id}`, updatedAnecdote)
    .then((res) => res.data)

import { createSlice } from '@reduxjs/toolkit'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    increaseVote(state, action) {
      const id = action.payload
      const anecdoteToIncrement = state.find((a) => a.id == id)
      const changedAnecdote = {
        ...anecdoteToIncrement,
        votes: anecdoteToIncrement.votes + 1,
      }
      return state.map((a) => (a.id != id ? a : changedAnecdote))
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export const { createAnecdote, increaseVote, setAnecdotes } =
  anecdoteSlice.actions
export default anecdoteSlice.reducer

import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import {
  removeNotification,
  setNotification,
} from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (e) => {
    e.preventDefault()
    const content = e.target.content.value
    const newAnecdote = await anecdoteService.createNew(content)
    e.target.content.value = ''
    dispatch(createAnecdote(newAnecdote))
    dispatch(setNotification(`you created '${content}'`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="content" />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

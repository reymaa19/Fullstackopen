import { useDispatch, useSelector } from 'react-redux'
import { increaseVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) =>
    anecdotes
      .filter((anecdote) => anecdote.content.includes(filter))
      .sort((a, b) => {
        if (a.votes > b.votes) return -1
        else if (a.votes < b.votes) return 1
        else return 0
      })
  )

  const vote = (anecdote) => {
    dispatch(increaseVote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList

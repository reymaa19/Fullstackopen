import { useState } from 'react'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    await login(username, password)

    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username:{' '}
        <input
          name="Username"
          value={username}
          type="text"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password:{' '}
        <input
          name="Password"
          value={password}
          type="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm

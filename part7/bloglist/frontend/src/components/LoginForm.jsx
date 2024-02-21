import { Button, TextField } from '@mui/material'
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
        <TextField
          sx={{ mb: 1 }}
          label="Username"
          size="small"
          variant="outlined"
          name="Username"
          value={username}
          type="text"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField
          label="Password"
          size="small"
          variant="outlined"
          name="Password"
          value={password}
          type="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button type="submit" size="small" variant="contained" sx={{ mt: 1 }}>
        login
      </Button>
    </form>
  )
}

export default LoginForm

import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { setUser, useUserDispatch } from '../reducers/UserContext'
import blogService from '../services/blogs'
import loginService from '../services/login'
import LoginForm from './LoginForm'

const Login = () => {
  const userDispatch = useUserDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(userDispatch, user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }) =>
      await loginService.login({ username, password }),
    onSuccess: (user) => {
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(userDispatch, user)
      handleNotificationChange(`Successfully logged in as ${user.name}`)
    },
    onError: (error) =>
      handleNotificationChange(error.response.data.error, true),
  })

  return (
    <>
      <LoginForm
        login={(username, password) =>
          loginMutation.mutate({ username, password })
        }
      />
    </>
  )
}

export default Login

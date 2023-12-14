import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import React from 'react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('BlogForm creates new blog with right details', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const title = screen.getByPlaceholderText('title')
    const author = screen.getByPlaceholderText('author')
    const url = screen.getByPlaceholderText('url')
    const create = screen.getByText('create')

    const newBlog = {
      title: 'testing title',
      author: 'testing author',
      url: 'testing url',
    }

    await user.type(title, newBlog.title)
    await user.type(author, newBlog.author)
    await user.type(url, newBlog.url)

    await user.click(create)

    expect(createBlog.mock.calls[0][0]).toEqual(newBlog)
  })
})

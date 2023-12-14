import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import React from 'react'
import Blog from './Blog'

describe('<Blog />', () => {
  const blogObject = {
    url: 'https://test.com',
    title: 'testTitle',
    author: 'testAuthor',
    likes: 9,
    user: {
      username: 'reymaa19',
      name: 'Reynald',
      id: '6552b76f40908f81b8ab87ad',
    },
    id: '6553dc1448f29d3d4b204b46',
  }

  test('renders title and author', () => {
    render(<Blog blog={blogObject} removeBlog={() => {}} likeBlog={() => {}} />)
    const element = screen.getByText('testTitle testAuthor')
    expect(element).toBeVisible()
  })

  test('does not render URL by default', () => {
    render(<Blog blog={blogObject} removeBlog={() => {}} likeBlog={() => {}} />)
    const element = screen.queryByText('https://test.com')
    expect(element).not.toBeVisible()
  })

  test('does not render number of likes by default', () => {
    render(<Blog blog={blogObject} removeBlog={() => {}} likeBlog={() => {}} />)
    const element = screen.queryByText('like')
    expect(element).not.toBeVisible()
  })

  test('renders URL on button click', async () => {
    render(<Blog blog={blogObject} removeBlog={() => {}} likeBlog={() => {}} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const element = screen.queryByText('https://test.com')
    expect(element).toBeVisible()
  })

  test('renders number of likes on button click', async () => {
    render(<Blog blog={blogObject} removeBlog={() => {}} likeBlog={() => {}} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const element = screen.queryByText('likes 9')
    expect(element).toBeVisible()
  })

  test('like button clicked twice', async () => {
    const likeBlog = jest.fn()
    render(<Blog blog={blogObject} removeBlog={() => {}} likeBlog={likeBlog} />)

    const user = userEvent.setup()
    const view = screen.getByText('view')
    await user.click(view)

    const like = screen.getByText('like')
    await user.click(like)
    await user.click(like)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })
})

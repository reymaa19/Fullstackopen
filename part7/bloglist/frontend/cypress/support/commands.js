Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem('loggedBloglistUser', JSON.stringify(body))
    cy.visit('')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes = 0 }) => {
  cy.request({
    url: `${Cypress.env('BACKEND')}/blogs`,
    method: 'POST',
    body: { title, author, url, likes },
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem('loggedBloglistUser')).token
      }`,
    },
  })
  cy.visit('')
})

Cypress.Commands.add('createUser', ({ name, username, password }) => {
  const user = { name, username, password }
  cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
  cy.visit('')
})

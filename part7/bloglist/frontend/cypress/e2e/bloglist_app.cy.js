describe('Bloglist app', () => {
  beforeEach(() => {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.createUser({
      name: 'root',
      username: 'root',
      password: '123321',
    })
  })

  it('Login form is shown', () => {
    cy.contains('log in to application')
  })

  describe('Login', () => {
    it('Succeeds with correct credentials', () => {
      cy.get('input').eq(0).type('root')
      cy.get('input').eq(1).type('123321')
      cy.get('button').click()

      cy.get('html').should('contain', 'Successfully logged in as root')
    })

    it('Fails with wrong credentials', () => {
      cy.get('input').eq(0).type('root')
      cy.get('input').eq(1).type('wrong credentials')
      cy.get('button').click()

      cy.get('html').should('not.contain', 'invalid username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'root', password: '123321' })
    })

    it('A blog can be created', () => {
      cy.contains('new blog').click()
      cy.get('input[placeholder *= "title"]').type('new title')
      cy.get('input[placeholder *= "author"]').type('by cypress')
      cy.get('input[placeholder *= "url"]').type('https://www.google.com')
      cy.contains('create').click()

      cy.contains('new title by cypress')
    })

    it('A blog can be liked', () => {
      cy.createBlog({
        title: 'cypress title',
        author: 'cypress author',
        url: 'cypress url',
      })

      cy.contains('view').click()
      cy.get('.blog').should('contain', 'likes 0')
      cy.contains('like').click()
      cy.get('.blog').should('contain', 'likes 1')
    })

    describe('A blog being deleted', () => {
      beforeEach(() => {
        cy.createBlog({
          title: 'title',
          author: 'by root',
          url: 'https://www.google.com',
        })

        cy.createUser({
          name: 'TestUser',
          username: 'TestUser',
          password: '321123',
        })
      })

      it('A blog can be deleted by the creator', () => {
        cy.contains('view').click()
        cy.get('.blog').should('contain', 'remove')
        cy.contains('remove').click()
      })

      it('A blogs delete button is only visible to the creator', () => {
        cy.contains('view').click()
        cy.get('.blog').should('contain', 'remove')

        cy.contains('logout').click()
        cy.login({ username: 'TestUser', password: '321123' })

        cy.contains('view').click()
        cy.get('.blog').should('not.contain', 'remove')
      })
    })

    it('Blogs are ordered according to likes', () => {
      cy.createBlog({
        title: 'middle likes',
        author: 'root',
        url: 'https://www.google.com',
        likes: 5,
      })
      cy.createBlog({
        title: 'least likes',
        author: 'root',
        url: 'https://www.google.com',
        likes: 1,
      })
      cy.createBlog({
        title: 'most likes',
        author: 'root',
        url: 'https://www.google.com',
        likes: 10,
      })

      cy.get('.blog').eq(0).should('contain', 'most likes')
      cy.get('.blog').eq(1).should('contain', 'middle likes')
      cy.get('.blog').eq(2).should('contain', 'least likes')
    })
  })
})

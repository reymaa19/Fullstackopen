const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v4: uuid } = require('uuid')

// Notes:
// Change typeDefs -> type Query when adding a parameter for a resolver function.

let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
]

const typeDefs = `
  type Book {
    title: String!
    published: Int
    author: String!
    id: ID!
    genres: [String]
  }
  type Author {
    name: String!
    bookCount: Int
    id: ID!
    born: Int
  }
  type Query {
    bookCount: Int!,
    authorCount: Int!,
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
      addBook(
          title: String!,
          author: String,
          published: Int,
          genres: [String]
        ) : Book
      addAuthor(
        name: String!,
        born: Int
      ) : Author
      editAuthor(
        name: String!, 
        setBornTo: Int!
      ) : Author
  }
`

const findAuthor = (author) => books.filter((b) => b.author == author)

const findGenre = (genre) => books.filter((b) => b.genres.includes(genre))

const _addAuthor = (_, args) => {
  const author = { ...args, id: uuid() }
  authors = authors.concat(author)
  return author
}

// Implement mutation editAuthor, which can be used to set a birth year for an author.
// The mutation is used like so:
// mutation {
//   editAuthor(name: "Reijo Mäki", setBornTo: 1958) {
//     name
//     born
//   }
// }

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if (args.author != null && args.genre != null)
        return findAuthor(args.author).concat(findGenre(args.genre))
      else if (args.author != null) return findAuthor(args.author)
      else if (args.genre != null) return findGenre(args.genre)
      else return books
    },
    allAuthors: () => authors,
  },
  Author: {
    bookCount: ({ name }) => books.filter((b) => b.author == name).length,
  },
  Mutation: {
    addAuthor: _addAuthor,
    addBook: (root, args) => {
      const book = { ...args, id: uuid() }
      if (!authors.includes((a) => a.name == args.author))
        _addAuthor(null, { name: args.author })
      books = books.concat(book)
      return book
    },
    editAuthor: (root, args) => {
      const author = authors.find((a) => a.name == args.name)
      if (!author) return null
      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a))
      return updatedAuthor
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

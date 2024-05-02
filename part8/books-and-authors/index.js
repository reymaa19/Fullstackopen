const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
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
    me: User
  }
  type Mutation {
      createUser(
        username: String!
        favoriteGenre: String!
      ) : User
      login(
        username:String! 
        password: String!
      ) : Token
      addBook(
          title: String!,
          author: String!
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

const _addAuthor = async (_, args) => {
  try {
    const author = new Author({ name: args.author })
    await author.save()
    return author
  } catch (error) {
    throw new GraphQLError('Saving author failed', {
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: args.author,
        error,
      },
    })
  }
}

const findAuthor = async (name) => {
  try {
    const books = await Book.find({}).populate('author')
    return books.filter((b) => b.author.name == name)
  } catch (error) {
    throw new GraphQLError('Finding author failed', {
      extensions: {
        code: 'NOT_FOUND',
        invalidArgs: name,
        error,
      },
    })
  }
}

const findGenre = async (genre) => {
  try {
    const books = await Book.find({ genres: genre }).populate('author')
    return books
  } catch (error) {
    throw new GraphQLError('Finding genre failed', {
      extensions: {
        code: 'NOT_FOUND',
        invalidArgs: genre,
        error,
      },
    })
  }
}

// ********************
// LEFT OFF ON 8.18
// ********************
const resolvers = {
  Query: {
    me: (root, args, context) => context.currentUser,
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
    allBooks: async (root, args) => {
      if (args.author != null && args.genre != null) {
        const foundAuthor = await findAuthor(args.author)
        const foundGenre = await findGenre(args.genre)
        return foundAuthor.concat(foundGenre) // This returns duplicates
      } else if (args.author != null) return findAuthor(args.author)
      else if (args.genre != null) return findGenre(args.genre)
      else return Book.find({}).populate('author')
    },
  },
  Author: {
    bookCount: async ({ name }) => {
      const authorsBooks = await findAuthor(name)
      return authorsBooks.length
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User(args)

      return user.save().catch((error) => {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      // *******************
      // HARD CODED PASSWORD
      // *******************
      if (!user || args.password !== '123321') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addAuthor: _addAuthor,
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      try {
        const authorFound = await Author.findOne({ name: args.author })
        const author = authorFound ? authorFound : await _addAuthor(null, args)
        const book = new Book({ ...args, author })
        await book.save()

        return book
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.book,
            error,
          },
        })
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      try {
        const updatedAuthor = await Author.findOneAndUpdate(
          { name: args.name },
          { $set: { born: args.setBornTo } },
          { new: true }
        )
        return updatedAuthor
      } catch (error) {
        throw new GraphQLError('Updating author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

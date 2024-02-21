import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import App from './App'
import Blog from './components/Blog'
import Navigation from './components/Navigation'
import ViewUsers from './components/ViewUsers'
import { NotificationContextProvider } from './reducers/NotificationContext'
import { UserContextProvider } from './reducers/UserContext'

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <UserContextProvider>
      <NotificationContextProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/*" element={<App />} />
            <Route path="/users" element={<ViewUsers />} />
            <Route path="/users/:id" element={<ViewUsers />} />
            <Route path="/blogs/:id" element={<Blog />} />
          </Routes>
        </Router>
      </NotificationContextProvider>
    </UserContextProvider>
  </QueryClientProvider>
)

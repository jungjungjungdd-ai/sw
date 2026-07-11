import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import PlacesPage from './pages/PlacesPage'
import TripPage from './pages/TripPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: '/chat',
    element: (
      <Layout>
        <ChatPage />
      </Layout>
    ),
  },
  {
    path: '/places',
    element: (
      <Layout>
        <PlacesPage />
      </Layout>
    ),
  },
  {
    path: '/trip',
    element: (
      <Layout>
        <TripPage />
      </Layout>
    ),
  },
])

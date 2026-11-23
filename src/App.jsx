import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createBrowserRouter,
  RouterProvider,
  useParams,
} from 'react-router-dom'
import '@fontsource/roboto-slab/400.css'
import '@fontsource/roboto-slab/700.css'
import './index.css'
import { Blog } from './pages/Blog.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
import { ViewPost } from './pages/ViewPost.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <Blog />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/posts/:postId/:slug?',
    Component() {
      const { postId } = useParams()
      return <ViewPost postId={postId} />
    },
  },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  )
}

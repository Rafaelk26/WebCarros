// Import from development
import { createBrowserRouter } from 'react-router-dom';
// Pages
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { New } from './pages/Dashboard/New'
import { CarDetail } from './pages/Car';  
// Layout default
import { Layout } from './layout';
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <Home />,
        path: '/',
      },
      {
        element: <CarDetail />,
        path: 'car/:id',
      },
      {
        element: <Dashboard />,
        path: '/dashboard',
      },
      {
        element: <New />,
        path: '/dashboard/new',
      },
    ]
  },
  {
    element: <Login />,
    path: '/login',
  },
  {
    element: <Register />,
    path: '/register',
  },
])

export { router };
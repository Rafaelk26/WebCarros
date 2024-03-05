import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './App'
// Style
import './index.css'
// Import from development
import { AuthProvider } from './context/authContext'
import { RouterProvider } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)

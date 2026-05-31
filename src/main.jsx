import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initDb } from './db/mockDb.js'
import { useRegisterSW } from 'virtual:pwa-register/react'

// Initialize the database structure before mounting components
initDb();

function Root() {
  useRegisterSW({ immediate: true })
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)

import React from 'react'
import ReactDOMClient from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

const root = ReactDOMClient.createRoot(document.getElementById('root'))

root.render(
    <Router>
        <App />
    </Router>
)

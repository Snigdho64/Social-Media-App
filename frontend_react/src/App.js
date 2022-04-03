import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Home from './container/Home'
import fetchUser from './utils/fetchUser'

function App() {
  const [user, setUser] = useState()
  const navigate = useNavigate()
  useEffect(() => {
    const user = fetchUser()
    if (!user) return navigate('/login', { replace: true })
    else setUser(user)
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  )
}

export default App

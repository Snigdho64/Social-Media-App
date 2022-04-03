import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import assets from '../assets'
import { client } from '../client'
import { userQuery } from '../utils/data'
import Pins from './Pins'
import UserProfile from '../components/UserProfile'
import fetchUser from '../utils/fetchUser'

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const user = fetchUser()
    if (!user) navigate('/login')
    client.fetch(userQuery(user?._id)).then((users) => {
      setUser(users[0])
    })
  }, [navigate])

  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0)
  }, [])

  return (
    <div
      className="bg-gray-100 sm:flex h-screen w-screen transition-height duration-300
    scrollbar-thin scrollbar-thumb-emerald-500 scrollbar-track-emerald-100
    "
    >
      <div className="hidden sm:flex h-screen flex-initial">
        <Sidebar user={user && user} setToggleSidebar={setToggleSidebar} />
      </div>
      <div className="flex w-full sm:hidden flex-row h-[4rem] bg-cyan-50">
        <div className="p-2 w-full flex justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            onClick={() => setToggleSidebar(true)}
            className="m-2 cursor-pointer"
          />
          <Link to="/" className="w-28 mt-4">
            <img src={assets.logo} alt="logo" />
          </Link>
          <Link to={`user-profile/${user?._id}`} className="m-1">
            <img
              src={user?.image}
              alt={user?.username}
              className="w-[4rem] rounded-full"
            />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-3/5 bg-white h-screen overflow-auto shadow-md z-10 animate-slide-in ">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar user={user && user} setToggleSidebar={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 overflow-auto" ref={scrollRef}>
        <Routes>
          <Route
            path={`/user-profile/:userId`}
            element={<UserProfile user={user} />}
          />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home

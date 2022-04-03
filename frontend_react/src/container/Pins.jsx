import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import CreatePin from '../components/CreatePin'
import Feed from '../components/Feed'
import Navbar from '../components/Navbar'
import PinDetails from '../components/PinDetails'
import Search from '../components/Search'

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <div className="px-2 md:px-5 w-full h-full">
      <div className="bg-gray-100">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>
      <div className="">
        <Routes>
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route
            path="/pin-detail/:pinId"
            element={<PinDetails user={user} />}
          />
          <Route path="/create-pin" element={<CreatePin user={user} />} />
          <Route
            path="/search"
            element={
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          />
          <Route path="/*" element={<Feed />} />
        </Routes>
      </div>
    </div>
  )
}

export default Pins

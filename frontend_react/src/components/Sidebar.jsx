import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import assets from '../assets'
import { RiHomeFill } from 'react-icons/ri'
import { IoIosArrowForward } from 'react-icons/io'
import { categories } from '../utils/data'

const Sidebar = ({ user, setToggleSidebar }) => {
  const closeSidebar = () => {
    setToggleSidebar(false)
  }

  const addNavClass = ({ isActive }) =>
    `flex m-1 px-4 gap-1 items-center hover:bg-amber-200 w-full cursor-pointer rounded-md font-semibold hover:text-red-500 ${
      isActive ? 'text-red-500 bg-slate-300' : 'text-slate-500'
    }`

  return (
    <div className="flex flex-col justify-between items-start bg-white h-screen overflow-y-auto">
      <div className="flex flex-col px-4">
        <Link to="/" className="flex px-5 gap-2 my-6 pt-1">
          <img src={assets.logo} alt="logo" className="w-[5rem]" />
        </Link>
        <div className="flex flex-col gap-5 w-full">
          <NavLink to="/" className={addNavClass} onClick={closeSidebar}>
            <RiHomeFill
              fontSize={30}
              className={'mr-4 hover:text-orange-500'}
            />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 pl-0 pt-2 text-base font-bold border-t-slate-500 border-solid border-t-2 flex items-center justify-between w-full">
            <IoIosArrowForward fill="#c76006" fontSize={30} />
            <p>Discover Categories</p>
          </h3>
          {categories.map((category) => (
            <NavLink
              to={`/category/${category.name.toLowerCase()}`}
              key={category.name}
              className={addNavClass}
              onClick={closeSidebar}
            >
              <img
                src={category.image}
                alt="category"
                className="w-8 h-8 rounded-full"
              />
              {category.name.toUpperCase()}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link
          to={`/user-profile/${user._id}`}
          className="flex mt-4 mb-2 justify-around rounded-lg shadow-md shadow-gray-500 w-full items-center mr-4 p-1 hover:bg-slate-300 hover:text-red-400"
        >
          <img
            src={user.image}
            alt="user-profile"
            className="w-10 rounded-full"
          />
          <p className="text-md md:text-xl">{user.username}</p>
        </Link>
      )}
    </div>
  )
}

export default Sidebar

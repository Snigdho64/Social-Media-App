import React from 'react'
import { IoMdAdd, IoMdSearch } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
    const navigate = useNavigate()

    if (!user) return null

    return (
        <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
            <div className="flex justify-start items-center rounded-md bg-white focus-within:shadow-md border-none outline-none w-full">
                <IoMdSearch fontSize={30} className="ml-1" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => navigate('/search')}
                    className="p-2 w-full bg-white outline-none text-gray-700 text-md"
                />
                <div className="flex gap-3">
                    <Link
                        to={`user-profile/${user._id}`}
                        className="hidden sm:grid w-14 h-14 hover:shadow-md rounded-full hover:bg-emerald-400"
                    >
                        <img
                            src={user.image}
                            alt=""
                            className="rounded-full p-1"
                        />
                    </Link>
                    <Link to={`create-pin`} className="">
                        <div className="p-1 w-14 h-full  rounded-full">
                            <IoMdAdd className="rounded-full w-full h-full p-1 hover:bg-emerald-500 bg-orange-500 text-white transition-all" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar

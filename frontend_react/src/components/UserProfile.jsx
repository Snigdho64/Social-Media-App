import React, { useEffect, useState } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useNavigate, useParams } from 'react-router-dom'
import { GoogleLogout } from 'react-google-login'
import Spinner from './Spinner'
import { client } from '../client'
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from '../utils/data'
import MasonryLayout from './MasonryLayout'

const coverImage =
  'https://source.unsplash.com/1600x900/?nature,photography,technology'

const UserProfile = ({ user }) => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState()
  const [pins, setPins] = useState()
  const [activeBtn, setActiveBtn] = useState(0)

  useEffect(() => {
    if (user?._id === userId) {
      setUserProfile(user)
    } else {
      client.fetch(userQuery(userId)).then((data) => {
        setUserProfile(data[0])
      })
    }
  }, [userId, user])

  const logOutUser = () => {
    localStorage.clear()
    navigate('/', { replace: true })
  }

  useEffect(() => {
    if (activeBtn === 0) {
      client.fetch(userCreatedPinsQuery(userProfile?._id)).then((data) => {
        setPins(data)
      })
    } else {
      client.fetch(userSavedPinsQuery(userProfile?._id)).then((data) => {
        setPins(data)
      })
    }
  }, [activeBtn, userProfile])

  return !user || !userProfile ? (
    <Spinner message="Loading user..." />
  ) : (
    <div className="flex flex-col w-hull min-h-[80vh] bg-rose-50 items-center justify-between">
      <div className="relative flex flex-col items-center">
        <img
          src={coverImage}
          alt="cover"
          className="object-center rounded-lg max-h-[60vh] w-[90vw] md:w-[70vw]"
        />
        <div className="flex absolute top-[60%] md:top-[70%] flex-col items-center p-4 rounded-md bg-[#b6efec56] hover:bg-[#ecefb656] hover:shadow-md transition-all duration-300">
          <img src={userProfile.image} alt="user" className="rounded-full " />
          <h1 className="text-orange-500 text-2xl font-bold">
            {userProfile.username}
          </h1>
        </div>
        <div className="flex items-center justify-center self-end">
          <GoogleLogout
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            render={(renderProps) => (
              <button
                className="text-gray-700 flex flex-col sm:flex-row items-center gap-2 text-lg bg-white p-1 px-2 rounded-lg hover:bg-red-500 hover:bg-opacity-100 hover:text-white m-4"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <AiOutlineLogout className="font-bold text-3xl " />
                Logout
              </button>
            )}
            onLogoutSuccess={logOutUser}
            cookiePolicy={'single_host_origin'}
          />
        </div>
      </div>
      <div className="flex flex-col items-center mt-[20%] sm:mt-[25%] md:mt-[20%] lg:mt-[10%]">
        <div className="flex flex-row justify-between w-[40%] items-center">
          {['Created', 'Saved'].map((item, idx) => (
            <button
              key={idx}
              className={`p-2 font-bold text-white rounded-md  ${
                activeBtn === idx ? 'bg-red-500  scale-105' : 'bg-gray-500'
              }`}
              onClick={setActiveBtn.bind(null, idx)}
            >
              {item}
            </button>
          ))}
        </div>
        {pins?.length && <MasonryLayout pins={pins} />}
      </div>
    </div>
  )
}

export default UserProfile

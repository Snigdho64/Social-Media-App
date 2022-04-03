import React, { useState } from 'react'
import { client, urlFor } from '../client'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import fetchUser from '../utils/fetchUser'
const Pin = ({
  pin: { postedBy, image, _id, destination, about, title, saves },
}) => {
  const [postHover, setPostHover] = useState(false)
  const [savingPost, setSavingPost] = useState(false)
  const navigate = useNavigate()

  const user = fetchUser()

  const alreadySaved = saves?.find((u) => u.postedBy._id === user._id)

  const savePin = (e) => {
    e.stopPropagation()
    if (!alreadySaved) {
      setSavingPost(true)
      client
        .patch(_id)
        .setIfMissing({ saves: [] })
        .insert('after', 'saves[-1]', [
          {
            _key: uuidv4(),
            userId: user._id,
            postedBy: {
              _type: 'postedBy',
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          setSavingPost(false)
          window.location.reload()
        })
    }
  }

  const deletePin = (e) => {
    e.stopPropagation()
    client.delete(_id).then((data) => {
      window.location.reload()
    })
  }

  return (
    <div className="m-2 shadow-md rounded-lg rounded-b-none">
      <div
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow:hidden transition-all duration-500 ease-in-out"
        onMouseEnter={() => setPostHover(true)}
        onMouseLeave={() => setPostHover(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
      >
        <img src={urlFor(image)} alt={title} className="rounded-md" />
        {postHover && (
          <div className="absolute top-0 w-full h-full flex flex-col p-1 pr-2 pb-2 justify-between">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="bg-white w-9 h-9 rounded-full grid place-items-center transition-all opacity-75 hover:opacity-100 hover:shadow-md"
                >
                  <MdDownloadForOffline
                    fontSize={30}
                    className="text-gray-500 hover:text-emerald-500"
                  />
                </a>
              </div>

              {alreadySaved ? (
                <button className="bg-red-500 px-5 py-1 opacity-75 hover:opacity-100 hover:shadow-md text-white font-bold rounded-md">
                  {saves?.length || 0} Saved
                </button>
              ) : (
                <button
                  className="bg-red-500 px-5 py-1 opacity-75 hover:opacity-100 hover:shadow-md text-white font-bold rounded-md"
                  onClick={savePin}
                >
                  {saves?.length || 0} {savingPost ? 'Saving' : 'Save'}
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-gray-700 p-1 rounded-full px-2 opacity-75 hover:opacity-100 hover:shadow-md hover:text-orange-500 w-[75%]"
                >
                  <BsFillArrowUpRightCircleFill className="h-6" />
                  <p className="h-5 w-[90%] text-sm overflow-hidden">
                    {destination}
                  </p>
                </a>
              )}
              <button
                className="bg-white flex justify-center items-center text-gray-700 p-1 rounded-full opacity-75 hover:opacity-100 hover:shadow-md hover:text-orange-500 w-[2rem] h-[2rem]"
                onClick={deletePin}
              >
                <AiTwotoneDelete fontSize={30} className="hover:text-red-500" />
              </button>
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${postedBy._id}`}
        className="w-full flex justify-between items-center px-2"
      >
        <img
          src={postedBy?.image}
          alt="user"
          className="h-[3rem] p-1 rounded-full hover:scale-110 hover:shadow-red-600 transition-all duration-200"
        />
        <p className="font-bold text-gray-700 capitalize hover:text-sky-500 duration-200 transition-all hover:underline">
          {postedBy?.username}
        </p>
      </Link>
    </div>
  )
}

export default Pin

import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MdDownloadForOffline, MdSend } from 'react-icons/md'
import { v4 as uuidv4 } from 'uuid'
import { client, urlFor } from '../client'
import { pinDetailMorePinsQuery, pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'
import MasonryLayout from './MasonryLayout'

const PinDetails = ({ user }) => {
  const { pinId } = useParams()
  const [pinDetail, setPinDetail] = useState()
  const [pins, setPins] = useState()
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState()
  const [error, setError] = useState()

  const fetchPinDetails = (pinId) => {
    client
      .fetch(pinDetailQuery(pinId))
      .then((data) => {
        setPinDetail(data[0])
        client
          .fetch(pinDetailMorePinsQuery(data[0]))
          .then((data) => setPins(data))
      })
      .catch((e) => console.error(e))
  }

  useEffect(() => {
    setLoading(true)
    fetchPinDetails(pinId)
    setLoading(false)
  }, [pinId])

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(false), 3000)
    }
    if (error) {
      setTimeout(() => setError(false), 3000)
    }
  }, [success, error])

  const addComment = () => {
    if (!comment.trim()) return
    setAddingComment(true)
    client
      .patch(pinId)
      .setIfMissing({ comments: [] })
      .insert('after', 'comments[-1]', [
        {
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id,
          },
        },
      ])
      .commit()
      .then((data) => {
        console.log(data)
        setAddingComment(false)
        setSuccess(true)
        setComment('')
      })
      .catch((e) => {
        console.log(e)
        setError(true)
      })
  }

  return loading || !pinDetail ? (
    <Spinner message={'Loading Details...'} />
  ) : (
    pinDetail && (
      <>
        <div className=" bg-rose-50 min-h-[85vh] flex xl:flex-row p-5 md:px-0 flex-col rounded-lg">
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              className="p-2"
              src={pinDetail?.image && urlFor(pinDetail?.image)}
              alt="user-post"
            />
          </div>
          <div className="w-full py-2 px-1 flex-1">
            <div className="flex flex-col p-4 md:p-2 lg:min-w-350 items-center justify-between">
              <div className="flex gap-2 items-center justify-between w-full p-2">
                <a
                  href={`${pinDetail.image.asset.url}?dl=`}
                  download
                  className="bg-secondaryColor p-2 text-xl rounded-full grid place-items center opacity-75 hover:opacity-100 hover:shadow-md"
                >
                  <MdDownloadForOffline className="text-3xl text-emerald-500" />
                </a>
                <a
                  href={pinDetail.destination}
                  className="p-2 text-xl font-bold text-slate-500 rounded-lg mr-2 hover:text-orange-500 break-words max-w-sm"
                >
                  {pinDetail.destination.length > 25
                    ? pinDetail.destination.slice(0, 25) + '...'
                    : pinDetail.destination}
                </a>
              </div>
              <div className="w-full text-center p-4 shadow-md rounded-lg bg-gray-100">
                <h1 className="text-2xl sm:text:2xl font-bold text-orange-500 capitalize">
                  {pinDetail.title}
                </h1>
                <p className="mt-3 text-xl capitalize font-bold text-gray-500 text-left">
                  {pinDetail.about}
                </p>
              </div>
              <Link
                to={`/user-profile/${pinDetail?.postedBy._id}`}
                className="flex gap-2 mt-5 items-center rounded-lg self-end bg-emerald-400 px-2 w-full py-1 hover:scale-105 hover:shadow-md text-white hover:text-pink-400 hover:bg-emerald-200
            transition-all duration-200 ease-in-out"
              >
                <img
                  src={pinDetail?.postedBy.image}
                  className="w-10 h-10 rounded-full"
                  alt="user-profile"
                />
                <p className="font-bold  ">{pinDetail?.postedBy.username}</p>
              </Link>
            </div>
            <div className="flex flex-col">
              {error && (
                <h3 className="my-3 text-2xl p-2 px-4 text-red-500 transition-all duration-300 ease-in">
                  'Adding Comment Failed!'
                </h3>
              )}
              {success && (
                <h3 className="my-3 text-2xl p-2 px-4 text-emerald-500 transition-all duration-300 ease-in">
                  Comment added Successfully!
                </h3>
              )}
              <h2 className="my-3 text-2xl p-2 px-4 text-orange-500">
                Comments
              </h2>
              <div className="flex flex-col justify-around">
                <div className="flex items-center p-2 rounded-lg bg-white">
                  <Link to={`/user-profile/${user._id}`}>
                    <img
                      src={user.image}
                      className="w-10 h-10 rounded-full cursor-pointer"
                      alt="user-profile"
                    />
                  </Link>
                  <input
                    className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    type="button"
                    className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none hover:bg-emerald-500"
                    disabled={addingComment}
                    onClick={addComment}
                  >
                    <MdSend />
                  </button>
                </div>
                <div className="overflow-y-auto h-[40vh] flex flex-col">
                  {pinDetail.comments &&
                    pinDetail.comments.map((comment) => (
                      <div
                        key={comment._key}
                        className="flex justify-around items-center p-2 border-2 border-solid rounded-lg mb-2"
                      >
                        <Link
                          to={`/user-profile/${comment.postedBy._id}`}
                          className="flex flex-col items-center hover:scale-105 hover:text-orange-500"
                        >
                          <img
                            src={comment.postedBy?.image}
                            className="w-10 h-10 rounded-full cursor-pointer"
                            alt="user-profile"
                          />
                          <p>
                            {comment.postedBy.username.split(/[' ',-,_]/)[0]}
                          </p>
                        </Link>
                        <p className="text-gray-500 font-bold text-l w-[75%] break-words">
                          {comment.comment}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {pins && (
          <div className="flex flex-col w-full">
            <h2 className="text-center font-bold text-2xl mt-8 mb-4 p-2 rounded-md shadow-md text-amber-700">
              View Similar Pins
            </h2>
            <MasonryLayout pins={pins} />
          </div>
        )}
      </>
    )
  )
}

export default PinDetails

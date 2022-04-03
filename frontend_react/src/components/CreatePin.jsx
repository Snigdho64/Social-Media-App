import React, { useEffect, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdDelete, MdUpload } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { client } from '../client'
import { categories } from '../utils/data'
import Spinner from './Spinner'

const CreatePin = ({ user }) => {
  const [inputFields, setInputFields] = useState({
    title: '',
    about: '',
    destination: '',
    category: '',
    image: null,
  })
  const { title, about, destination, category, image } = inputFields
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    if (error) {
      setTimeout(() => setError(null), 3000)
    }
  }, [error])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (image === null) return setError({ message: 'No Image to Upload' })
    if (
      title.trim() === '' ||
      about.trim() === '' ||
      category.trim() === '' ||
      destination.trim() === ''
    )
      return setError({ message: 'All Fields Are Required' })

    setLoading(true)
    try {
      const imageAsset = await client.assets.upload('image', image)
      await client.create({
        _type: 'pin',
        title,
        about,
        destination,
        category,
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
        },
      })
      setInputFields({
        title: '',
        about: '',
        destination: '',
        category: '',
        image: null,
      })
      navigate('/')
    } catch (e) {
      console.log(e)
      setError(e.message)
    }
    setLoading(false)
  }

  const handleInputChange = (e) => {
    if (e.target.type === 'file') {
      const image = e.target.files[0]
      if (image.type.startsWith('image')) {
        const reader = new FileReader()
        reader.readAsDataURL(image)
        reader.onloadend = () => setImagePreview(reader.result)
        setInputFields((p) => ({ ...p, [e.target.name]: e.target.files[0] }))
      } else {
        setError({ message: 'Please Seleact A Valid Image' })
      }
    } else {
      setInputFields((p) => ({ ...p, [e.target.name]: e.target.value }))
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center mt-1 min-h-[80vh]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center mt-1 min-h-[80vh]">
      {error && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in bg-white shadow-md p-2 rounded-lg">
          {error.message}
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5p-3 w-full h-full">
        <div className="bg-SecondaryColor p-3 flex flex-0 7 w-full max-h-[100%] items-center justify-center">
          <div className="flex justify-center items-center border-gray-300 border-2 flex-col p-3 rounded-lg min-w-[60%]">
            {!image && (
              <label className="flex flex-col items-center justify-center text-slate-500 hover:text-emerald-500 hover:scale-110 transition-all duration-150 ease-in">
                <AiOutlineCloudUpload fontSize={30} />
                <p className=" cursor-pointer">Cilck To Upload an Image</p>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  className="hidden"
                  onChange={handleInputChange}
                />
              </label>
            )}
            {image && imagePreview && (
              <>
                <div className="w-full relative h-full flex justify-center items-center touch-pinch-zoom cursor-zoom-in">
                  <img
                    src={imagePreview}
                    alt='upload'
                    className="w-[100%]"
                  />
                  <div className="w-full opacity-50 hover:opacity-100 flex justify-between items-center absolute bottom-0 right-0 px-2 pb-1 z-10 ">
                    <label>
                      <MdUpload className="cursor-pointer hover:scale-110 hover:shadow-md hover:bg-slate-100 rounded-full hover:text-emerald-500 text-4xl md:text-6xl p-1" />
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        className="hidden"
                        onChange={handleInputChange}
                      />
                    </label>
                    <MdDelete
                      onClick={() => {
                        setImagePreview(null)
                        setInputFields((p) => ({ ...p, image: null }))
                      }}
                      className="cursor-pointer hover:scale-110 hover:shadow-md hover:bg-slate-100 rounded-full hover:text-rose-500 text-4xl md:text-6xl p-1"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between items-start shadow-lg w-[95%] p-4 mt-2 rounded-lg min-h-[50vh]"
        >
          <div className="text-xl text-gray-700 font-bold flex justify-between w-full gap-x-4 my-2 focus-within:shadow-md">
            <label className="min-w-[120px] italic p-1">Title</label>
            <input
              type="text"
              className="flex-1 border-0 border-b-2 border-b-teal-500 border-solid p-1 px-2 focus:border-b-0 focus:rounded-md focus:text-orange-500 focus:font-bold transition-all duration-150 ease-in"
              onChange={handleInputChange}
              name="title"
              value={title}
            />
          </div>
          <div className="text-xl text-gray-700 font-bold flex justify-between w-full gap-x-4 my-2 focus-within:shadow-md">
            <label className="min-w-[120px] italic p-1">About</label>
            <textarea
              type="text"
              className="flex-1 border-0 border-b-2 border-b-teal-500 border-solid p-1 px-2 focus:border-b-0 focus:rounded-md focus:text-orange-500 focus:font-bold transition-all duration-150 ease-in break-words"
              rows={3}
              onChange={handleInputChange}
              name="about"
              value={about}
            />
          </div>
          <div className="text-xl text-gray-700 font-bold flex justify-between w-full gap-x-4 my-2 focus-within:shadow-md">
            <label className="min-w-[120px] italic p-1">Destination</label>
            <input
              type="text"
              className="flex-1 border-0 border-b-2 border-b-teal-500 border-solid p-1 px-2 focus:border-b-0 focus:rounded-md focus:text-orange-500 focus:font-bold transition-all duration-150 ease-in"
              onChange={handleInputChange}
              name="destination"
              value={destination}
            />
          </div>
          <div className="text-xl text-gray-700 font-bold flex flex-col justify-between items-center w-full gap-x-4 my-2 focus-within:shadow-md">
            <label className="min-w-[120px] italic p-1">
              Choose A Category
            </label>
            <select
              className="flex-1 border-0 border-b-2 border-b-teal-500 border-solid p-1 px-2 focus:border-b-0 focus:rounded-md focus:text-orange-500 focus:font-bold transition-all duration-150 ease-in outline-none capitalize"
              onChange={handleInputChange}
              value={category}
              name="category"
            >
              <option className="p-2 capitalize" value={''}></option>
              {categories.map((category) => (
                <option
                  key={category.name}
                  value={category.name}
                  className="p-2 capitalize"
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full flex justify-center mt-4 m-1">
            <button
              type="submit"
              className="hover:bg-emerald-500 bg-orange-500 rounded-md p-1 px-2 shadow-md hover:scale-110 text-white text-xl"
            >
              Create Pin
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePin

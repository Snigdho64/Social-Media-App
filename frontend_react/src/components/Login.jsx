import React, { useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc'
import assets from '../assets'
import { GoogleLogin } from 'react-google-login'
import { client } from '../client'
import { useNavigate } from 'react-router-dom'
import fetchUser from '../utils/fetchUser'

const Login = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const user = fetchUser()
    if (user) navigate('/')
  }, [])

  const responseGoogle = (response) => {
    const { profileObj } = response
    const { googleId, name, imageUrl } = profileObj

    const userDoc = {
      _id: googleId,
      _type: 'user',
      username: name,
      image: imageUrl,
    }
    localStorage.setItem('user', JSON.stringify(userDoc))

    client.createIfNotExists(userDoc).then(() => {
      navigate('/', { replace: true })
    })
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={assets.share}
          controls={false}
          type="video/mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
        <div className="flex justify-center items-center flex-col absolute w-screen h-screen top-0 bg-blackOverlay">
          <div className="p-4">
            <img src={assets.logowhite} alt="logo" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              render={(renderProps) => (
                <button
                  className="text-gray-700 flex felx-row items-center gap-2 text-lg bg-white p-1 px-2 rounded-lg hover:bg-sky-600 hover:bg-opacity-50 hover:text-white"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle />
                  Sign In With Google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

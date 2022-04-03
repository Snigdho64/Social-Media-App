import React from 'react'
import { Circles } from 'react-loader-spinner'
const Spinner = ({ message }) => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <Circles height={50} width={50} color="#00BFFF" className="m-5" />
            {message && (
                <p className="text-center text-slate-700 font-bold text-lg">
                    {message}
                </p>
            )}
        </div>
    )
}

export default Spinner

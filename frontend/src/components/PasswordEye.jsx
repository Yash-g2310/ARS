import React from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordEye = ({showPassword,setShowPassword}) => {
    return (
        <span
            onClick={() => { setShowPassword(!showPassword) }}
            className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer transition-transform duration-200 opacity-70 hover:opacity-100 hover:scale-110'
        >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
    )
}

export default PasswordEye

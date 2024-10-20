import React, { useState } from 'react'
import Login from '../components/login'
import SignUp from '../components/SignUp'
import LoginSignupHeader from '../components/LoginSignupHeader'
const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(false)
    return (
        <div className='flex flex-row'>
            <div className='w-'>
                <LoginSignupHeader/>
                <button onClick={()=>{setIsLogin(true)}}>Login</button>
                <button onClick={()=>{setIsLogin(false)}}>Sign Up</button>
                {isLogin?<Login/>:<SignUp/>}
            </div>
            <div className='hidden w-1/2  h-screen lg:block fixed right-0'>
                <img src="/assets/front-image.jpg" alt="front-image " className='object-cover h-full w-full'/>
            </div>
        </div>
    )
}

export default LoginSignup

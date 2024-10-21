import React, { useEffect, useState } from 'react'

const LoginSignupHeader = () => {
    const [showText, setShowText] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowText(true)
        }, 1000);

        return () => {
            clearTimeout(timer)
        }
    }, [])

    return (
        <div className="flex flex-col items-center justify-center">
            <img
                className={`mx-auto h-20 w-auto transition-transform duration-700 ease-in-out transform 
                ${showText ? "scale-110 translate-y-0 opacity-100" : "scale-75 translate-y-5 opacity-0"} hover:scale-125`} 
                src="/assets/Yellow_and_Black_Modern_Media_Logo-removebg-preview.png" 
                alt="RCheck" 
            />

            <h1 className={`text-4xl md:text-5xl tracking-wide font-extrabold transition-all duration-1000 ease-in-out mt-4 
                ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <span className="bg-gradient-to-r from-zinc-600 to-zinc-800 bg-clip-text text-transparent tracking-wider">
                    RCheck
                </span>
            </h1>

            <p className={`text-lg text-gray-500 mt-2 transition-opacity duration-1000 ease-in-out 
                ${showText ? 'opacity-100 delay-500' : 'opacity-0'}`}>
                Streamlining Assignments, Seamlessly.
            </p>
        </div>
    )
}

export default LoginSignupHeader

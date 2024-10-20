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
        <>
            <img className={`mx-auto h-20 w-auto transition-transform duration-700 ${showText ? "-translate-x-16 opacity-100" : "opacity-0"}`} src="/assets/Yellow_and_Black_Modern_Media_Logo-removebg-preview.png" alt="RCheck" />
            <h1 className={`text-4xl tracking-wide font-bold transition-opacity duration-700 ${showText ? 'opacity-100' : 'opacity-0'}`}>
                RCheck
            </h1>
        </>
    )
}

export default LoginSignupHeader

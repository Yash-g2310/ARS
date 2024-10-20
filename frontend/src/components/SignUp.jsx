import React from 'react'
import '../styles/loginSignupStyles.css'
import LoginButton from './LoginButton'

const SignUp = () => {
    return (
        <div>
            <div className="flex min-h-full flex-col justify-center px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create your Account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div className='flex flex-row gap-6'>
                            <div >
                                <label htmlFor="firstName" className='form-label' >First Name</label>
                                <input id='firstName' name='firstName' type="text" autoComplete='firstName' required className='mt-2 form-input'/>
                            </div>
                            <div >
                                <label htmlFor="lastName" className='form-label' >Last Name</label>
                                <input id='lastName' name='lastName' type="text" autoComplete='lastName' required className='mt-2 form-input'/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="username" className="text-left block text-sm font-medium leading-6 text-gray-900">Username</label>
                            <div className="mt-2">
                                <input id="username" name="username" type="text" autoComplete="username" required className="form-input" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="mt-2">
                                <input id="password" name="password" type="password" autoComplete="new-password" required className="form-input" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                            <div className="mt-2">
                                <input id="confirm-password" name="confirm-password" type="password" autoComplete="confirm-password" required className="form-input" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Sign Up</button>
                        </div>
                    </form>
                    <span className="relative flex justify-center p-6">
                        <div
                            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-500 rounded-xl"
                        ></div>

                        <span className="relative z-10 bg-white px-4">Or sign up with</span>
                    </span>
                    <div className='flex flex-row justify-around'>
                        <LoginButton src={"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"} alt={"Google Logo"} text="Google"/>
                        <LoginButton src={"https://channeli.in/branding/site/logo.svg"} alt={"Channeli Logo"} text="Channeli"/>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SignUp

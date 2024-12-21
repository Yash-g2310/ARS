import React, { useState,useEffect } from 'react'
import '../../styles/loginSignupStyles.css'
import LoginButton from './LoginButton'
import { useForm } from 'react-hook-form'
import { Tooltip } from '@mui/material'
import PasswordEye from './PasswordEye'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError, setRegisterError,channeliLogin } from '../../features/auth/authSlice'

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const dispatch = useDispatch()
    const { isRegistered, registeredError, isLoading, isRegisteredError } = useSelector(state => state.auth)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onChange"
    })

    useEffect(() => {
        if (isRegistered) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isRegistered, dispatch]);
    useEffect(() => {
        // console.log(isRegisteredError, registeredError)
        if (isRegisteredError) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isRegisteredError, dispatch]);

    const onSubmit = async (data) => {
        dispatch(clearError());
        try {
            await dispatch(registerUser(data)).unwrap();
        } catch (error) {
            console.error('Error fetching data:', error);
            dispatch(setRegisterError(error));
        }
    }

    console.log('signup')

    const errorMessages = [];
    if (isRegisteredError && registeredError) {
        for (const [key, value] of Object.entries(registeredError)) {
            errorMessages.push(
                <div key={key} className='bg-red-500 text-white mb-2 pl-2 rounded-md'>
                    {key}: {value}
                </div>
            );
        }
    }

    if (isLoading) return <div>Loading...</div>

    return (
        <div>
            <div className="flex min-h-full flex-col justify-center px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create your Account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className='flex flex-row gap-6'>
                            <div className='relative'>
                                <label htmlFor="firstName" className='form-label' >First Name</label>
                                <Tooltip
                                    title={errors.firstName ? errors.firstName.message : ''}
                                    placement="bottom-start"
                                    arrow
                                    open={!!errors.firstName && watch('firstName')}
                                >
                                    <input id='firstName'
                                        name='firstName'
                                        type="text"
                                        autoComplete='firstName'
                                        required
                                        className='mt-2 form-input'
                                        {...register('firstName', {
                                            pattern: {
                                                value: /^[A-Za-z]+$/,
                                                message: "The name should contain letters only"
                                            }
                                        })}
                                    />

                                </Tooltip>
                            </div>
                            <div >
                                <label htmlFor="lastName" className='form-label' >Last Name</label>
                                <Tooltip
                                    title={errors.lastName ? errors.lastName.message : ''}
                                    placement="bottom-start"
                                    arrow
                                    open={!!errors.lastName && watch('lastName')}
                                >
                                    <input id='lastName'
                                        name='lastName'
                                        type="text"
                                        autoComplete='lastName'
                                        required
                                        className='mt-2 form-input'
                                        {...register('lastName', {
                                            pattern: {
                                                value: /^[A-Za-z]+$/,
                                                message: "The name should contain letters only"
                                            }
                                        })}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="username" className="text-left block text-sm font-medium leading-6 text-gray-900">Username</label>
                            <div className="mt-2 relative">
                                <Tooltip
                                    title={errors.username ? errors.username.message : ''}
                                    placement="bottom-start"
                                    arrow
                                    open={!!errors.username && watch('username')}
                                >
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        required
                                        className="form-input"
                                        {...register('username', {
                                            minLength: { value: 3, message: "Minimum length required is 3" },
                                        })}
                                    />

                                </Tooltip>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="text-left block text-sm font-medium leading-6 text-gray-900">Email</label>
                            <div className="mt-2">
                                <Tooltip
                                    title={errors.email ? errors.email.message : ''}
                                    placement="bottom-start"
                                    arrow
                                    open={!!errors.email && watch('email')}
                                >
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="form-input"
                                        {...register('email', {
                                            pattern: {
                                                value: /^(?!.*[._@-]{2,})(?=[\w\d]+[._-]?[\w\d])[\w\d._-]+[\w\d]@[\w\d._-]+\.[\w\d]+$/i,
                                                message: "Email you entered is invalid"
                                            }
                                        })}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="mt-2 relative">
                                <Tooltip
                                    title={errors.password ? errors.password.message : ''}
                                    placement="bottom-start"
                                    arrow
                                    open={!!errors.password && watch('password')}

                                >
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        className="form-input"
                                        {...register('password', {
                                            minLength: { value: 8, message: "Minimul length of password should be 8" },
                                            validate: {
                                                hasNumber: (value) => /\d/.test(value) || "Password must contain at least one digit",
                                                hasUppercase: (value) => /[A-Z]/.test(value) || "Password must include an uppercase letter"
                                            }
                                        })}
                                    />
                                </Tooltip>
                                <PasswordEye showPassword={showPassword} setShowPassword={setShowPassword} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <div className="mt-2 relative">
                                <Tooltip
                                    title={errors.confirmPassword ? errors.confirmPassword.message : ''}
                                    placement="bottom-start"
                                    arrow
                                    open={!!errors.confirmPassword && watch('confirmPassword')}
                                >
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="confirmPassword"
                                        required
                                        className="form-input"
                                        {...register('confirmPassword', {
                                            validate: (value) => value === watch('password') || 'Passwords do not match'

                                        }
                                        )}
                                    />
                                </Tooltip>
                                <PasswordEye showPassword={showConfirmPassword} setShowPassword={setShowConfirmPassword} />
                            </div>
                        </div>
                        {isRegisteredError && errorMessages}
                        {/* {isRegisteredError && <div className='bg-red-500 text-white mb-2 pl-2 rounded-md'>{
                            }</div>} */}
                        {isRegistered && <div className='bg-green-500 text-white mb-2 pl-2 rounded-md'>Registered Successfully, Now you can log in</div>}
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Sign Up"}
                            </button>
                        </div>
                    </form>
                    <span className="relative flex justify-center p-6">
                        <div
                            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-500 rounded-xl"
                        ></div>

                        <span className="relative z-10 bg-white px-4">Or sign up with</span>
                    </span>
                    <div className='flex flex-row justify-around'>
                        <LoginButton src={"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"} alt={"Google Logo"} text="Google" />
                        <LoginButton src={"https://channeli.in/branding/site/logo.svg"} alt={"Channeli Logo"} text="Channeli" onClick={async()=>{await dispatch(channeliLogin()).unwrap()}} />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SignUp


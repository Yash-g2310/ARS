import { useEffect, useState } from 'react'
import '../styles/loginSignupStyles.css'
import LoginButton from './LoginButton'
import { useForm } from 'react-hook-form'
import PasswordEye from './PasswordEye';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()
    const [csrfToken, setCsrfToken] = useState('')

    const {
        register,
        handleSubmit,
        formState:{isSubmitting},
    } = useForm({
        mode: "onChange"
    })

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/csrf/`)
                setCsrfToken(response.data.csrfToken)
                document.cookie = `csrftoken=${response.data.csrfToken}`
            } catch (error) {
                console.error('Error fetching csrf token data:', error)
            }
        }
        fetchCsrfToken()
    },[])

    const onSubmit = async (data) => {
        setErrorMessage('')
        console.log(data)
        console.log(csrfToken)
        const fetchData = async ()=>{
            try{
                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login/`,data,{
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                });
                console.log(response.data)
                if (response.status===200){
                    navigate('/dashboard')
                    localStorage.setItem('username',response.data.user['username'])
                }
            }
            catch(error){
                console.error('Error fetching data:', error);
                if(error.response.status === 400){
                    setErrorMessage("Invalid credentials. Please try again.")
                }
            }
        }
        fetchData()
    }

    return (
        <div>
            <div className="flex min-h-full flex-col justify-center px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <div className='flex items-center justify-between'>
                                <label htmlFor="username" className="text-left block text-sm font-medium leading-6 text-gray-900">Username</label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">Forgot username?</a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="form-input"
                                    {...register('username')}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">Forgot password?</a>
                                </div>
                            </div>
                            <div className="mt-2 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="form-input"
                                    {...register('password')}
                                />
                                <PasswordEye showPassword={showPassword} setShowPassword={setShowPassword} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center pb-4 pl-2">
                                <input type="checkbox" id="remember" name="remember" className="mr-2" />
                                <label htmlFor="remember" className="text-sm text-gray-700">Remember me</label>
                            </div>
                            {errorMessage && <div className='bg-red-500 text-white mb-2 rounded-md'>{errorMessage}</div>}
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                disabled={isSubmitting}>
                                {isSubmitting?"Submitting...":"Sign in"}
                            </button>
                        </div>
                    </form>

                    <span className="relative flex justify-center p-6">
                        <div
                            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-500 rounded-xl"
                        ></div>

                        <span className="relative z-10 bg-white px-4">Or continue with</span>
                    </span>
                    <div className='flex flex-row justify-around'>
                        <LoginButton src={"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"} alt={"Google Logo"} text="Google" />
                        <LoginButton src={"https://channeli.in/branding/site/logo.svg"} alt={"Channeli Logo"} text="Channeli" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

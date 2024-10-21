import LoginSignupHeader from './LoginSignupHeader'
import '../styles/loginSignupStyles.css'
import LoginButton from './LoginButton'

const Login = () => {

    return (
        <div>
            <div className="flex min-h-full flex-col justify-center px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <div className='flex items-center justify-between'>
                                <label htmlFor="username" className="text-left block text-sm font-medium leading-6 text-gray-900">Username</label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">Forgot username?</a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input id="username" name="username" type="text" autoComplete="username" required className="form-input" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">Forgot password?</a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input id="password" name="password" type="password" autoComplete="current-password" required className="form-input" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Sign in</button>
                        </div>
                    </form>


                    <span className="relative flex justify-center p-6">
                        <div
                            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-500 rounded-xl"
                        ></div>

                        <span className="relative z-10 bg-white px-4">Or continue with</span>
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

export default Login

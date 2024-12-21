import React,{ useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { channeliLoginCallBack, loginError, clearError,} from '../../features/auth/authSlice'

const ChanneliCallback = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAuthenticated,isLoading,isError,errorMessage } = useSelector(state => state.auth)

    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const username = params.get('username');
        const status = params.get('status')
        
        if(status=='success' && username){
            const loginUser = async(username) =>{
                // console.log('Channeli Callback')
                try{
                    dispatch(channeliLoginCallBack({username: username}));
                    
                } catch (error){
                    dispatch(loginError(error));
                    navigate('/');
                }
            }
            loginUser(username);
            // console.log('Channeli Callback done')
        } else{
            navigate('/');
        }
    }, [])
    
    
    useEffect(() => {
        if(isAuthenticated){
            dispatch(clearError())
            navigate('/dashboard');
        }
    }, [isAuthenticated,dispatch])

    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>{errorMessage}</div>

    return (
        <div>Completing Login...</div>
    )
}

export default ChanneliCallback

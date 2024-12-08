import React,{ useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { channeliLoginCallBack, loginError, clearLoginError, fetchUserProfile} from '../features/auth/authSlice'

const ChanneliCallback = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAuthenticated,user } = useSelector(state => state.auth)
    console.log(isAuthenticated)
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const username = params.get('username');
        const status = params.get('status')

        console.log(params)
        if(status=='success' && username){
            console.log(isAuthenticated)
            const loginUser = async(username) =>{
                try{
                    dispatch(channeliLoginCallBack({username: username}));
                    if(isAuthenticated){
                        await dispatch(fetchUserProfile()).unwrap();
                        if(user !==null){
                            dispatch(clearLoginError());
                            navigate('/dashboard');
                        }
                    }
                } catch (error){
                    await dispatch(loginError(error)).unwrap();
                    navigate('/');
                }
            }
            loginUser(username);
            console.log(isAuthenticated)
        } else{
            navigate('/');
        }
    }, [])
    useEffect(() => {
        if(isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated])


    return (
        <div>Completing Login...</div>
    )
}

export default ChanneliCallback

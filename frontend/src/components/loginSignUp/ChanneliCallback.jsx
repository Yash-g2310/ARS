import React,{ useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { channeliLoginCallBack, loginError, clearLoginError, fetchUserProfile} from '../../features/auth/authSlice'

const ChanneliCallback = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAuthenticated,user } = useSelector(state => state.auth)

    
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
        // console.log('authentication changed');
        // console.log(isAuthenticated);
        if(isAuthenticated){
            const fetchUserProfileData = async () => {
                try{
                    await dispatch(fetchUserProfile()).unwrap();
                } catch (error){
                    console.error('Error fetching user profile:', error);
                }
            }
            fetchUserProfileData();
            // console.log('profile fetched');
        }
    }, [isAuthenticated,dispatch])
    
    useEffect(() => {
        if(isAuthenticated && user !== null){
            dispatch(clearLoginError())
            navigate('/dashboard');
        }
    }, [user,dispatch])



    return (
        <div>Completing Login...</div>
    )
}

export default ChanneliCallback

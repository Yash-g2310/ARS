import React,{useEffect} from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { checkSession } from "../features/auth/authSlice";

const PrivateRoute = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated,isLoading,isError,errorMessage } = useSelector(state=>state.auth)

    useEffect(() => {
        console.log('checking session in private route');
        console.log(isAuthenticated);
        const verifySession = async () => {
            try{
                await dispatch(checkSession()).unwrap();
            } catch (error){
                console.error('Error checking session:', error);
            }
        }
        verifySession();
        console.log('session checked');
    },[dispatch])

    if(isLoading) return <div>Loading auth state...</div>;
    if(isError) return <div>{errorMessage}</div>;
    return isAuthenticated ? children : <Navigate to="/" />;
}

export default PrivateRoute;
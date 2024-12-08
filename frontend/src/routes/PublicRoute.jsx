import React, {useEffect} from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { checkSession } from "../features/auth/authSlice";

const PublicRoute = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated,isLoading } = useSelector(state=>state.auth);

    useEffect(() => {
        const verifySession = async () => {
            try{
                await dispatch(checkSession()).unwrap();
            } catch (error){
                console.error('Error checking session:', error);
            }
        }
        verifySession();
    }, [dispatch])

    if(isLoading) return <div>Loading auth state...</div>;
    return isAuthenticated ? <Navigate to="/dashboard" /> : children;
}
export default PublicRoute;
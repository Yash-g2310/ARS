import React,{useContext} from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    console.log(isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/" />;
}

export default PrivateRoute;
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuth = async () => {
        try{
            const response = await axiosInstance.get('/session/');
            if (response.data.session) {
                setIsAuthenticated(true);
            }
        } catch (err) {
            setError(err.message);
            setIsAuthenticated(false);
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    const login = useCallback(() => {
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
        localStorage.removeItem('username');
    }, []);

    if (loading) return <div>Loading auth state...</div>;
    if (error) return <div>Authentication Error: {error}</div>;

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            setIsAuthenticated, 
            login, 
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
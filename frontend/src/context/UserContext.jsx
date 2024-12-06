import React, { createContext, useState, useEffect, useCallback } from 'react';
import { fetchUserData } from '../services/api';

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
    const [userProfileData, setUserProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUserData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchUserData();
            setUserProfileData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <UserContext.Provider value={{ 
            userProfileData,
            loading,
            error,
            getUserData,
            setUserProfileData
        }}>
            {children}
        </UserContext.Provider>
    );
};

const useUser = () => {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};

export { UserProvider, useUser };
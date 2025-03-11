import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState({ username: 'Demo', walletBalance: 0, email: "", userId: "", referalId: "" });

    const fetchNameWallet = async () => {
        // console.log("ok")
        const userData = localStorage.getItem('user');
        console.log(userData, "user")
        if (!userData) {
            console.error('User data not found in localStorage');
            return;
        }
        const objectId = JSON.parse(userData);

        const id = objectId.id; // Extract the user ID
        try {
            // console.log("id", id)
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/name/${id}`);
            // console.log(res, "res")
            setProfile({
                username: res.data.username,
                walletBalance: res.data.walletBalance,
                email: res.data.email,
                userId: id,
                referalId: objectId.referalId
            });
            // console.log(profile, "profile")
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };
    // console.log(profile)
    useEffect(() => {
        fetchNameWallet();
    }, []); // Automatically fetch profile data on mount

    return (
        <ProfileContext.Provider value={{ profile, fetchNameWallet }}>
            {children}
        </ProfileContext.Provider>
    );
};


// Custom hook for using profile context
export const useProfile = () => useContext(ProfileContext);

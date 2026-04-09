import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';

export default function GetCurrentUser() {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
                dispatch(setUserData(result?.data?.user));
            }
            catch (error) {
                console.log(error.message);
            }
        }

        fetchUser();

    }, [])
}

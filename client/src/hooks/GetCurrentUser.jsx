import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App';
import { setUserData, setAuthChecked } from '../redux/userSlice';

export default function GetCurrentUser() {

    const dispatch = useDispatch();
    const { storyData } = useSelector(state => state.story);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
                dispatch(setUserData(result.data));
                
            }
            catch (error) {
                console.log(error.message);
                dispatch(setAuthChecked());
            }
        }

        fetchUser();

    }, [dispatch, storyData])
}

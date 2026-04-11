import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App';
import { setAuthChecked, setSuggestedUsers } from '../redux/userSlice';

export default function GetSuggestedUser() {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/suggestedUsers`, { withCredentials: true });
                // console.log(result.data);
                dispatch(setSuggestedUsers(result.data));
            }
            catch (error) {
                console.log(error.message);
                dispatch(setAuthChecked());
            }
        }

        fetchUser();

    }, [dispatch])
}

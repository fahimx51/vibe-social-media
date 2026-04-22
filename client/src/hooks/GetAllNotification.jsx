import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App';
import { setNotificationData } from '../redux/notificationSlice';

export default function GetAllNotification() {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/notification/getAllNotifications`, { withCredentials: true });
                dispatch(setNotificationData(result.data));
            }
            catch (error) {
                console.log(error.message);
            }
        }

        fetchNotifications();

    }, [])
}

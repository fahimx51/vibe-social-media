import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App';
import { setNotificationData } from '../redux/notificationSlice';

export default function GetAllNotification() {
    const { userData } = useSelector(state => state.user)
    const { notificationData } = useSelector(state => state.notification);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userData || (notificationData && notificationData.length > 0)) {
            return;
        }

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

    }, [dispatch, userData])
}

import React, { useEffect } from 'react'
import { IoArrowBack } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import NotificationCard from '../components/NotificationCard'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setNotificationData } from '../redux/notificationSlice'


export default function Notification({ notificationData }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        // We create the function inside or outside
        const readAllNotification = async () => {
            try {
                const result = await axios.post(`${serverUrl}/api/notification/markAsRead`, {}, { withCredentials: true });
                dispatch(setNotificationData(result.data));
            }
            catch (error) {
                console.log(error);
            }
        }

        // CLEANUP FUNCTION: This runs when the user leaves the page
        return () => {
            readAllNotification();
        };
    }, []);

    return (
        <div className='w-full min-h-screen bg-gray-950 text-white pb-10'>
            {/* Header */}
            <div className='w-full h-[70px] flex items-center gap-4 px-5 sticky top-0 bg-gray-950/80 backdrop-blur-md z-10 border-b border-gray-900'>
                <IoArrowBack
                    onClick={() => navigate(-1)}
                    className='text-white cursor-pointer w-6 h-6 lg:w-8 lg:h-8 hover:bg-gray-800 rounded-full transition-all'
                />
                <h1 className='text-xl font-bold'>Notifications</h1>
            </div>

            {/* Notification List */}
            <div className='w-full max-w-[700px] mx-auto flex flex-col mt-2'>
                {notificationData && notificationData.length > 0 ? (
                    notificationData.map((noti) => (
                        <NotificationCard key={noti?._id} noti={noti} />
                    ))
                ) : (
                    <div className='w-full flex flex-col items-center justify-center mt-20 opacity-50'>
                        <div className='w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-4'>
                            <IoArrowBack className='rotate-180 w-8 h-8' />
                        </div>
                        <p className='text-gray-400'>No notifications yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}
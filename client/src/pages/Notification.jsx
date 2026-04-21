import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { IoArrowBack } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import NotificationCard from '../components/NotificationCard'
import { serverUrl } from '../App'
import axios from 'axios'


export default function Notification() {
    const { notificationData } = useSelector(state => state.notification);
    const navigate = useNavigate();

    useEffect(() => {
        const readAllNotifaction = async () => {
            try {
                await axios.post(`${serverUrl}/api/notification/markAsRead`, {}, { withCredentials: true });
            }
            catch (error) {
                console.log(error);
            }
        }
        readAllNotifaction();
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
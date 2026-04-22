import React from 'react'
import maleDP from '../assets/dp.jpeg'
import { useNavigate } from 'react-router-dom';
import moment from 'moment' // Highly recommended for "2 mins ago" formatting

export default function NotificationCard({ noti }) {
    const navigate = useNavigate();

    return (
        <div
            key={noti._id}
            className={`w-full rounded-2xl my-0.5 p-4 flex items-center gap-4 border-b border-gray-900 hover:bg-gray-900/40 transition-all cursor-pointer ${!noti.isRead ? 'bg-blue-500/20' : ''}`}
        >
            {/* Sender Image */}
            <div className='relative'>
                <img
                    src={noti.sender?.profileImage || maleDP}
                    alt="sender"
                    className='w-12 h-12 rounded-full object-cover border border-gray-800'
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${noti.sender?.userName}`)
                    }}
                />
                {/* Unread Dot */}
                {!noti.isRead && <div className='absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-950'></div>}
            </div>

            {/* Message Content */}
            <div className='flex-1 flex flex-col'>
                <p className='text-sm lg:text-base'>
                    <span className='font-bold hover:underline'>@{noti.sender?.userName} </span>
                    <span className='text-gray-300'>{noti.message}</span>
                </p>
                <span className='text-xs text-gray-500 mt-1'>
                    {moment(noti.createdAt).fromNow()}
                </span>
            </div>

            
        </div>
    )
}

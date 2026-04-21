import React from 'react'
import maleDP from '../assets/dp.jpeg'
import { useNavigate } from 'react-router-dom';
import moment from 'moment' // Highly recommended for "2 mins ago" formatting

export default function NotificationCard({ noti }) {
    const navigate = useNavigate();

    return (
        <div
            key={noti._id}
            className={`w-full p-4 flex items-center gap-4 border-b border-gray-900 hover:bg-gray-900/40 transition-all cursor-pointer ${!noti.isRead ? 'bg-blue-500/5' : ''}`}
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

            {/* Post Preview (Optional) */}
            {(noti.type === 'like' || noti.type === 'comment') && noti.post && (
                <div className='w-10 h-10 bg-gray-800 rounded-md overflow-hidden flex-shrink-0'>
                    {/* You could show a thumbnail of the post here if your schema included postImg */}
                    <div className='w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 opacity-30'></div>
                </div>
            )}
        </div>
    )
}

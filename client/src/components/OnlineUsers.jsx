import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import maleDP from '../assets/dp.jpeg'
import { setSelectedUser } from '../redux/messageSlice';

export default function OnlineUsers({ user }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <div className='w-[60px] h-[60px] flex gap-[20px] justify-start items-center relative'>
            <div
                onClick={() => {
                    dispatch(setSelectedUser(user));
                    navigate('/message-area')
                }}
                className='w-12.5 h-12.5 cursor-pointer border-1 border-blue-400 rounded-full overflow-hidden shrink-0'
            >
                <img src={user?.profileImage || maleDP} alt="" className='h-full w-full object-cover object-center' />
            </div >

            <div className='w-[14px] h-[14px] bg-green-400 border-2 border-gray-900 rounded-full absolute bottom-2 right-3'></div>
        </div>
    )
}

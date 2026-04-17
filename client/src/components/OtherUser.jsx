import React from 'react'
import maleDP from '../assets/dp.jpeg'
import { useNavigate } from 'react-router-dom'
import FollowButton from './FollowButton';

export default function OtherUser({ user }) {

    const navigate = useNavigate();

    return (
        <div className='w-full h-[80px] flex items-center justify-between border-b border-gray-800'>
            <div className='flex items-center gap-[10px] cursor-pointer' onClick={() => navigate(`profile/${user.userName}`)}>
                <div className='w-12 h-12 border-2 border-blue-400 rounded-full overflow-hidden shrink-0'>
                    <img src={user?.profileImage || maleDP} alt="" className='h-full w-full object-cover object-center' />
                </div>
                <div>
                    <div className='text-[18px] text-white font-semibold'>{user.name}</div>
                    <div className='text-[15px] text-gray-400'> {user.userName} </div>
                </div>
            </div>

            <FollowButton targetUserId={user._id} tailwind={'px-[10px] w-25 py-[5px] h-10 bg-white rounded-2xl'} />
            
        </div>
    )
}

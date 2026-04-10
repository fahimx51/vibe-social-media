import React from 'react'
import { useSelector } from 'react-redux'
import maleDP from '../assets/dp.jpeg'

export default function StoryCard() {
    const { userData } = useSelector(state => state.user)
    return (
        <div className='flex flex-col w-[80px]'>
            <div className='w-17 h-17 bg-gradient-to-l from-blue-500 to-orange-400 rounded-full flex justify-center items-center'>
                <div className='w-15 h-15 rounded-full cursor-pointer overflow-hidden'>
                    <img src={userData?.profileImage || maleDP} alt="" className='w-full object-cover object-center ' />
                </div>
            </div>
            <div className='text-[14px] text-center truncate w-full text-white'>{userData.userName}</div>
        </div>
    )
}

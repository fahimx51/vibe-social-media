import React from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import maleDP from '../assets/dp.jpeg'
import { IoImageOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";

export default function MessageArea() {

    const navigate = useNavigate();
    const { selectedUser } = useSelector(state => state.message);

    return (
        <div className='w-full h-screen bg-gray-900 relative'>
            <div className='flex items-center gap-[15px] px-[10px] py-[10px] fixed top-0 z-100 w-full '>
                <div className=' h-[80px] flex items-center gap-[20px] px-[20px]'>
                    <IoArrowBack onClick={() => navigate(`/`)} className='text-white cursor-pointer w-8 h-8' />
                </div>
                <div className='w-12 h-12 border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden'>
                    <img src={selectedUser?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                </div>

                <div className='text-white text-[18px] font-semibold'>
                    <div>{selectedUser.userName}</div>
                    <div className='text-[12px] text-gray-400'>{selectedUser.name}</div>
                </div>
            </div>

            <div className='w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-gray-900 z-100'>
                <form className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-gray-950 flex items-center gap-[10px] px-[20px] relative'>
                    <input
                        type="text"
                        placeholder='Write a message...'
                        className='w-full h-full px-[20px] text-[18px] text-white outline-0'
                        required
                    />

                    <div className='flex items-center gap-[20px]'>
                        <IoImageOutline className='w-[28px] h-[28px] text-white' />
                        <button className='bg-gradient-to-br from-[#b80099] to-[#1f01cc] h-10 w-10 cursor-pointer flex items-center justify-center rounded-full'><IoIosSend className='w-6 h-6 text-white' /></button>
                    </div>
                </form>
            </div>
        </div>
    )
}

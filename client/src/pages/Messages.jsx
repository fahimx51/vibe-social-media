import React from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

export default function Messages() {
    const navigate = useNavigate();

    return (
        <div className='w-full min-h-screen flex flex-col gap-[20px] bg-gray-900 p-[10px]'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
                <IoArrowBack onClick={() => navigate(`/`)} className='text-white cursor-pointer w-9 h-9 lg:hidden' />
                <h1 className='text-white text-[20px] font-semibold'>Messages</h1>
            </div>
        </div>
    )
}

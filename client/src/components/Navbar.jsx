import React from 'react'
import { GoHomeFill, GoVideo } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { BsPlusSquare } from "react-icons/bs";
import { useSelector } from 'react-redux';
import maleDP from '../assets/dp.jpeg'
import { useNavigate } from 'react-router-dom';

export default function Navbar() {

    const { userData } = useSelector(state => state.user);
    const navigate = useNavigate();

    return (
        <div className='w-[90%] lg:w-[40%] h-[80px] bg-black/80 flex justify-around items-center fixed bottom-[20px] rounded-full shadow-xl shadow-[#000000]/70 z-[100]'>
            <div><GoHomeFill className='text-white w-[30px] h-[30px]' /></div>
            <div><FiSearch className='text-white w-[30px] h-[30px]' /></div>
            <div><GoVideo className='text-white w-[30px] h-[30px]' /></div>
            <div><BsPlusSquare className='text-white w-[30px] h-[30px]' /></div>
            <div className='w-11 h-11 border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden' onClick={() => navigate(`/profile/${userData.userName}`)}>
                <img src={userData?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
            </div>
        </div>
    )
}

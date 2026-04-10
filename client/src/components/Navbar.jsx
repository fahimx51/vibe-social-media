import React from 'react'
import { GoHomeFill, GoVideo } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { BsPlusSquare } from "react-icons/bs";
import { useSelector } from 'react-redux';
import maleDP from '../assets/dp.jpeg'

export default function Navbar() {

    const { userData } = useSelector(state => state.user);

    return (
        <div className='w-[90%] lg:w-[40%] h-[80px] bg-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]'>
            <div><GoHomeFill className='text-white w-[30px] h-[30px]' /></div>
            <div><FiSearch className='text-white w-[30px] h-[30px]' /></div>
            <div><GoVideo className='text-white w-[30px] h-[30px]' /></div>
            <div><BsPlusSquare className='text-white w-[30px] h-[30px]' /></div>
            <div className='w-11 h-11 border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden'>
                <img src={userData?.profileImage || maleDP} alt="" className='w-full object-cover object-center' />
            </div>
        </div>
    )
}

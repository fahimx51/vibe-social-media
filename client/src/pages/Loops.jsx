import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from 'react-redux';
import LoopCard from '../components/LoopCard';

export default function Loops() {

    const navigate = useNavigate();
    const { loopData } = useSelector(state => state.loop);

    return (
        <div className='w-screen h-screen bg-gray-900 overflow-hidden flex justify-center items-center'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] fixed top-[15px] left-[15x]'>
                <IoArrowBack onClick={() => navigate(`/`)} className='text-white cursor-pointer w-9 h-9' />
                <h1 className='text-white text-[20px] font-semibold'>Loops</h1>
            </div>
            <div className='h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar'>
                {
                    loopData.map((loop, index) =>
                        <div key={index} className='h-screen snap-start'>
                            <LoopCard loop={loop} />
                        </div>
                    )
                }
            </div>

        </div>
    )
}

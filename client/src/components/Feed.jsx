import React from 'react'
import logo_white from '../assets/logo_white.png'
import { FaRegHeart } from 'react-icons/fa'
import StoryCard from './StoryCard'

export default function Feed() {
    return (
        <div className='lg:w-[50%] w-full bg-gray-950 min-h-screen lg:h-screen relative lg:overflow-y-auto p-5'>
            <div className='w-full h-[100px] flex items-center justify-between lg:hidden'>
                <img src={logo_white} alt="" className='w-20' />
                <div>
                    <FaRegHeart className='w-[25px] h-[25px] text-white cursor-pointer' />
                </div>
            </div>

            <div className='flex w-full overflow-auto gap-2 pb-4 no-scrollbar'>
                <StoryCard />
                <StoryCard />
                <StoryCard />
                <StoryCard />
                <StoryCard />
                <StoryCard />
                <StoryCard />
                <StoryCard />
                <StoryCard />
                <StoryCard />
                <StoryCard />
                <StoryCard />
            </div>

            <div className='w-full min-h-screen flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]'>

            </div>
        </div>
    )
}

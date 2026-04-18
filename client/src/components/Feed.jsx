import React from 'react'
import logo_white from '../assets/logo_white.png'
import { FaRegHeart } from 'react-icons/fa'
import { AiOutlineMessage } from "react-icons/ai";
import Navbar from './Navbar'
import { useSelector } from 'react-redux'
import Post from './Post'
import StoryDp from './StoryDp'
import { useNavigate } from 'react-router-dom';

export default function Feed() {

    const { postData } = useSelector(state => state.post);
    const { userData } = useSelector(state => state.user);

    const { storyList } = useSelector(state => state.story);

    const navigate = useNavigate();

    return (
        <div className='lg:w-[50%] w-full bg-gray-950 min-h-screen lg:h-screen relative lg:overflow-y-auto px-5 pt-5 no-scrollbar'>
            <div className='w-full h-[100px] flex items-center justify-between lg:hidden'>
                <img src={logo_white} alt="" className='w-20' />
                <div className='flex items-center gap-[20px]'>
                    <FaRegHeart className='w-[25px] h-[25px] text-white cursor-pointer' />
                    <AiOutlineMessage onClick={()=> navigate('/messages')} className='w-[25px] h-[25px] text-white cursor-pointer' />
                </div>
            </div>

            <div className='flex w-full overflow-auto gap-2 pb-4 no-scrollbar'>

                <StoryDp userName={userData.userName} profileImage={userData.profileImage} story={userData.story || null} />

                {storyList.map((story) => (
                    <StoryDp key={story._id} userName={story?.author.userName} profileImage={story.author.profileImage} story={story} />
                ))}
            </div>

            <div className='w-full min-h-screen flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]'>
                <Navbar />
                {
                    postData?.map((post, index) =>
                        <Post key={index} post={post} />
                    )}
            </div>
        </div>
    )
}

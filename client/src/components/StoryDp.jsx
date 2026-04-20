import React from 'react'
import { useSelector } from 'react-redux'
import maleDP from '../assets/dp.jpeg'
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';

export default function StoryDp({ userName, profileImage, story }) {
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate();

    const alreadyViewed = story?.viewers.find(viewer => viewer._id == userData._id);

    const handleViewer = async () => {
        try {
            await axios(`${serverUrl}/api/story/view/${story._id}`, { withCredentials: true });
        }
        catch (error) {
            console.log("error in story viewer handler", error);
        }
    }

    const handleClick = () => {
        if (!story && userName == userData.userName) {
            navigate('/upload');
        }
        else {
            if (userName != userData?.userName) {
                handleViewer();
            }
            navigate(`/story/${userName}`);
        }
    }
    return (
        <div className='flex flex-col w-[80px]'>
            <div
                onClick={handleClick}
                className={`w-17 h-17 ${story && !alreadyViewed ? 'bg-gradient-to-l from-blue-500 to-green-400' : 'bg-gradient-to-l from-gray-800 to-gray-600'} rounded-full flex justify-center items-center relative`}>
                <div className='w-15.5 h-15.5 rounded-full overflow-hidden'>
                    <img src={profileImage || maleDP} alt="" className='w-full h-full object-cover' />
                </div>
                {story === null && <FiPlusCircle className='text-gray-900 bg-gray-800 rounded-full absolute bottom-[1px] right-[1px] h-6 w-6 cursor-pointer text-white shadow-sm shadow-white/80' />}
            </div>
            <div className='text-[14px] text-center truncate w-full text-white'>{userData.userName == userName ? "Your Story" : userName}</div>
        </div>
    )
}

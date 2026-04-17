import React, { useEffect, useState } from 'react'
import maleDP from '../assets/dp.jpeg'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaEye } from "react-icons/fa";

export default function StoryCard({ storyData }) {

  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [showViewer, setShowViewer] = useState(false);

  const { userData } = useSelector(state => state.user);


  useEffect(() => {


    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate('/');
          return 100;
        }

        return prev + 1;
      })
    }, 150);

    return () => clearInterval(interval);
  }, [navigate]);


  return (
    <div className='w-full max-w-[500px] h-screen border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center'>
      <div className='flex  items-center gap-[10px] md:gap-[20px] absolute top-[20px] px-2'>
        <IoArrowBack onClick={() => navigate(`/`)} className='text-white cursor-pointer w-8 h-8' />
        <div className='w-11 h-11 md:w-15 md:h-15 border-2 border-blue-400 rounded-full overflow-hidden'>
          <img src={storyData?.author?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
        </div>
        <div className='max-w-[150px] text-white font-semibold truncate'>
          {storyData?.author?.userName}
        </div>
      </div>

      <div className='w-full flex flex-col items-center'>
        {
          storyData?.mediaType === "image" &&
          <div className='w-[90%] max-h-[600px]'>
            <img
              src={storyData?.media}
              className='w-full max-h-[600px] object-cover rounded-lg'
              alt="storyData"
            />
          </div>
        }
        {
          storyData?.mediaType === "video" &&
          <div className='w-full'>
            <VideoPlayer media={storyData?.media} />
          </div>
        }
      </div>

      <div className='absolute rounded-full top-1 left-0 w-full h-[7px] bg-gray-600/70'>
        <div className='w-[200px] h-full rounded-full bg-white/80 transition-all duration-500 ease-linear ' style={{ width: `${progress}%` }}>
        </div>
      </div>

      {storyData?.author?.userName == userData?.userName &&
        <div className='w-full flex items-center gap-[10px] h-20 bottom-0 left-0 p-6 text-white'>
          <div className='flex items-center gap-[10px] text-xl' > <FaEye className='h-5 w-5' /> {storyData?.viewers.length}</div>
          <div className='flex relative'>
            {
              storyData?.viewers.slice(0, 3).map((viewer, index) =>
                <div key={index} className={`w-8 h-8 rounded-full border-2 border-gray-950 cursor-pointer overflow-hidden ${index > 0 && 'absolute'} ${index == 1 && 'left-4'} ${index == 2 && 'left-8'} `}>
                  <img src={viewer?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                </div>
              )}
          </div>
        </div>
      }
    </div>
  )
}

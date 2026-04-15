import React, { useEffect, useRef, useState } from 'react'
import { SlVolume2, SlVolumeOff } from "react-icons/sl";
import maleDP from '../assets/dp.jpeg'
import FollowButton from './FollowButton';
import { useDispatch, useSelector } from 'react-redux';
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineComment } from "react-icons/md";
import { serverUrl } from '../App';
import axios from 'axios';
import { setLoopData } from '../redux/loopSlice';
import { FiSend } from "react-icons/fi";

export default function LoopCard({ loop }) {

    // console.log(loop);
    const videoRef = useRef();
    const commentRef = useRef();
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMute, setIsMute] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showHeart, setShowHeart] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState("");

    const { userData } = useSelector(state => state.user);
    const { loopData } = useSelector(state => state.loop);

    const dispatch = useDispatch();


    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            const video = videoRef.current;
            if (entry.isIntersecting) {
                video.play();
            }
            else {
                video.pause();
            }
        }, { threshold: 0.6 });

        if (videoRef.current) {

            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) observer.unobserve(videoRef.current);
        }
    }, [])


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (commentRef.current && !commentRef.current.contains(e.target)) {
                setShowComment(false);
            }
        }

        if (showComment) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [showComment])


    const handleClick = () => {
        if (isPlaying) {
            videoRef.current.pause();
        }
        else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (video) {
            const parcent = (video.currentTime / video.duration) * 100;
            setProgress(parcent);
        }
    }

    const handleLike = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/loops/like/${loop._id}`, {}, { withCredentials: true });
            const updatedLoop = result.data;

            const updatedLoops = loopData.map(singleLoop => singleLoop?._id == loop?._id ? updatedLoop : singleLoop);

            dispatch(setLoopData(updatedLoops));
        }
        catch (error) {
            console.log("error in like on loops handler", error);
        }
    }

    const handleComment = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/loops/comment/${loop._id}`, { text: comment }, { withCredentials: true });
            const updatedLoop = result.data;
            setComment("");
            const updatedLoops = loopData.map(singleLoop => singleLoop?._id == loop?._id ? updatedLoop : singleLoop);

            dispatch(setLoopData(updatedLoops));
        }
        catch (error) {
            console.log("error in like on loops handler", error);
        }
    }

    const handleLikeOnDoubleClick = () => {
        setShowHeart(true);
        !loop?.likes.includes(userData._id) ? handleLike() : null;

        setTimeout(() => {
            setShowHeart(false)
        },
            1500)
    };

    return (
        <div className='w-full h-screen lg:w-[480px] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hidden'>
            <div className='absolute top-1/2 left-1/3.5 transform -translate-x-1/3.5 -translate-y-1/2  z-50 '>
                {
                    showHeart &&
                    <GoHeartFill className='heart-animation h-[60px] w-[60px] md:h-[100px] md:w-[100px] text-red-400 drop-shadow-2xl' />
                }
            </div>

            <div ref={commentRef} className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px] rounded-t-4xl bg-gray-800/90 transform transition-transform duration-500 ease-in-out left-0 shadow-2xl shadow-black ${showComment ? "translate-y-0" : "translate-y-[100%]"}`}>
                <h1 className='text-center text-[20px] text-white font-semibold'>Comments</h1>

                {/* Remove items-center and justify-center from the main container */}
                <div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px] custom-scrollbar'>
                    {
                        loop?.comments.length === 0 ? (
                            /* Center only the "No Comment" message explicitly */
                            <div className='flex h-full w-full items-center justify-center text-center text-white/40 text-xl font-semibold'>
                                No Comment
                            </div>
                        ) : (
                            loop?.comments.map((com, index) => (
                                <div key={index} className='w-full flex flex-col gap-[5px] border-b-[2px] border-gray-700/20 pb-[10px] shrink-0'>
                                    <div className='flex justify-start items-center gap-[15px] md:gap-[20px]'>
                                        <div className='w-10 h-10 border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden'>
                                            <img src={com?.author?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                                        </div>
                                        <div className='w-[200px] font-semibold truncate text-white'>
                                            {com?.author?.userName}
                                        </div>
                                    </div>
                                    <div className='text-gray-300 pl-[55px] md:pl-[60px] break-words'>
                                        {com.text}
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>

                <div className='w-full h-[80px] fixed bottom-1 flex items-center justify-between px-[20px] py-[20px]'>
                    <div className='w-10 h-10 border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden'>
                        <img src={loop?.author?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                    </div>
                    <input onChange={(e) => setComment(e.target.value)} value={comment} type="text" placeholder='Write a comment...' className='px-[10px] text-white border-b border-b-gray-400 w-[90%] outline-none h-[40px] ' />
                    <button onClick={handleComment} className='absolute right-[20px] cursor-pointer'> <FiSend className='h-[25px] w-[25px] text-white' /> </button>
                </div>
            </div>

            <video onTimeUpdate={handleTimeUpdate} onClick={handleClick} ref={videoRef} onDoubleClick={handleLikeOnDoubleClick} autoPlay muted={isMute} loop src={loop?.media} className='w-full max-h-screen' />
            <div onClick={() => setIsMute(prev => !prev)} className='absolute top-[50px] right-[20px]'>
                {
                    !isMute ?
                        <SlVolume2 className='w-[30px] h-[30px] text-white font-semibold' />
                        :
                        <SlVolumeOff className='w-[30px] h-[30px] text-white font-semibold' />
                }
            </div>
            <div className='absolute rounded-full bottom-1 left-0 w-full h-[7px] bg-gray-600/70'>
                <div className='w-[200px] h-full rounded-full bg-white/80 transition-all duration-500 ease-linear ' style={{ width: `${progress}%` }}>
                </div>
            </div>

            <div className='w-full absolute h-[100px] bottom-[50px] px-[10px]'>
                <div className='flex  items-center gap-[10px] md:gap-[20px] mb-4'>
                    <div className='w-11 h-11 md:w-15 md:h-15 border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden'>
                        <img src={loop?.author?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                    </div>
                    <div className='max-w-[150px] text-white font-semibold truncate'>
                        {loop?.author?.userName}
                    </div>
                    {
                        userData?._id != loop?.author?._id &&
                        <FollowButton targetUserId={loop?.author?._id} tailwind={'px-[10px] py-[5px] text-white border text-[14px] rounded-xl border-white'} />
                    }
                </div>

                <div className='text-gray-300'>
                    {loop?.caption}
                </div>

                <div className='absolute flex flex-col right-0 gap-[20px] text-white bottom-[150px] justify-center px-[10px]'>
                    <div className='flex flex-col items-center'>
                        <div onClick={handleLike}>
                            {
                                loop?.likes.includes(userData?._id) ? <GoHeartFill className='h-[25px] w-[25px] md:h-[35px] md:w-[35px] text-red-500 cursor-pointer' /> : <GoHeart className='h-[25px] w-[25px] md:h-[35px] md:w-[35px] cursor-pointer' />
                            }
                        </div>
                        <div>{loop?.likes.length}</div>
                    </div>
                    <div className='flex flex-col items-center'>
                        <div onClick={() => setShowComment(true)}> <MdOutlineComment className='w-[25px] h-[25px] md:h-[35px] md:w-[35px] cursor-pointer' /> </div>
                        <div>{loop?.comments.length}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

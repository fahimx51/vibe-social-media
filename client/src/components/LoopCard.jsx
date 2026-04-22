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

    const videoRef = useRef();
    const commentRef = useRef();
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMute, setIsMute] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showHeart, setShowHeart] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState("");
    
    // New state for Read More functionality
    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_LENGTH = 100; 

    const { userData } = useSelector(state => state.user);
    const { loopData } = useSelector(state => state.loop);

    const dispatch = useDispatch();

    useEffect(() => {
        const currentVideo = videoRef.current;

        const observer = new IntersectionObserver(([entry]) => {
            const video = videoRef.current;
            if (!video) return;

            if (entry.isIntersecting) {
                video.play().catch((err) => {
                    if (err.name !== "AbortError") {
                        console.error("Playback failed:", err);
                    }
                });
            } else {
                video?.pause();
            }
        }, { threshold: 0.6 });

        if (currentVideo) {
            observer.observe(currentVideo);
        }

        return () => {
            if (currentVideo) {
                observer.unobserve(currentVideo);
            }
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (commentRef.current && !commentRef.current.contains(e.target)) {
                setShowComment(false);
            }
        }

        if (showComment) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showComment])

    const handleClick = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
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
        } catch (error) {
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
        } catch (error) {
            console.log("error in comment handler", error);
        }
    }

    const handleLikeOnDoubleClick = () => {
        setShowHeart(true);
        if (!loop?.likes.includes(userData._id)) handleLike();
        setTimeout(() => setShowHeart(false), 1500);
    };

    return (
        <div className='w-full h-screen md:w-[480px] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hidden'>
            {/* Heart Animation */}
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none'>
                {showHeart && <GoHeartFill className='heart-animation h-[100px] w-[100px] text-red-400 drop-shadow-2xl' />}
            </div>

            {/* Comment Sidebar/Bottom Sheet */}
            <div ref={commentRef} className={`absolute z- bottom-0 w-full h-[500px] p-[10px] rounded-t-4xl bg-gray-800/90 transform transition-transform duration-500 ease-in-out left-0 shadow-2xl shadow-black ${showComment ? "translate-y-0" : "translate-y-[100%]"}`}>
                <h1 className='text-center text-[20px] text-white font-semibold py-2'>Comments</h1>
                <div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px] custom-scrollbar px-2'>
                    {loop?.comments.length === 0 ? (
                        <div className='flex h-full w-full items-center justify-center text-white/40 text-xl font-semibold'>No Comment</div>
                    ) : (
                        loop?.comments.map((com, index) => (
                            <div key={index} className='w-full flex flex-col gap-[5px] border-b border-gray-700/50 pb-[10px]'>
                                <div className='flex items-center gap-[15px]'>
                                    <div className='w-8 h-8 border border-blue-400 rounded-full overflow-hidden'>
                                        <img src={com?.author?.profileImage || maleDP} alt="" className='w-full h-full object-cover' />
                                    </div>
                                    <div className='font-semibold text-white text-sm'>{com?.author?.userName}</div>
                                </div>
                                <div className='text-gray-300 pl-11 text-sm'>{com.text}</div>
                            </div>
                        ))
                    )}
                </div>
                <div className='w-full h-[80px] absolute bottom-0 flex items-center justify-between px-[20px] bg-gray-800'>
                    <input onChange={(e) => setComment(e.target.value)} value={comment} type="text" placeholder='Write a comment...' className='bg-transparent text-white border-b border-gray-400 w-[85%] outline-none h-[40px]' />
                    <button onClick={handleComment} className='cursor-pointer'><FiSend className='h-[25px] w-[25px] text-white' /></button>
                </div>
            </div>

            {/* Video Element */}
            <video onTimeUpdate={handleTimeUpdate} onClick={handleClick} ref={videoRef} onDoubleClick={handleLikeOnDoubleClick} autoPlay muted={isMute} loop src={loop?.media} className='w-full object-cover' />
            
            {/* Mute/Unmute Toggle */}
            <div onClick={() => setIsMute(prev => !prev)} className='absolute top-[50px] right-[20px] z-10 cursor-pointer'>
                {isMute ? <SlVolumeOff className='w-[30px] h-[30px] text-white' /> : <SlVolume2 className='w-[30px] h-[30px] text-white' />}
            </div>

            {/* Progress Bar */}
            <div className='absolute bottom-0 left-0 w-full h-[5px] bg-gray-600/50'>
                <div className='h-full bg-white transition-all duration-300 ease-linear' style={{ width: `${progress}%` }}></div>
            </div>

            {/* User Info & Caption Section */}
            <div className='w-full absolute bottom-[30px] px-[15px] z-10'>
                <div className='flex items-center gap-[15px] mb-3'>
                    <div className='w-12 h-12 border-2 border-blue-400 rounded-full overflow-hidden'>
                        <img src={loop?.author?.profileImage || maleDP} alt="" className='w-full h-full object-cover' />
                    </div>
                    <div className='text-white font-semibold truncate max-w-[120px]'>{loop?.author?.userName}</div>
                    {userData?._id != loop?.author?._id && <FollowButton targetUserId={loop?.author?._id} tailwind={'px-3 py-1 text-white border text-xs rounded-xl border-white hover:bg-white hover:text-black transition-all'} />}
                </div>

                {/* Read More Caption Implementation */}
                <div className='text-gray-200 text-sm md:text-base pr-[60px]'>
                    <span>
                        {loop?.caption?.length > MAX_LENGTH && !isExpanded
                            ? `${loop.caption.substring(0, MAX_LENGTH)}... `
                            : loop?.caption}
                    </span>
                    {loop?.caption?.length > MAX_LENGTH && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className='text-white font-bold cursor-pointer hover:underline'
                        >
                            {isExpanded ? ' Show less' : ' Read more'}
                        </button>
                    )}
                </div>
            </div>

            {/* Floating Interaction Sidebar */}
            <div className='absolute flex flex-col right-3 gap-[20px] text-white bottom-[120px] z-20 items-center'>
                <div className='flex flex-col items-center'>
                    <div onClick={handleLike}>
                        {loop?.likes.includes(userData?._id) ? <GoHeartFill className='h-[35px] w-[35px] text-red-500 cursor-pointer' /> : <GoHeart className='h-[35px] w-[35px] cursor-pointer' />}
                    </div>
                    <span className='text-xs mt-1'>{loop?.likes.length}</span>
                </div>
                <div className='flex flex-col items-center'>
                    <div onClick={() => setShowComment(true)}>
                        <MdOutlineComment className='h-[35px] w-[35px] cursor-pointer' />
                    </div>
                    <span className='text-xs mt-1'>{loop?.comments.length}</span>
                </div>
            </div>
        </div>
    )
}
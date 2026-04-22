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

    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_LENGTH = 50;

    const { userData } = useSelector(state => state.user);
    const { loopData } = useSelector(state => state.loop);
    const dispatch = useDispatch();

    useEffect(() => {
        const videoElement = videoRef.current;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                videoElement?.play().catch(() => { });
            } else {
                videoElement?.pause();
            }
        }, { threshold: 0.6 });

        if (videoElement) observer.observe(videoElement);
        return () => {
            if (videoElement) observer.unobserve(videoElement);
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
            const percent = (video.currentTime / video.duration) * 100;
            setProgress(percent);
        }
    }

    const handleLike = async (e) => {
        e?.stopPropagation();
        try {
            const result = await axios.post(`${serverUrl}/api/loops/like/${loop._id}`, {}, { withCredentials: true });
            const updatedLoop = result.data;
            const updatedLoops = loopData.map(l => l?._id === loop?._id ? updatedLoop : l);
            dispatch(setLoopData(updatedLoops));
        } catch (error) {
            console.log("error in like handler", error);
        }
    }

    const handleComment = async () => {
        if (!comment.trim()) return;
        try {
            const result = await axios.post(`${serverUrl}/api/loops/comment/${loop._id}`, { text: comment }, { withCredentials: true });
            const updatedLoop = result.data;
            setComment("");
            const updatedLoops = loopData.map(l => l?._id === loop?._id ? updatedLoop : l);
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
        <div className='w-full h-screen lg:w-[480px] flex items-center justify-center border-x-2 border-gray-800 relative overflow-hidden bg-black'>

            {/* Video Background */}
            <video
                onTimeUpdate={handleTimeUpdate}
                onClick={handleClick}
                ref={videoRef}
                onDoubleClick={handleLikeOnDoubleClick}
                autoPlay
                muted={isMute}
                loop
                src={loop?.media}
                className='w-full h-full object-contain'
            />

            {/* Interaction UI Layer (Username, Caption, Likes) */}
            {/* This layer fades out when comments are open to prevent conflicts */}
            <div className={`w-full absolute bottom-10 px-4 flex justify-between items-end z-10 transition-all duration-300 ${showComment ? 'opacity-0 pointer-events-none translate-y-5' : 'opacity-100 pointer-events-auto translate-y-0'}`}>

                {/* Left Side: Profile & Caption */}
                <div className='flex-1 pr-16'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='w-11 h-11 border-2 border-blue-400 rounded-full overflow-hidden shrink-0'>
                            <img src={loop?.author?.profileImage || maleDP} alt="" className='w-full h-full object-cover' />
                        </div>
                        <span className='text-white font-bold text-base truncate max-w-[120px]'>{loop?.author?.userName}</span>
                        {userData?._id !== loop?.author?._id && (
                            <FollowButton targetUserId={loop?.author?._id} tailwind={'px-3 py-1 text-white border border-white rounded-lg text-xs hover:bg-white hover:text-black transition-all'} />
                        )}
                    </div>

                    <div className='text-white text-sm md:text-base leading-relaxed'>
                        <span className='break-words'>
                            {loop?.caption?.length > MAX_LENGTH && !isExpanded
                                ? `${loop.caption.substring(0, MAX_LENGTH)}... `
                                : loop?.caption}
                        </span>
                        {loop?.caption?.length > MAX_LENGTH && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                                className='text-blue-500 hover:cursor-pointer font-bold ml-1  transition-colors'
                            >
                                {isExpanded ? 'show less' : 'see more'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Side: Like & Comment Icons */}
                <div className='flex flex-col gap-5 items-center pb-2'>
                    <div className='flex flex-col items-center'>
                        <div onClick={handleLike} className='p-2 bg-black/10 rounded-full cursor-pointer active:scale-90 transition-transform'>
                            {loop?.likes.includes(userData?._id) ?
                                <GoHeartFill className='w-8 h-8 md:w-9 md:h-9 text-red-500' /> :
                                <GoHeart className='w-8 h-8 md:w-9 md:h-9 text-white' />
                            }
                        </div>
                        <span className='text-white text-xs font-semibold mt-1'>{loop?.likes.length}</span>
                    </div>

                    <div className='flex flex-col items-center'>
                        <div onClick={(e) => { e.stopPropagation(); setShowComment(true); }} className='p-2 bg-black/10 rounded-full cursor-pointer active:scale-90 transition-transform'>
                            <MdOutlineComment className='w-8 h-8 md:w-9 md:h-9 text-white' />
                        </div>
                        <span className='text-white text-xs font-semibold mt-1'>{loop?.comments.length}</span>
                    </div>
                </div>
            </div>

            {/* Comment Drawer (Sits on top of everything else) */}
            <div ref={commentRef} className={`absolute z- bottom-0 w-full h-[500px] p-4 rounded-t-3xl bg-gray-900/95 backdrop-blur-md transform transition-transform duration-500 ease-in-out left-0 shadow-2xl ${showComment ? "translate-y-0" : "translate-y-full"}`}>
                <div className='w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-4 cursor-pointer' onClick={() => setShowComment(false)}></div>
                <h1 className='text-center text-xl text-white font-bold mb-4'>Comments</h1>

                <div className='w-full h-[320px] overflow-y-auto flex flex-col gap-4 custom-scrollbar px-2'>
                    {loop?.comments.length === 0 ? (
                        <div className='flex h-full w-full items-center justify-center text-gray-500'>No comments yet</div>
                    ) : (
                        loop?.comments.map((com, index) => (
                            <div key={index} className='w-full border-b border-gray-800/50 pb-3'>
                                <div className='flex items-center gap-3 mb-1'>
                                    <div className='w-8 h-8 rounded-full border border-blue-400 overflow-hidden shrink-0'>
                                        <img src={com?.author?.profileImage || maleDP} alt="" className='w-full h-full object-cover' />
                                    </div>
                                    <span className='font-semibold text-white text-sm'>{com?.author?.userName}</span>
                                </div>
                                <p className='text-gray-300 text-sm ml-11 break-words'>{com.text}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Fixed Comment Input at the bottom of the drawer */}
                <div className='absolute bottom-4 left-0 w-full px-4 flex items-center gap-3 bg-transparent'>
                    <input
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                        disable={comment.trim()}
                        type="text"
                        placeholder='Add a comment...'
                        className='flex-1 bg-gray-800 text-white rounded-full px-4 py-2.5 outline-none border border-gray-700 focus:border-blue-500 transition-all'
                    />
                    <button onClick={handleComment} className={`${!comment.trim() && 'opacity-40 hover:cursor-not-allowed' } p-2.5 bg-blue-600 rounded-full text-white hover:bg-blue-500 active:scale-90 transition-all`}>
                        <FiSend size={20} />
                    </button>
                </div>
            </div>

            {/* Other Overlays (Mute, Heart, Progress) */}
            <div onClick={() => setIsMute(prev => !prev)} className='absolute top-20 right-5 z-20 p-2 bg-black/20 rounded-full cursor-pointer'>
                {isMute ? <SlVolumeOff className='w-6 h-6 text-white' /> : <SlVolume2 className='w-6 h-6 text-white' />}
            </div>

            <div className='absolute bottom-0 left-0 w-full h-1 bg-gray-800 z-30'>
                <div className='h-full bg-white transition-all duration-300' style={{ width: `${progress}%` }}></div>
            </div>

            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none'>
                {showHeart && <GoHeartFill className='heart-animation h-[100px] w-[100px] text-red-500 drop-shadow-2xl' />}
            </div>
        </div>
    )
}
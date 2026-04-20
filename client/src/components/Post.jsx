import React, { useState } from 'react'
import maleDP from '../assets/dp.jpeg'
import VideoPlayer from './VideoPlayer'
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineComment } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { BsBookmarks, BsBookmarksFill } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import axios from 'axios';
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';
import { useEffect } from 'react';

export default function Post({ post }) {

    const { userData } = useSelector(state => state.user);
    const { socket } = useSelector(state => state.socket);
    const { postData } = useSelector(state => state.post);

    const navigate = useNavigate();

    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState("");
    const dispatch = useDispatch();

    const handleLike = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/posts/like/${post._id}`, {}, { withCredentials: true });
            const updatedPost = result.data;
            console.log(updatedPost);

            const updatedPosts = postData.map(p => p?._id == post?._id ? updatedPost : p);

            dispatch(setPostData(updatedPosts));
            dispatch(setUserData({ ...userData, savedPosts: updatedPosts }));
        }
        catch (error) {
            console.log("error in like handler", error);
        }
    }

    const handleComment = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/posts/comment/${post._id}`, { text: comment }, { withCredentials: true });
            const updatedPost = result.data;

            const updatedPosts = postData.map(p => p?._id == post?._id ? updatedPost : p);
            dispatch(setPostData(updatedPosts));
            dispatch(setUserData({ ...userData, savedPosts: updatedPosts }));
            setComment("");
        }
        catch (error) {
            console.log("error in comment handler", error);
        }
    }

    const handleSave = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/posts/saved/${post._id}`, {}, { withCredentials: true });
            dispatch(setUserData(result.data));
            console.log(result.data);
        }
        catch (error) {
            console.log("error in save handler", error);
        }
    }

    useEffect(() => {
        if (!socket) return;

        const handleLikedPost = (data) => {
            const updatedPosts = postData.map(p =>
                p._id === data.postId ? { ...p, likes: data.likes } : p
            );

            dispatch(setPostData(updatedPosts));
        };

        socket.on("likedPost", handleLikedPost);

        return () => {
            socket.off("likedPost", handleLikedPost);
        };
    }, [postData, socket, dispatch]); 


    return (
        <div className='w-[90%] min-h-[450px] flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl'>
            <div className='w-full h-[80px] flex justify-between items-center px-[10px]'>
                <div onClick={() => navigate(`/profile/${post?.author.userName}`)} className='cursor-pointer flex justify-center items-center gap-[15px] md:gap-[20px]'>
                    <div className='w-11 h-11 md:w-15 md:h-15 border-2 border-blue-400 rounded-full overflow-hidden'>
                        <img src={post?.author?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                    </div>
                    <div className='w-[200px] font-semibold truncate'>
                        {post?.author?.userName}
                    </div>
                </div>
                {
                    userData?._id != post.author._id &&
                    <FollowButton targetUserId={post.author._id} tailwind={'px-[10px] min-w-[60px] md:min-w-[80px] py-[5px] h-[30px] md:h-[40px] bg-gray-950 text-white rounded-2xl text-[14px] md:text-[16px]'} />

                }
            </div>


            <div className='w-full flex flex-col items-center'>
                {
                    post?.mediaType === "image" &&
                    <div className='w-[90%] max-h-[600px]'>
                        <img
                            src={post?.media}
                            className='w-full max-h-[600px] object-cover rounded-lg'
                            alt="post"
                        />
                    </div>
                }
                {
                    post?.mediaType === "video" &&
                    <div className='w-full'>
                        <VideoPlayer media={post?.media} />
                    </div>
                }
            </div>

            {
                post?.caption &&
                <div className='w-full px-[20px] gap-[10px] flex justify-start items-center'>
                    <div>
                        {post?.caption.slice(0, 50)}...
                        <button className='cursor-pointer text-blue-600 font-semibold' >Read More</button>
                    </div>
                </div>
            }

            <div className='w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px] '>
                <div className='flex items-center justify-center gap-[10px]'>
                    <div className='flex justify-center items-center gap-[5px]'>
                        {
                            post?.likes.includes(userData?._id) ? <GoHeartFill onClick={handleLike} className='h-[25px] w-[25px] text-red-500 cursor-pointer' /> : <GoHeart onClick={handleLike} className='h-[25px] w-[25px] cursor-pointer' />
                        }
                        <span>{post?.likes.length}</span>
                    </div>
                    <div onClick={() => setShowComment(!showComment)} className='flex justify-center items-center gap-[5px]'>
                        <MdOutlineComment className='h-[25px] w-[25px] cursor-pointer' />
                        <span>{post?.comments.length}</span>
                    </div>
                </div>
                <div onClick={handleSave}>
                    {
                        userData?.savedPosts?.some(id => (id._id || id) === post._id)
                            ? <BsBookmarksFill className='h-[25px] w-[25px] cursor-pointer text-blue-600' />
                            : <BsBookmarks className='h-[25px] w-[25px] cursor-pointer' />
                    }
                </div>
            </div>
            {
                showComment &&
                <div className='flex flex-col w-full pb-[20px]'>
                    <div className='w-full h-[80px] flex items-center justify-between px-[20px] relative'>
                        <div className='w-10 h-10 md:w-12 md:h-12 border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden' onClick={() => navigate(`/profile/${userData.userName}`)}>
                            <img src={post?.author?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                        </div>
                        <input onChange={(e) => setComment(e.target.value)} value={comment} type="text" placeholder='Write a comment...' className='px-[10px] border-b border-b-gray-400 w-[90%] outline-none h-[40px] ' />
                        <button onClick={handleComment} className='absolute right-[20px] cursor-pointer'> <FiSend className='h-[25px] w-[25px]' /> </button>
                    </div>

                    <div className='w-[90%] mx-auto overflow-auto'>
                        {
                            post.comments.map((comment, index) =>
                                <div key={index} className='w-full px-[20px] py-[20px] flex items-center flex items-center gap-[20px] border-b border-b-gray-100'>
                                    <div className='w-8 h-8 md:w-10 md:h-10 border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden' onClick={() => navigate(`/profile/${userData.userName}`)}>
                                        <img src={comment?.author?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                                    </div>
                                    <div>
                                        <p className='font-bold'>{comment.author.userName}</p>
                                        <p>{comment.text}</p>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            }

        </div>
    )
}

import React from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OnlineUsers from '../components/OnlineUsers';
import MessageCard from '../components/MessageCard';

export default function Messages() {
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.user)
    const { prevChatUsers } = useSelector(state => state.message)
    const { onlineUsers } = useSelector(state => state.socket)

    return (
        <div className='w-full min-h-screen flex flex-col gap-[20px] bg-gray-900 p-[10px]'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
                <IoArrowBack onClick={() => navigate(`/`)} className='text-white cursor-pointer w-8 h-8 lg:hidden' />
                <h1 className='text-white text-[20px] font-semibold'>Messages</h1>
            </div>

            <div className='w-full h-[80px] flex gap-[20px] justify-start items-center overflow-y-hidden overflow-x-auto p-[20px] border-b-2 border-gray-800'>
                {userData?.following.map((user, index) => (
                    onlineUsers?.includes(user._id) && <OnlineUsers key={index} user={user} />
                ))}
            </div>

            <div className='w-full h-full overflow-auto flex flex-col gap-[10px]'>
                {prevChatUsers?.map((chat, index) => (
                    chat?.participants.map(participant => (
                        participant._id != userData._id &&
                        <MessageCard key={index} participant={participant} msg={chat.messages[0]} />
                    ))
                ))}
            </div>

        </div>
    )
}

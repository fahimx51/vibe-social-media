import React, { useEffect } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OnlineUsers from '../components/OnlineUsers';
import MessageCard from '../components/MessageCard';
import { setMessages, setPrevChatsUsers } from '../redux/messageSlice';

export default function Messages() {
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.user)
    const { prevChatUsers, messages } = useSelector(state => state.message)
    const { onlineUsers, socket } = useSelector(state => state.socket)
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessage", (msg) => {
            dispatch(setMessages([...messages, msg]));

            if (prevChatUsers) {
                const updatedSidebar = prevChatUsers.map((chat) => {
                    const otherParticipant = chat.participants.find(p => p._id !== userData._id);

                    const isTargetChat = otherParticipant?._id === msg.receiver || otherParticipant?._id === msg.sender;

                    if (isTargetChat) {
                        return {
                            ...chat,
                            messages: [msg], 
                            updatedAt: msg.updatedAt
                        };
                    }
                    return chat;
                });

                // 3. Sort by most recent
                const sortedSidebar = [...updatedSidebar].sort((a, b) =>
                    new Date(b.updatedAt) - new Date(a.updatedAt)
                );

                dispatch(setPrevChatsUsers(sortedSidebar));
            }
        });

        return () => socket.off("newMessage");
    }, [socket, messages, prevChatUsers, dispatch, userData._id]);

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

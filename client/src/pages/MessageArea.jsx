import React, { useEffect, useRef, useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import maleDP from '../assets/dp.jpeg'
import { IoImageOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMessages, setPrevChatsUsers } from '../redux/messageSlice';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';

export default function MessageArea() {

    const navigate = useNavigate();

    const { selectedUser, messages, prevChatUsers } = useSelector(state => state.message);
    const { userData } = useSelector(state => state.user);
    const { socket } = useSelector(state => state.socket);

    const [input, setInput] = useState("");
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const imageInputRef = useRef();
    const dispatch = useDispatch();

    const scrollRef = useRef();

    const getAllMessages = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/message/getAllMessages/${selectedUser._id}`, { withCredentials: true });
            console.log(result.data.messages);
            dispatch(setMessages(result.data.messages));
        }
        catch (error) {
            console.log("Get all messages error", error);
            dispatch(setMessages([]));
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        getAllMessages();
    }, []);

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

                const sortedSidebar = [...updatedSidebar].sort((a, b) =>
                    new Date(b.updatedAt) - new Date(a.updatedAt)
                );

                dispatch(setPrevChatsUsers(sortedSidebar));
            }
        });

        return () => socket.off("newMessage");
    }, [socket, messages, prevChatUsers, dispatch, userData._id]);


    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("text", input);

            if (backendImage) {
                formData.append("image", backendImage);
            }

            const result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, { withCredentials: true });

            dispatch(setMessages([...messages, result.data]));

            if (prevChatUsers) {
                const updatedSidebar = prevChatUsers.map((chat) => {
                    const isTargetChat = chat.participants.some(p => p._id === selectedUser._id);

                    if (isTargetChat) {
                        return {
                            ...chat,
                            messages: [result.data]
                        };
                    }
                    return chat;
                }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                dispatch(setPrevChatsUsers(updatedSidebar));
            }

            setInput("");
            setBackendImage(null);
            setFrontendImage(null);
        }
        catch (error) {
            console.log("HandleSendMessage error", error);
        }
    }


    return (
        <div className='w-full h-screen bg-gray-900 relative'>
            <div className='flex h-18 items-center gap-[15px] px-[10px] py-[10px] fixed top-0 z-100 w-full bg-gray-900/40'>
                <div className=' h-[80px] flex items-center gap-[20px] px-[20px]'>
                    <IoArrowBack onClick={() => navigate(`/`)} className='text-white cursor-pointer w-8 h-8' />
                </div>
                <div className='w-12 h-12 border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden'>
                    <img src={selectedUser?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                </div>

                <div className='text-white text-[18px] font-semibold'>
                    <div>{selectedUser.userName}</div>
                    <div className='text-[12px] text-gray-400'>{selectedUser.name}</div>
                </div>
            </div>

            <div className='w-full h-[92%] pt-[100px] pb-[120px] lg:pb-[150px] px-[40px] flex flex-col gap-[20px] overflow-auto bg-gray-900'>
                {
                    messages.length > 0 ? messages.map((msg, index) =>
                        msg.sender == userData._id ?
                            <SenderMessage key={index} msg={msg} />
                            :
                            <ReceiverMessage key={index} msg={msg} />
                    )
                        :
                        <div className='text-gray-600 font-black text-3xl w-full h-screen flex items-center justify-center'>
                            No Messages
                        </div>
                }
                <div ref={scrollRef} />
            </div>

            <div className='w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-gray-900 z-100'>
                <form onSubmit={handleSendMessage} className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-gray-950 flex items-center gap-[10px] px-[20px] relative'>
                    {
                        frontendImage &&
                        <div className='w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden'>
                            <img src={frontendImage} alt="" className='h-full object-cover' />
                        </div>
                    }

                    <input onChange={handleImage} type="file" accept='image/*' ref={imageInputRef} className='hidden' />
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text"
                        placeholder='Write a message...'
                        className='w-full h-full px-[20px] text-[18px] text-white outline-0'
                    />

                    <div className='flex items-center gap-[20px]'>
                        <IoImageOutline onClick={() => imageInputRef.current.click()} className='w-[28px] h-[28px] text-white' />
                        <button
                            disabled={!input.trim() && !frontendImage}
                            className={`${!input.trim() && !frontendImage ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'} bg-gradient-to-br from-[#b80099] to-[#1f01cc] h-10 w-10 flex items-center justify-center rounded-full`}
                        >
                            <IoIosSend className='w-6 h-6 text-white' />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

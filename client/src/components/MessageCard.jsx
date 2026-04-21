import React from 'react'
import maleDP from '../assets/dp.jpeg'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedUser } from '../redux/messageSlice';

export default function MessageCard({ participant, msg }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { onlineUsers } = useSelector(state => state.socket)

    return (
        <div
            onClick={() => {
                dispatch(setSelectedUser(participant));
                navigate('/message-area')
            }}
            className='w-full rounded-2xl bg-gray-950/20 p-[20px] flex items-center cursor-pointer gap-3'
        >
            <div className='w-12.5 h-12.5 relative border-1 border-blue-400 rounded-full overflow-hidden shrink-0'
            >
                <img src={participant?.profileImage || maleDP} alt="" className='h-full w-full object-cover object-center' />

                {onlineUsers?.includes(participant._id) && <div className='w-[14px] h-[14px] bg-green-400 border-2 border-gray-900 rounded-full absolute bottom-[4px] right-[3px]'></div>}
            </div >
            <div className='truncate'>
                <p className='text-white font-semibold'>{participant?.userName}</p>
                <p className='text-gray-500 truncate'>{msg.message || "[Image]"}</p>
            </div>
        </div>
    )
}

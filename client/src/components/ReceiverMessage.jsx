import React from 'react'

export default function ReceiverMessage({ msg }) {
    return (
        <div className='w-fit max-w-[60%] bg-gray-800 rounded-t-2xl rounded-br-2xl rounded-br-0 px-[10px] py-[10px] relative mr-auto left-0 flex flex-col gap-[10px]'>
            {
                msg?.image &&
                <img src={msg.image} alt="" className='h-[200px] object-cover rounded-2xl' />
            }

            <p className='text-[16px] text-white wrap-break-word'>{msg.message}</p>
        </div>
    )
}

import React, { useRef, useState } from 'react'
import { SlVolume2, SlVolumeOff } from "react-icons/sl";

export default function VideoPlayer({ media }) {

    const videoTag = useRef();
    const [mute, setMute] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleVideoClick = () => {
        if (isPlaying) {
            videoTag.current.pause();
            setIsPlaying(false);
        }
        else {
            videoTag.current.play();
            setIsPlaying(true);
        }
    }

    return (
        <div className='h-[100%] w-full relative cursor-pointer max-w-full rounded-2xl overflow-hidden'>
            <video onClick={handleVideoClick} ref={videoTag} src={media} autoPlay loop muted={mute} className='h-full w-full cursor-pointer w-full object-cover rounded-2xl'>
            </video>

            <div onClick={() => setMute(prev => !prev)} className='absolute bottom-[10px] right-[10px]'>
                {
                    !mute ?
                        <SlVolume2 className='w-[20px] h-[20px] text-white font-semibold' />
                        :
                        <SlVolumeOff className='w-[20px] h-[20px] text-white font-semibold' />
                }
            </div>


        </div>
    )
}

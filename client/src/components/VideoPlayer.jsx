import React, { useEffect, useRef, useState } from 'react'
import { SlVolume2, SlVolumeOff } from "react-icons/sl";

export default function VideoPlayer({ media }) {

    const videoTag = useRef();
    const [mute, setMute] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);


    useEffect(() => {
        // 1. Create a local variable for the ref to use in the cleanup function
        const currentVideo = videoTag.current;

        const observer = new IntersectionObserver(([entry]) => {
            const video = videoTag.current;

            // Safety Check: Ensure the video element actually exists
            if (!video) return;

            if (entry.isIntersecting) {
                // Play returns a promise; we MUST catch errors like 'AbortError'
                video.play().catch((err) => {
                    if (err.name !== "AbortError") {
                        console.error("Playback failed:", err);
                    }
                });
            } else {
                // Use optional chaining for extra safety
                video?.pause();
            }
        }, { threshold: 0.6 });

        if (currentVideo) {
            observer.observe(currentVideo);
        }

        return () => {
            // Use the local variable to disconnect properly
            if (currentVideo) {
                observer.unobserve(currentVideo);
            }
            observer.disconnect(); // Fully stop the observer
        };
    }, []);

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

import React, { useEffect, useRef } from 'react'

export default function LoopCard({ loop }) {

    const videoRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            const video = videoRef.current;
            if (entry.isIntersecting) {
                video.play();
            }
            else {
                video.pause();
            }
        }, { threshold: 0.6 });

        if (videoRef.current) {

            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) observer.unobserve(videoRef.current);
        }
    }, [])

    return (
        <div className='w-full h-screen lg:w-[480px] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative'>
            <video ref={videoRef} autoPlay muted loop src={loop?.media} className='w-full max-h-screen' />
        </div>
    )
}

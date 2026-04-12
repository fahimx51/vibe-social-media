import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
import { BsPlusSquare } from "react-icons/bs";
import VideoPlayer from '../components/VideoPlayer';
import axios from 'axios';
import { serverUrl } from '../App';

export default function Upload() {

    const navigate = useNavigate();
    const [uploadType, setUploadType] = useState("Post");
    const [frontendMedia, setFrontendMedia] = useState(null);
    const [backendMedia, setBackendMedia] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [caption, setCaption] = useState("");

    const mediaInput = useRef();

    const handleMediaOnChange = async (e) => {
        const file = e.target.files[0];

        if (file.type.includes("image")) {
            setMediaType("image");
        }
        else {
            setMediaType("video");
        }
        setBackendMedia(file);
        setFrontendMedia(URL.createObjectURL(file));
    };

    const uploadPost = async () => {
        try {
            const formData = new FormData();
            formData.append("text", caption);
            formData.append("mediaType", mediaType);
            formData.append("media", backendMedia);

            const result = await axios.post(`${serverUrl}/api/posts/upload`, formData, { withCredentials: true });

            console.log(result);
        }
        catch (error) {
            console.log("error occur when upload post", error.message);
        }
    };
    const uploadStory = async () => {
        try {
            const formData = new FormData();
            formData.append("mediaType", mediaType);
            formData.append("media", backendMedia);

            const result = await axios.post(`${serverUrl}/api/story/upload`, formData, { withCredentials: true });

            console.log(result);
        }
        catch (error) {
            console.log("error occur when upload post", error.message);
        }
    };

    const uploadLoop = async () => {
        try {
            const formData = new FormData();

            formData.append("text", caption);
            formData.append("media", backendMedia);

            const result = await axios.post(`${serverUrl}/api/loops/upload`, formData, { withCredentials: true });

            console.log(result);
        }
        catch (error) {
            console.log("error occur when upload post", error.message);
        }
    };

    const handleUpload = () => {
        if (uploadType === 'Post') {
            uploadPost();
        }
        else if (uploadType === 'Story') {
            uploadStory();
        }
        else {
            uploadLoop();
        }
    }

    return (
        <div className='w-full h-screen bg-gray-950 flex flex-col items-center'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
                <IoArrowBack onClick={() => navigate(`/`)} className='text-white cursor-pointer w-9 h-9' />
                <h1 className='text-white text-[20px] font-semibold'>Upload Media</h1>
            </div>

            <div className='w-[90%] max-w-[600px] h-[80px] bg-white/90 rounded-full flex justify-around items-center gap-[10px]'>
                <input type="file" hidden ref={mediaInput} onChange={handleMediaOnChange} />
                <div
                    onClick={() => setUploadType("Post")}
                    className={`${uploadType === "Post" ? "bg-gray-950 rounded-full text-white shadow-2xl shadow-gray-950" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-gray-950 rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-gray-950`}
                >
                    Post
                </div>

                <div
                    onClick={() => setUploadType("Story")}
                    className={`${uploadType === "Story" ? "bg-gray-950 rounded-full text-white shadow-2xl shadow-gray-950" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-gray-950 rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-gray-950`}
                >
                    Story
                </div>

                <div
                    onClick={() => setUploadType("Loop")}
                    className={`${uploadType === "Loop" ? "bg-gray-950 rounded-full text-white shadow-2xl shadow-gray-950" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-gray-950 rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-gray-950`}
                >
                    Loop
                </div>

            </div>

            {
                !frontendMedia &&
                <div
                    onClick={() => mediaInput.current.click()}
                    className='w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]'
                >
                    <BsPlusSquare className='text-white w-[30px] h-[30px] cursor-pointer' />
                    <div className='text-white text-[19px] font-semibold'>
                        Upload {uploadType}
                    </div>
                </div>
            }

            {
                frontendMedia &&
                <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]'>
                    {
                        mediaType === "image" &&
                        <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                            <img src={frontendMedia} className='h-[100%] object-cover rounded-2xl' />
                            {
                                uploadType !== "Story" &&
                                <input
                                    type="text"
                                    placeholder='Enter a caption'
                                    required
                                    className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]'
                                />
                            }
                        </div>
                    }
                    {
                        mediaType === "video" &&
                        <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                            <VideoPlayer media={frontendMedia} />
                            {
                                uploadType !== "Story" &&
                                <input
                                    onChange={(e) => setCaption(e.target.value)}
                                    value={caption}
                                    type="text"
                                    placeholder='Enter a caption'
                                    required
                                    className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]'
                                />
                            }
                        </div>
                    }

                </div>
            }
            {
                frontendMedia &&
                <button
                    onClick={handleUpload}
                    className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white mt-[50px] cursor-pointer rounded-2xl font-semibold'>
                    Upload {uploadType}
                </button>
            }

        </div>
    )
}

import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
import { BsPlusSquare } from "react-icons/bs";
import VideoPlayer from '../components/VideoPlayer';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setPostData } from '../redux/postSlice';
import { setStoryData } from '../redux/storySlice';
import { setLoopData } from '../redux/loopSlice';
import { ClipLoader } from "react-spinners"

export default function Upload() {

    const navigate = useNavigate();
    const [uploadType, setUploadType] = useState("Post");
    const [frontendMedia, setFrontendMedia] = useState(null);
    const [backendMedia, setBackendMedia] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);

    const mediaInput = useRef();

    const dispatch = useDispatch();

    const { postData } = useSelector(state => state.post);
    const { storyData } = useSelector(state => state.story);
    const { loopData } = useSelector(state => state.loop);

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
            formData.append("caption", caption);
            formData.append("mediaType", mediaType);
            formData.append("media", backendMedia);

            const result = await axios.post(`${serverUrl}/api/posts/upload`, formData, { withCredentials: true });

            dispatch(setPostData([...postData, result.data]));

            console.log(result);
            navigate('/');
        }
        catch (error) {
            console.log("error occur when upload post", error.message);
        }
        finally {
            setLoading(false);
        }
    };
    const uploadStory = async () => {

        try {
            const formData = new FormData();
            formData.append("mediaType", mediaType);
            formData.append("media", backendMedia);

            const result = await axios.post(`${serverUrl}/api/story/upload`, formData, { withCredentials: true });

            dispatch(setStoryData([...storyData, result.data]))
            console.log(result);
            navigate('/');
        }
        catch (error) {
            console.log("error occur when upload post", error.message);
        }
        finally {
            setLoading(false);
        }
    };

    const uploadLoop = async () => {

        try {
            const formData = new FormData();

            formData.append("caption", caption);
            formData.append("media", backendMedia);

            const result = await axios.post(`${serverUrl}/api/loops/upload`, formData, { withCredentials: true });

            dispatch(setLoopData([...loopData, result.data]));

            console.log(result);
            navigate('/');
        }
        catch (error) {
            console.log("error occur when upload post", error.message);
        }
        finally {
            setLoading(false);
        }
    };

    const handleUpload = () => {
        setLoading(true);

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
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
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
                    {
                        loading ? <ClipLoader size={30} color='black' /> :
                            `Upload ${uploadType}`
                    }
                </button>
            }

        </div>
    )
}

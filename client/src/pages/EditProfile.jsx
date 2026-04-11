import React, { useRef, useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import maleDP from '../assets/dp.jpeg'
import axios from 'axios';
import { serverUrl } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice';
import { ClipLoader } from "react-spinners"

export default function EditProfile() {

    const { userData } = useSelector(state => state.user);
    const navigate = useNavigate();
    const imageInput = useRef();
    const dispatch = useDispatch();

    const [frontendImage, setFrontendImage] = useState(userData.profileImage || maleDP);
    const [backendImage, setBackendImage] = useState(null);
    const [name, setName] = useState(userData.name || "");
    const [userName, setUserName] = useState(userData.userName || "");
    const [bio, setBio] = useState(userData.bio || "");
    const [profession, setProfession] = useState(userData.profession || "");
    const [gender, setGender] = useState(userData.gender || "");

    const [loading, setLoading] = useState(false);


    const handleImageChange = (e) => {
        const file = e.target.files[0];

        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    };

    const handleEditProfile = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('userName', userName);
            formData.append('bio', bio);
            formData.append('profession', profession);
            formData.append('gender', gender);

            if (backendImage) {
                formData.append('profileImage', backendImage);
            }

            const result = await axios.post(`${serverUrl}/api/user/editProfile`, formData, { withCredentials: true });
            dispatch(setProfileData(result.data));
            dispatch(setUserData(result.data));

            navigate(`/profile/${userName}`)
        }

        catch (error) {
            console.log("Edit profile handler error : ", error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen bg-gray-950 flex items-center flex-col gap-[20px]'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
                <IoArrowBack onClick={() => navigate(`/profile/${userData?.userName}`)} className='text-white cursor-pointer w-9 h-9' />
                <h1 className='text-white text-[20px] font-semibold'>Edit Profile</h1>
            </div>

            <div
                onClick={() => imageInput.current.click()}
                className='w-15 h-15 md:h-25 md:w-25 border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden'
            >
                <input type="file" accept='image/*' ref={imageInput} hidden onChange={handleImageChange} />
                <img src={frontendImage} alt="" className='w-full h-full object-cover' />
            </div>

            <div onClick={() => imageInput.current.click()} className='text-blue-500 text-center text-[18px] font-semibold cursor-pointer'>
                Change your profile picture
            </div>

            <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                className='w-[90%] max-w-[600px] h-[60px] bg-gray-900 border-2 border-gray-800 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:gray-200'
                placeholder='Enter your name'
                value={name}
            />
            <input
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                className='w-[90%] max-w-[600px] h-[60px] bg-gray-900 border-2 border-gray-800 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:gray-200'
                placeholder='Enter your username'
                value={userName}
            />
            <input
                onChange={(e) => setBio(e.target.value)}
                type="text"
                className='w-[90%] max-w-[600px] h-[60px] bg-gray-900 border-2 border-gray-800 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:gray-200'
                placeholder='Enter your Bio'
                value={bio}
            />
            <input
                onChange={(e) => setProfession(e.target.value)}
                type="text"
                className='w-[90%] max-w-[600px] h-[60px] bg-gray-900 border-2 border-gray-800 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:gray-200'
                placeholder='Enter your profession'
                value={profession}
            />
            <input
                onChange={(e) => setGender(e.target.value)}
                type="text"
                className='w-[90%] max-w-[600px] h-[60px] bg-gray-900 border-2 border-gray-800 rounded-2xl text-white font-semibold px-[20px] outline-none placeholder:gray-200'
                placeholder='Enter your gender'
                value={gender}
            />

            <button onClick={handleEditProfile} className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white cursor-pointer rounded-2xl'>
                {loading ? <ClipLoader size={30} color='black' /> : "Save Profile"}
            </button>

        </div>
    )
}

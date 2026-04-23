import React, { useRef, useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import maleDP from '../assets/dp.jpeg'
import axios from 'axios';
import { serverUrl } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice';
import { ClipLoader } from "react-spinners";
import toast from 'react-hot-toast';

export default function EditProfile() {
    const { userData } = useSelector(state => state.user);
    const navigate = useNavigate();
    const imageInput = useRef();
    const dispatch = useDispatch();

    // States
    const [frontendImage, setFrontendImage] = useState(userData?.profileImage || maleDP);
    const [backendImage, setBackendImage] = useState(null);
    const [name, setName] = useState(userData?.name || "");
    const [userName, setUserName] = useState(userData?.userName || "");
    const [bio, setBio] = useState(userData?.bio || "");
    const [profession, setProfession] = useState(userData?.profession || "");
    const [gender, setGender] = useState(userData?.gender || ""); // Expecting "Male" or "Female"

    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files;
        if (file) {
            setBackendImage(file);
            setFrontendImage(URL.createObjectURL(file));
        }
    };

    const handleEditProfile = async () => {
        setLoading(true);
        const toastId = toast.loading("Updating your vibe...");
        
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

            toast.success("Profile updated successfully!", { id: toastId });
            navigate(`/profile/${userName}`);
        }
        catch (error) {
            console.log("Edit profile handler error: ", error);
            toast.error(error.response?.data?.message || "Failed to update profile", { id: toastId });
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full min-h-screen bg-gray-950 flex items-center flex-col gap-6 pb-10'>
            {/* Header */}
            <div className='w-full h-[80px] flex items-center gap-5 px-5'>
                <IoArrowBack 
                    onClick={() => navigate(`/profile/${userData?.userName}`)} 
                    className='text-white cursor-pointer w-8 h-8 hover:text-blue-400 transition-colors' 
                />
                <h1 className='text-white text-xl font-bold uppercase tracking-wider'>Edit Profile</h1>
            </div>

            {/* Profile Image Section */}
            <div className='flex flex-col items-center gap-3'>
                <div
                    onClick={() => imageInput.current.click()}
                    className='w-24 h-24 md:w-32 md:h-32 border-4 border-blue-500 rounded-full cursor-pointer overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                >
                    <input type="file" accept='image/*' ref={imageInput} hidden onChange={handleImageChange} />
                    <img src={frontendImage} alt="Profile" className='w-full h-full object-cover' />
                </div>
                <div onClick={() => imageInput.current.click()} className='text-blue-500 text-sm font-semibold cursor-pointer hover:underline'>
                    Change profile picture
                </div>
            </div>

            {/* Form Fields */}
            <div className='w-[90%] max-w-[600px] flex flex-col gap-5'>
                
                {/* Name */}
                <div className='flex flex-col gap-2'>
                    <label className='text-gray-400 text-xs font-bold uppercase ml-2'>Full Name</label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        className='w-full h-14 bg-gray-900 border-2 border-gray-800 rounded-2xl text-white px-5 outline-none focus:border-blue-500 transition-all'
                        placeholder='Your name'
                        value={name}
                    />
                </div>

                {/* Username */}
                <div className='flex flex-col gap-2'>
                    <label className='text-gray-400 text-xs font-bold uppercase ml-2'>Username</label>
                    <input
                        onChange={(e) => setUserName(e.target.value)}
                        type="text"
                        className='w-full h-14 bg-gray-900 border-2 border-gray-800 rounded-2xl text-white px-5 outline-none focus:border-blue-500 transition-all'
                        placeholder='Username'
                        value={userName}
                    />
                </div>

                {/* Bio */}
                <div className='flex flex-col gap-2'>
                    <label className='text-gray-400 text-xs font-bold uppercase ml-2'>Bio</label>
                    <textarea
                        onChange={(e) => setBio(e.target.value)}
                        className='w-full h-24 bg-gray-900 border-2 border-gray-800 rounded-2xl text-white p-5 outline-none focus:border-blue-500 transition-all resize-none'
                        placeholder='Tell the world your vibe...'
                        value={bio}
                    />
                </div>

                {/* Profession */}
                <div className='flex flex-col gap-2'>
                    <label className='text-gray-400 text-xs font-bold uppercase ml-2'>Profession</label>
                    <input
                        onChange={(e) => setProfession(e.target.value)}
                        type="text"
                        className='w-full h-14 bg-gray-900 border-2 border-gray-800 rounded-2xl text-white px-5 outline-none focus:border-blue-500 transition-all'
                        placeholder='What do you do?'
                        value={profession}
                    />
                </div>

                {/* Gender Radio Group */}
                <div className='flex flex-col gap-2'>
                    <label className='text-gray-400 text-xs font-bold uppercase ml-2'>Gender</label>
                    <div className='flex gap-4'>
                        <label className={`flex-1 flex items-center justify-center h-14 rounded-2xl cursor-pointer border-2 transition-all ${gender === 'Male' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-gray-800 bg-gray-900 text-gray-500'}`}>
                            <input 
                                type="radio" 
                                name="gender" 
                                value="Male" 
                                checked={gender === 'Male'} 
                                onChange={(e) => setGender(e.target.value)} 
                                className="hidden" 
                            />
                            <span className='font-bold'>Male</span>
                        </label>

                        <label className={`flex-1 flex items-center justify-center h-14 rounded-2xl cursor-pointer border-2 transition-all ${gender === 'Female' ? 'border-pink-500 bg-pink-500/10 text-white' : 'border-gray-800 bg-gray-900 text-gray-500'}`}>
                            <input 
                                type="radio" 
                                name="gender" 
                                value="Female" 
                                checked={gender === 'Female'} 
                                onChange={(e) => setGender(e.target.value)} 
                                className="hidden" 
                            />
                            <span className='font-bold'>Female</span>
                        </label>
                    </div>
                </div>

                {/* Action Button */}
                <button 
                    onClick={handleEditProfile} 
                    disabled={loading}
                    className='mt-4 w-full h-14 bg-white hover:bg-gray-200 text-black font-bold rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center'
                >
                    {loading ? <ClipLoader size={25} color='black' /> : "SAVE PROFILE"}
                </button>
            </div>
        </div>
    )
}
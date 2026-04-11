import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData, setUserData } from '../redux/userSlice';
import { IoArrowBack } from "react-icons/io5";
import maleDP from '../assets/dp.jpeg'
import Navbar from '../components/Navbar';


export default function Profile() {

    const { userName } = useParams();
    const dispatch = useDispatch();
    const { profileData, userData } = useSelector(state => state.user);
    const navigate = useNavigate();


    const handleProfile = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/getProfile/${userName}`, { withCredentials: true });
            dispatch(setProfileData(result.data));
        }
        catch (error) {
            console.log("Getting profile info error :", error.message);
        }
    }


    useEffect(() => {
        handleProfile();
    }, [userName, dispatch]);


    const handleLogout = async () => {
        try {
            await axios.post(`${serverUrl}/api/auth/signOut`, {}, { withCredentials: true });
            dispatch(setUserData(null));
        }
        catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='w-full min-h-screen bg-gray-950'>
            <div className='w-full h-[80px] flex justify-between items-center px-[30px] text-white'>
                <div onClick={() => navigate('/')} ><IoArrowBack className='w-9 h-9 cursor-pointer' /></div>
                <div className='font-semibold text-[20px]'>{profileData?.userName}</div>
                <div onClick={handleLogout} className='font-semibold cursor-pointer text-[20px] text-blue-600'>Logout</div>
            </div>

            <div className='w-full h-[150px] flex items-start gap-[20px] lg:gap-[30px] pt-[20px] px-[10px] justify-center'>
                <div className='w-15 h-15 md:h-25 md:w-25 border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden'>
                    <img src={profileData?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                </div>
                <div>
                    <div className='font-semibold text-[16px] md:text-[22px] text-white'>{profileData?.name}</div>
                    <div className='text-[12px] md:text-[15px] text-gray-300'>{profileData?.profession || "New User"}</div>
                    <div className='text-[12px] md:text-[15px] text-gray-300'>{profileData?.bio}</div>
                </div>
            </div>

            <div className='w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px] text-white'>
                <div>
                    <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.posts?.length}</div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Posts</div>
                </div>

                <div>
                    <div className='flex items-center justify-center gap-[40px]'>
                        <div className='flex relative'>
                            <div className='w-10 h-10 rounded-full border-2 border-gray-950 cursor-pointer overflow-hidden'>
                                <img src={profileData?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                            </div>
                            <div className='w-10 h-10 absolute left-4 border-2 border-gray-950 rounded-full cursor-pointer overflow-hidden'>
                                <img src={profileData?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                            </div>
                            <div className='w-10 h-10 absolute left-8 border-2 border-gray-950 rounded-full cursor-pointer overflow-hidden'>
                                <img src={profileData?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                            </div>
                        </div>
                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.followers?.length}</div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Followers</div>
                </div>

                <div>
                    <div className='flex items-center justify-center gap-[40px]'>
                        <div className='flex relative'>
                            <div className='w-10 h-10 rounded-full border-2 border-gray-950 cursor-pointer overflow-hidden'>
                                <img src={profileData?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                            </div>
                            <div className='w-10 h-10 absolute left-4 border-2 border-gray-950 rounded-full cursor-pointer overflow-hidden'>
                                <img src={profileData?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                            </div>
                            <div className='w-10 h-10 absolute left-8 border-2 border-gray-950 rounded-full cursor-pointer overflow-hidden'>
                                <img src={profileData?.profileImage || maleDP} alt="" className='w-full h-full object-cover object-center' />
                            </div>
                        </div>
                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.following?.length}</div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Following</div>
                </div>
            </div>

            <div className='w-full h-[80px] flex justify-center items-center gap-[20px] mt-4'>
                {
                    profileData?._id === userData?._id &&
                    <button onClick={() => navigate('/edit-profile')} className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl '>Edit Profile</button>
                }

                {
                    profileData?._id != userData?._id &&

                    <>
                        <button className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl '>Follow</button>
                        <button className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl '>Message</button>
                    </>
                }
            </div>

            <div className='w-full min-h-screen flex justify-center'>
                <div className='w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px]'>
                    <Navbar />
                </div>
            </div>
        </div>
    )
}

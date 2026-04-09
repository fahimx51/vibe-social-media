import React from 'react'
import logo_white from '../assets/logo_white.png'
import { FaRegHeart } from 'react-icons/fa'
import maleDP from '../assets/dp.jpeg'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice'

export default function LeftHome() {

    const { userData } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signOut`, {}, { withCredentials: true });
            dispatch(setUserData(null));
        }
        catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='w-[25%] hidden lg:block min-h-screen bg-gray-950 border-r-2 border-gray-900 px-5'>
            <div className='w-full h-[100px] flex items-center justify-between'>
                <img src={logo_white} alt="" className='w-20' />
                <div>
                    <FaRegHeart className='w-[25px] h-[25px] text-white cursor-pointer' />
                </div>
            </div>

            <div className='flex items-center justify-between gap-2.5 w-full'>
                <div className='flex items-center gap-[10px]'>
                    <div className='w-15 h-15 border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden'>
                        <img src={userData?.profileImage || maleDP} alt="" className='w-full object-cover object-center' />
                    </div>
                    <div>
                        <div className='text-[18px] text-white font-semibold'>{userData.name}</div>
                        <div className='text-[15px] text-gray-400'> {userData.userName} </div>
                    </div>
                </div>
                <div onClick={handleLogout} className='text-blue-500 font-semibold cursor-pointer'>
                    Logout
                </div>
            </div>
        </div >
    )
}

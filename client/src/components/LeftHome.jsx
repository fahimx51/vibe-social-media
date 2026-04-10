import React from 'react'
import logo_white from '../assets/logo_white.png'
import { FaRegHeart } from 'react-icons/fa'
import maleDP from '../assets/dp.jpeg'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice'
import OtherUser from './OtherUser'

export default function LeftHome() {

    const { userData, suggestedUsers } = useSelector(state => state.user);
    const dispatch = useDispatch();


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
        <div className='w-[25%] hidden lg:block min-h-screen bg-gray-950 border-r-2 border-gray-900 px-5'>
            <div className='w-full h-[100px] flex items-center justify-between'>
                <img src={logo_white} alt="" className='w-20' />
                <div>
                    <FaRegHeart className='w-[25px] h-[25px] text-white cursor-pointer' />
                </div>
            </div>

            <div className='flex items-center justify-between gap-2.5 w-full border-b-2 border-b-gray-900 py-3.5'>
                <div className='flex items-center gap-[10px]'>
                    <div className='w-12 h-12 border-2 border-blue-400 rounded-full cursor-pointer overflow-hidden'>
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

            <div className='w-full flex flex-col gap-5 p-5 '>
                <h1 className='text-white text-lg'>Suggested Users</h1>
                {
                    suggestedUsers && suggestedUsers.slice(0, 3).map((user) => {
                        return <OtherUser key={user._id} user={user} />
                    })
                }
            </div>

        </div >
    )
}

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchData } from '../redux/userSlice';
import maleDP from '../assets/dp.jpeg' // Import your default DP

export default function Search() {
    const [input, setInput] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    // Get the search results from Redux
    const { searchData } = useSelector(state => state.user);

    const handleSubmit = async (e) => {
        e?.preventDefault();

        if (!input.trim()) {
            dispatch(setSearchData([]));
            return;
        }

        setLoading(true); // Start loading
        try {
            const result = await axios.get(`${serverUrl}/api/user/search?keyword=${input}`, { withCredentials: true });
            dispatch(setSearchData(result.data));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Stop loading regardless of success or error
        }
    }

    useEffect(() => {
        // Only search if there is text
        if (input.trim()) {
            const delayDebounceFn = setTimeout(() => {
                handleSubmit();
            }, 300); // 300ms debounce saves your server from crashing!

            return () => clearTimeout(delayDebounceFn);
        } else {
            dispatch(setSearchData([]));
        }
    }, [input])

    return (
        <div className='w-full min-h-screen bg-gray-950 flex items-center flex-col gap-[20px]'>
            {/* Header */}
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
                <IoArrowBack onClick={() => navigate(`/`)} className='text-white cursor-pointer w-6 h-6 lg:w-8 lg:h-8' />
                <h1 className='text-white text-xl font-bold'>Search Users</h1>
            </div>

            {/* Search Input */}
            <div className='w-full h-[80px] flex items-center justify-center'>
                <form onSubmit={handleSubmit} className='w-[90%] max-w-[800px] h-[80%] rounded-full flex items-center px-5 relative'>
                    <FiSearch className='text-white w-[25px] h-[25px] absolute left-10 z-10' />
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        placeholder='Search by name or username...'
                        className='bg-gray-800/50 text-white outline-0 px-15 rounded-full w-full h-full border border-gray-700 focus:border-blue-500 transition-all'
                    />
                </form>
            </div>

            {/* --- Loader --- */}
            {loading && (
                <div className='flex items-center justify-center mt-10'>
                    <div className='w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                </div>
            )}

            {/* --- Results Section --- */}
            {!loading && (
                <div className='w-[90%] max-w-[800px] flex flex-col gap-4 mt-4'>
                    {searchData && searchData.length > 0 ? (
                        searchData.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => navigate(`/profile/${user.userName}`)}
                                className='w-full p-4 bg-gray-900/50 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-gray-800 transition-all border border-gray-800'
                            >
                                <div className='w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500/30'>
                                    <img
                                        src={user.profileImage || maleDP}
                                        alt={user.userName}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-white font-bold text-lg'>@{user.userName}</span>
                                    <span className='text-gray-400 text-sm'>{user.name}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        input.trim() && <p className='text-gray-500 text-center mt-10'>No users found.</p>
                    )}
                </div>
            )}

            {/* --- Results Section --- */}
            <div className='w-[90%] max-w-[800px] flex flex-col gap-4 mt-4'>
                {searchData && searchData.length > 0 ? (
                    searchData.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => navigate(`/profile/${user.userName}`)}
                            className='w-full p-4 bg-gray-900/50 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-gray-800 transition-all border border-gray-800'
                        >
                            {/* Profile Image */}
                            <div className='w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500/30'>
                                <img
                                    src={user.profileImage || maleDP}
                                    alt={user.userName}
                                    className='w-full h-full object-cover'
                                />
                            </div>

                            {/* User Info */}
                            <div className='flex flex-col'>
                                <span className='text-white font-bold text-lg'>@{user.userName}</span>
                                <span className='text-gray-400 text-sm'>{user.name}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    input.trim() && <p className='text-gray-500 text-center mt-10'>No users found with that name.</p>
                )}
            </div>
        </div>
    )
}
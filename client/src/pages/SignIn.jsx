import React, { useState } from 'react'
import logo_black from '../assets/logo_black.png'
import logo_white from '../assets/logo_white.png'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from "react-spinners"
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

export default function SignIp() {
    const [inputClicked, setInputClicked] = useState({
        name: false,
        username: false, // Standardized to match input id
        email: false,
        password: false
    });

    const [showPassword, setShowPassword] = useState(false);

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();

    // Reusable function to handle focus/blur logic
    const handleToggleLabel = (field, isFocused, value) => {
        setInputClicked(prev => ({
            ...prev,
            [field]: isFocused || value.length > 0
        }));
    };


    const handleSignIn = async () => {

        setLoading(true);
        setError(null);

        try {
            const result = await axios.post(`${serverUrl}/api/auth/signIn`, { userName, password }, { withCredentials: true });
            dispatch(setUserData(result.data.user));
            console.log(result.data.user);
        }
        catch (error) {
            console.log('Internal error :', error.response?.data?.message);
            setError(error.response?.data?.message);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
            <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]'>

                {/* Left Side   */}
                <div className='w-full lg:w-[50%] h-full bg-white flex flex-col justify-center items-center p-[10px] gap-[5px]'>

                    <div className='flex gap-[10px] items-center text-[20px] font-semibold mt-[40px] mb-5'>
                        <span>Sign In to</span>
                        <img src={logo_black} alt="Vibe Logo" className='w-[70px]' />
                    </div>

                    {/* 2. Username Field */}
                    <div className='relative w-[90%] h-[50px] mt-[5px] border-2 border-black rounded-2xl mb-4'>
                        <label htmlFor="username" className={`absolute left-[20px] bg-white px-1 text-gray-700 transition-all duration-300 ease-in-out pointer-events-none ${inputClicked.username ? 'top-[-12px] text-[13px] z-10' : 'top-[12px] text-[15px] z-0'}`}>
                            Enter your username
                        </label>
                        <input
                            type="text" id="username" required
                            onChange={(e) => setUserName(e.target.value)}
                            onFocus={() => handleToggleLabel('username', true, '')}
                            onBlur={(e) => handleToggleLabel('username', false, e.target.value)}
                            className='w-full h-full rounded-2xl px-[20px] outline-none border-0 bg-transparent'
                        />
                    </div>

                    {/* 4. Password Field */}
                    <div className='relative w-[90%] h-[50px] mt-[5px] border-2 border-black rounded-2xl flex items-center mb-4'>
                        <label htmlFor="password" className={`absolute left-[20px] bg-white px-1 text-gray-700 transition-all duration-300 ease-in-out pointer-events-none ${inputClicked.password ? 'top-[-12px] text-[13px] z-10' : 'top-[12px] text-[15px] z-0'}`}>
                            Enter your password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"} id="password" required
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => handleToggleLabel('password', true, '')}
                            onBlur={(e) => handleToggleLabel('password', false, e.target.value)}
                            className='w-full h-full rounded-2xl pl-[20px] pr-[50px] outline-none border-0 bg-transparent'
                        />
                        <div
                            className='absolute right-[20px] cursor-pointer text-gray-600'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
                        </div>
                    </div>

                    {/* Forgot Password Link Container */}
                    <div className='w-[90%] flex justify-start mb-4'>
                        <Link
                            to='/forgot-password'
                            className='text-sm text-gray-600 hover:underline hover:text-blue-700 px-[5px]'
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Error  */}
                    {
                        error && <p className='mb-3 text-red-600'>{error}</p>
                    }
                    <button
                        onClick={handleSignIn}
                        disabled={loading}
                        className='w-[90%] h-[50px] bg-[#1a1f23] text-white rounded-2xl font-semibold text-[16px] hover:bg-black transition duration-300 cursor-pointer mb-4'>
                        {loading ? <ClipLoader size={25} color='white' /> : "Sign In "}
                    </button>

                    <p className='text-gray-800 text-sm'>Don't have an account? <Link to='/signUp' className='text-blue-700 hover:border-b font-semibold'>Sign Up</Link></p>
                </div>

                {/* Right side decoration */}
                <div className='lg:w-[50%] h-full hidden lg:flex flex-col gap-[10px] justify-center items-center bg-black rounded-l-[30px] shadow-2xl text-white font-semibold'>
                    <img src={logo_white} alt="Vibe Logo" className='w-[50%]' />
                    <p>Your world, your rhythm, your people</p>
                </div>
            </div>
        </div>
    )
}
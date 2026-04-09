import React, { useState } from 'react'
import logo_black from '../assets/logo_black.png'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';

export default function SignUp() {
    const [inputClicked, setInputClicked] = useState({
        name: false,
        username: false, // Standardized to match input id
        email: false,
        password: false
    });

    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    // Reusable function to handle focus/blur logic
    const handleToggleLabel = (field, isFocused, value) => {
        setInputClicked(prev => ({
            ...prev,
            [field]: isFocused || value.length > 0
        }));
    };


    const handleSignUp = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signUp`, { name, userName, email, password }, { withCredentials: true });
            console.log(result.data);
        }
        catch (error) {
            console.log('Internal error', error.message);
        }
    };

    return (
        <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
            <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]'>

                <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] gap-[20px]'>

                    <div className='flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]'>
                        <span>Sign Up to</span>
                        <img src={logo_black} alt="Vibe Logo" className='w-[70px]' />
                    </div>

                    {/* 1. Name Field */}
                    <div className='relative w-[90%] h-[50px] mt-[20px] border-2 border-black rounded-2xl'>
                        <label htmlFor="name" className={`absolute left-[20px] bg-white px-1 text-gray-700 transition-all duration-300 ease-in-out pointer-events-none ${inputClicked.name ? 'top-[-12px] text-[13px] z-10' : 'top-[12px] text-[15px] z-0'}`}>
                            Enter your name
                        </label>
                        <input
                            type="text" id="name" required
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => handleToggleLabel('name', true, '')}
                            onBlur={(e) => handleToggleLabel('name', false, e.target.value)}
                            className='w-full h-full rounded-2xl px-[20px] outline-none border-0 bg-transparent'
                        />
                    </div>

                    {/* 2. Username Field */}
                    <div className='relative w-[90%] h-[50px] mt-[5px] border-2 border-black rounded-2xl'>
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

                    {/* 3. Email Field */}
                    <div className='relative w-[90%] h-[50px] mt-[5px] border-2 border-black rounded-2xl'>
                        <label htmlFor="email" className={`absolute left-[20px] bg-white px-1 text-gray-700 transition-all duration-300 ease-in-out pointer-events-none ${inputClicked.email ? 'top-[-12px] text-[13px] z-10' : 'top-[12px] text-[15px] z-0'}`}>
                            Enter your email
                        </label>
                        <input
                            type="email" id="email" required
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => handleToggleLabel('email', true, '')}
                            onBlur={(e) => handleToggleLabel('email', false, e.target.value)}
                            className='w-full h-full rounded-2xl px-[20px] outline-none border-0 bg-transparent'
                        />
                    </div>

                    {/* 4. Password Field */}
                    <div className='relative w-[90%] h-[50px] mt-[5px] border-2 border-black rounded-2xl flex items-center'>
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

                    <button
                        onClick={handleSignUp}
                        className='w-[90%] h-[50px] bg-[#1a1f23] text-white rounded-2xl mt-[20px] font-semibold text-[16px] hover:bg-black transition duration-300 cursor-pointer'>
                        Sign Up
                    </button>

                    <p className='text-gray-800 text-sm'>Already have an account? <a href="/login" className='text-blue-500 hover:underline'>Sign In</a></p>
                </div>

                {/* Right side decoration */}
                <div className='lg:w-[50%] h-full hidden lg:flex justify-center items-center bg-black rounded-l-[30px] shadow-2xl'>
                    {/* Put an image or text here later */}
                </div>
            </div>
        </div>
    )
}
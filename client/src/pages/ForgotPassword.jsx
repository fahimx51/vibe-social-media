import axios from 'axios';
import React, { useState } from 'react'
import { ClipLoader } from "react-spinners"
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [inputClicked, setInputClicked] = useState({

        email: false,
        otp: false,
        password: false,
        confirmPassword: false

    });

    const navigate = useNavigate();

    const handleToggleLabel = (field, isFocused, value) => {
        setInputClicked(prev => ({
            ...prev,
            [field]: isFocused || value.length > 0
        }));
    };


    const handleStep1 = async () => {

        setLoading(true);
        setError(null);

        try {
            const result = await axios.post(`${serverUrl}/api/auth/sendOtp`, { email }, { withCredentials: true });
            console.log(result.data);
            setStep(2);
        }

        catch (error) {
            console.log(error.response?.data?.message);
            setError(error.response?.data?.message);
        }

        finally {
            setLoading(false);
        }
    };

    const handleStep2 = async () => {

        setLoading(true);
        setError(null);

        try {

            const result = await axios.post(`${serverUrl}/api/auth/verifyOtp`, { email, otp }, { withCredentials: true });
            console.log(result.data);

            setStep(3);
        }

        catch (error) {
            console.log(error.response?.data?.message);
            setError(error.response?.data?.message);
        }

        finally {
            setLoading(false);
        }
    };

    const handleStep3 = async () => {

        setLoading(true);
        setError(null);

        try {
            if (password !== confirmPassword) {
                return setError("Password doesn't matched!");
            }

            const result = await axios.post(`${serverUrl}/api/auth/resetPassword`, { email, password }, { withCredentials: true });
            console.log(result.data);
            navigate('/signIn');
        }
        catch (error) {
            console.log(error.response?.data?.message);
            setError(error.response?.data?.message);
        }

        finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'>

            {/* STEP-1  */}

            {
                step === 1 && <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex flex-col justify-center items-center border-[#1a1f23]'>

                    <h2 className='text-[30px] font-semibold mb-4'>Forgot Password</h2>

                    {/* 3. Email Field */}
                    <div className='relative w-[90%] h-[50px] mt-[5px] border-2 border-black rounded-2xl mb-4'>
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

                    {
                        error && <p className='mb-3 text-red-600'>{error}</p>
                    }

                    <button
                        onClick={handleStep1}
                        disabled={loading}
                        className='w-[90%] h-[50px] bg-[#1a1f23] text-white rounded-2xl font-semibold text-[16px] hover:bg-black transition duration-300 cursor-pointer mb-4'>
                        {loading ? <ClipLoader size={25} color='white' /> : "Send OTP"}
                    </button>
                </div>
            }

            {/* STEP-2  */}

            {
                step === 2 && <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex flex-col justify-center items-center border-[#1a1f23]'>

                    <h2 className='text-[30px] font-semibold mb-4'>Verify OTP</h2>

                    {/* 3. OTP Field */}
                    <div className='relative w-[90%] h-[50px] mt-[5px] border-2 border-black rounded-2xl mb-4'>
                        <label htmlFor="otp" className={`absolute left-[20px] bg-white px-1 text-gray-700 transition-all duration-300 ease-in-out pointer-events-none ${inputClicked.otp ? 'top-[-12px] text-[13px] z-10' : 'top-[12px] text-[15px] z-0'}`}>
                            Enter your OTP
                        </label>
                        <input
                            type="text" id="otp" required
                            onChange={(e) => setOtp(e.target.value)}
                            onFocus={() => handleToggleLabel('otp', true, '')}
                            onBlur={(e) => handleToggleLabel('otp', false, e.target.value)}
                            className='w-full h-full rounded-2xl px-[20px] outline-none border-0 bg-transparent'
                        />

                    </div>

                    {
                        error && <p className='mb-3 text-red-600'>{error}</p>
                    }

                    <button
                        onClick={handleStep2}
                        disabled={loading}
                        className='w-[90%] h-[50px] bg-[#1a1f23] text-white rounded-2xl font-semibold text-[16px] hover:bg-black transition duration-300 cursor-pointer mb-4'>
                        {loading ? <ClipLoader size={25} color='white' /> : "Submit"}
                    </button>
                </div>
            }

            {/* STEP-3 */}


            {
                step === 3 && <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex flex-col justify-center items-center border-[#1a1f23]'>

                    <h2 className='text-[30px] font-semibold mb-4'>Reset Password</h2>

                    {/* Password Field  */}

                    <div className='relative w-[90%] h-[50px] mt-[5px] border-2 border-black rounded-2xl mb-4'>
                        <label htmlFor="password" className={`absolute left-[20px] bg-white px-1 text-gray-700 transition-all duration-300 ease-in-out pointer-events-none ${inputClicked.password ? 'top-[-12px] text-[13px] z-10' : 'top-[12px] text-[15px] z-0'}`}>
                            Enter a new password
                        </label>
                        <input
                            minLength={6}
                            type="text" id="password" required
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => handleToggleLabel('password', true, '')}
                            onBlur={(e) => handleToggleLabel('password', false, e.target.value)}
                            className='w-full h-full rounded-2xl px-[20px] outline-none border-0 bg-transparent'
                        />

                    </div>

                    {/* Confirm Password Field  */}

                    <div className='relative w-[90%] h-[50px] border-2 border-black rounded-2xl mb-5'>
                        <label htmlFor="password" className={`absolute left-[20px] bg-white px-1 text-gray-700 transition-all duration-300 ease-in-out pointer-events-none ${inputClicked.confirmPassword ? 'top-[-12px] text-[13px] z-10' : 'top-[12px] text-[15px] z-0'}`}>
                            Confirm password
                        </label>
                        <input
                            minLength={6}
                            type="text" id="password" required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={() => handleToggleLabel('confirmPassword', true, '')}
                            onBlur={(e) => handleToggleLabel('confirmPassword', false, e.target.value)}
                            className='w-full h-full rounded-2xl px-[20px] mb-2 outline-none border-0 bg-transparent'
                        />

                    </div>

                    {
                        error && <p className='mb-3 text-red-600'>{error}</p>
                    }

                    <button
                        onClick={handleStep3}
                        disabled={loading}
                        className='w-[90%] h-[50px] bg-[#1a1f23] text-white rounded-2xl font-semibold text-[16px] hover:bg-black transition duration-300 cursor-pointer mb-4'>
                        {loading ? <ClipLoader size={25} color='white' /> : "Submit"}
                    </button>
                </div>
            }



        </div>
    )
}

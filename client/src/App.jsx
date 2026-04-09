import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import { useSelector } from 'react-redux'
import GetCurrentUser from './hooks/GetCurrentUser'

export const serverUrl = "http://localhost:8000"

export default function App() {

  GetCurrentUser();

  const { userData, isCheckingAuth } = useSelector(state => state.user);


  if (isCheckingAuth) {
    return <div className="h-screen flex items-center justify-center bg-black text-white">Loading Vibe...</div>;
  }

  return (
    <Routes>
      {/* If userData exists, REDIRECT to "/", otherwise show SignIn */}
      <Route path='/signIn' element={userData ? <Navigate to="/" /> : <SignIn />} />

      {/* If userData exists, REDIRECT to "/", otherwise show SignUp */}
      <Route path='/signUp' element={userData ? <Navigate to="/" /> : <SignUp />} />

      <Route path='/forgot-password' element={userData ? <Navigate to="/" /> : <ForgotPassword />} />

      {/* Main Home Route */}
      <Route path='/' element={userData ? <Home /> : <Navigate to="/signIn" />} />

      {/* Optional: Catch-all route for 404s */}
      <Route path='*' element={<Navigate to="/" />} />
    </Routes>
  )
}

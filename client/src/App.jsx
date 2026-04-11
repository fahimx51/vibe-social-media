import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import { useSelector } from 'react-redux'
import GetCurrentUser from './hooks/GetCurrentUser'
import GetSuggestedUser from './hooks/GetSuggestedUser'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'

export const serverUrl = "http://localhost:8000"

export default function App() {

  GetCurrentUser();
  GetSuggestedUser();

  const { userData, isCheckingAuth } = useSelector(state => state.user);


  if (isCheckingAuth) {
    return <div className="h-screen flex items-center justify-center bg-black text-white">Loading Vibe...</div>;
  }

  return (
    <Routes>

      <Route path='/signIn' element={userData ? <Navigate to="/" /> : <SignIn />} />

      <Route path='/signUp' element={userData ? <Navigate to="/" /> : <SignUp />} />

      <Route path='/forgot-password' element={userData ? <Navigate to="/" /> : <ForgotPassword />} />

      <Route path='/' element={userData ? <Home /> : <Navigate to="/signIn" />} />

      <Route path='*' element={<Navigate to="/" />} />

      <Route path='/profile/:userName' element={userData ? <Profile /> : <Navigate to="/signIn" />} />
      <Route path='/edit-profile' element={userData ? <EditProfile /> : <Navigate to="/signIn" />} />

    </Routes>
  )
}

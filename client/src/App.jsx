import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import { useDispatch, useSelector } from 'react-redux'
import GetCurrentUser from './hooks/GetCurrentUser'
import GetSuggestedUser from './hooks/GetSuggestedUser'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Upload from './pages/Upload'
import GetAllPost from './hooks/GetAllPost'
import Loops from './pages/Loops'
import GetAllLoops from './hooks/GetAllLoops'
import Story from './pages/Story'
import GetAllStory from './hooks/GetAllStory'
import Messages from './pages/Messages'
import MessageArea from './pages/MessageArea'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { setOnlineUsers, setSocket } from './redux/socketSlice'
import GetPrevChatUsers from './hooks/GetPrevChatUsers'

export const serverUrl = "http://localhost:8000"

export default function App() {

  const { userData, isCheckingAuth } = useSelector(state => state.user);
  const { socket } = useSelector(state => state.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {

      const socketIo = io(serverUrl, {
        query: {
          userId: userData?._id
        }
      });

      dispatch(setSocket(socketIo));

      socketIo.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users));
      })

      return () => socket.close();
    }
    else {
      if (socket) {
        socket?.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData])

  GetCurrentUser();
  GetSuggestedUser();
  GetAllPost();
  GetAllLoops();
  GetAllStory();
  GetPrevChatUsers();


  if (isCheckingAuth) {
    return <div className="h-screen flex items-center justify-center bg-gray-900 text-white">Loading Vibe...</div>;
  }

  return (
    <Routes>

      <Route path='/signIn' element={userData ? <Navigate to="/" /> : <SignIn />} />

      <Route path='/signUp' element={userData ? <Navigate to="/" /> : <SignUp />} />

      <Route path='/forgot-password' element={userData ? <Navigate to="/" /> : <ForgotPassword />} />

      <Route path='/' element={userData ? <Home /> : <Navigate to="/signIn" />} />

      <Route path='*' element={<Navigate to="/" />} />

      <Route path='/profile/:userName' element={userData ? <Profile /> : <Navigate to="/signIn" />} />

      <Route path='/story/:userName' element={userData ? <Story /> : <Navigate to="/signIn" />} />

      <Route path='/upload' element={userData ? <Upload /> : <Navigate to="/signIn" />} />

      <Route path='/edit-profile' element={userData ? <EditProfile /> : <Navigate to="/signIn" />} />

      <Route path='/loops' element={userData ? <Loops /> : <Navigate to="/signIn" />} />

      <Route path='/messages' element={userData ? <Messages /> : <Navigate to="/signIn" />} />

      <Route path='/message-area' element={userData ? <MessageArea /> : <Navigate to="/signIn" />} />

    </Routes>
  )
}

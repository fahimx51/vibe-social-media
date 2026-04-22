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
import Search from './pages/Search'
import GetAllNotification from './hooks/GetAllNotification'
import Notification from './pages/Notification'
import { setNotificationData } from './redux/notificationSlice'
import { Toaster } from 'react-hot-toast'

export const serverUrl = "http://localhost:8000"

export default function App() {

  const { userData, isCheckingAuth } = useSelector(state => state.user);
  const { socket } = useSelector(state => state.socket);
  const { notificationData } = useSelector(state => state.notification);

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

      return () => socket?.close();
    }
    else {
      if (socket) {
        socket?.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData, dispatch]);



  useEffect(() => {
    if (!socket) return;

    const handleNotification = (noti) => {

      dispatch(setNotificationData([noti, ...notificationData]));
    };

    socket.on("newNotification", handleNotification);

    return () => socket.off("newNotification", handleNotification);
  }, [socket, dispatch]);

  GetCurrentUser();
  GetSuggestedUser();
  GetAllPost();
  GetAllLoops();
  GetAllStory();
  GetPrevChatUsers();
  GetAllNotification();


  if (isCheckingAuth) {
    return <div className="h-screen flex flex-col items-center justify-center bg-gray-900 gap-4">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
      <p className="text-gray-400 font-mono tracking-[0.2em] animate-pulse uppercase text-xs">
        Loading Vibe...
      </p>
    </div>
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#f3f4f6', 
            color: '#111827',      
            border: '1px solid #e5e7eb', 
            fontWeight: '500',
            fontSize: '15px',
            padding: '12px 24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#22c55e', // Tailwind green-500
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444', // Tailwind red-500
              secondary: '#fff',
            },
          },
        }}
      />
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
        <Route path='/search' element={userData ? <Search /> : <Navigate to="/signIn" />} />
        <Route path='/notification' element={userData ? <Notification notificationData={notificationData} /> : <Navigate to="/signIn" />} />

      </Routes>
    </>
  )
}

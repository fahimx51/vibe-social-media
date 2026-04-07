import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'

export default function App() {
  return (
    <Routes>
      <Route path='/signIn' element={<SignIn />} />
      <Route path='/signUp' element={<SignUp />} />
    </Routes>
  )
}

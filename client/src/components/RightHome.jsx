import React from 'react'
import Messages from '../pages/Messages'

export default function RightHome() {
  return (
    <div className='w-[25%] hidden lg:block min-h-screen bg-gray-950 border-l-2 border-gray-900'>
      <Messages />
    </div>
  )
}

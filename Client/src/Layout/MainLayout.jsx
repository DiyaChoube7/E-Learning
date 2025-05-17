import Navbar from '@/components/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar/>
      <div className='flex-1 mt-2'>
        <Outlet/>
      </div>
    </div>
  )
}

export default MainLayout

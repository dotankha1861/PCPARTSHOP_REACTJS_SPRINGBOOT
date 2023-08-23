import React from 'react'
import { Outlet } from 'react-router-dom'

const Section = () => {
  return (
    <div className=' mt-16 h-screen'>
      <Outlet/>
    </div>
  )
}

export default Section;
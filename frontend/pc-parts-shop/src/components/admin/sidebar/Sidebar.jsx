import React, { forwardRef } from 'react'
import FuncsSidebar from './FuncsSidebar'

const Sidebar = (props, ref) => {
  return (
    <aside className='fixed top-0 left-0 min-w-[17%] h-screen text-gray-100 flex flex-col items-center gap-2 bg-slate-800'>
      <h1 className='text-[2rem] leading-none font-bold drop-shadow-md mt-3'>PCPartsShop</h1>
      <FuncsSidebar ref={ref}/>
    </aside>
  )
}

export default forwardRef(Sidebar);

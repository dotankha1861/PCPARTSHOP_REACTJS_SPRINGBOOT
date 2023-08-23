import React, { useEffect, useRef } from 'react'
import CardAccountUser from './CardAccountUser';

const Navigation = ({listItemAcount}) => {
  const threeDotMenu = useRef();

  const handleToggle = (e) => {
    if (threeDotMenu.current?.contains(e.target)) {
      listItemAcount.current.toggle();
    }
    else if (listItemAcount.current.getToggle()) listItemAcount.current.toggle();
  }

  useEffect(() => {
    document.addEventListener('click', handleToggle);
    return () => document.removeEventListener('click', handleToggle);
  });

  return (
    <nav className='fixed top-0 right-0 w-screen h-14 bg-neutral-50 shadow-lg'>
      <div className='flex justify-end'>
        <div className='p-1 ml-auto rounded-md flex items-center justify-end font-serif gap-2 '>
          <CardAccountUser ref={threeDotMenu} />
        </div>
      </div>
    </nav>
  )
}

export default Navigation;

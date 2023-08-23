import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { MdClose } from 'react-icons/md'

const Modal = ({ children, title, onExit }, ref) => {
  const [display, setDisplay] = useState();
  useImperativeHandle(ref, () => ({
    show: () => setDisplay(() => true),
    hide: () => {
      setDisplay(() => false);
      if(onExit) onExit();
    },
    isDisplay: () => display
  }));

  const handleClickExit = () => {
    setDisplay(() => false);
    if(onExit) onExit();
  }

  return (
    <div>
      {display &&
        <div className='fixed opacity-100 w-screen h-screen top-0 left-0 flex justify-center items-center flex-col z-50 rounded-md'>
          <div className='fixed bg-[rgba(241,245,249,0.9)] w-screen h-screen top-0 left-0'></div>
          <div className='flex flex-col gap-1 rounded-sm shadow-2xl drop-shadow-xl bg-white max-w-[100%] max-h-[100%]'>
            <div className='p-2 bg-slate-700 flex'>
              <div className='text-white'>{title}</div>
              <MdClose size={20} color='white' className='ml-auto text opacity-90' onClick={handleClickExit} />
            </div>
            <div className='overflow-y-auto'>
              {children}
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default forwardRef(Modal);
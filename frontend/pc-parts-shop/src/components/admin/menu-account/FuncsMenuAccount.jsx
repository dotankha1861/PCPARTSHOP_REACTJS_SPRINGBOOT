import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../Modal';
import { useDispatch } from 'react-redux';
import { logoutStart } from '../../../redux/slices/authSlice';

const ListItemAccount = ({clearActiveLinkSideBar}, ref) => {
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();
  const modalLogout = useRef();
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    toggle: () => handleToggle(),
    getToggle: () => toggle
  }));

  const handleClickProfile = () => {
    clearActiveLinkSideBar();
    navigate("/admin/profile");
  };

  const handleClickLogOut = () => {
    modalLogout.current.show();
  };

  const handleToggle = () => {
    setToggle(() => !toggle);
  }

  const handleClickAgreeLogOut = () => {
    dispatch(logoutStart({navigate, page: "ADMIN", hide: () => modalLogout.current.hide()}));
  }

  return (
    <div>
      
      {toggle &&
        <div className='fixed right-0 top-14 w-fit h-fit bg-neutral-100 mt-1'>
          <ul className='flex flex-col justify-start rounded-md shadow-md overflow-hidden'>
            <li className='hover:text-gray-70 hover:bg-neutral-200 py-2 px-5' onClick={handleClickProfile}>
              Thông tin cá nhân
            </li>
            <li className='hover:text-gray-70 hover:bg-neutral-200 py-2 px-5'
              onClick={handleClickLogOut}>
              Đăng xuất
            </li>
          </ul>
        </div>
      }
      <Modal ref={modalLogout}>
        <div className='py-5 px-20 flex flex-col gap-3 justify-start items-center shadow-md overflow-hidden'>
          <div className='font-bold'>Bạn chắc chắn muốn đăng xuất?</div>
          <div className='flex gap-3 my-4'>
          <button className='middle none center mr-4 rounded-lg bg-red-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
              onClick={() => modalLogout.current.hide()}
            >&nbsp;&nbsp;Hủy&nbsp;&nbsp;</button>
            <button className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
              onClick={handleClickAgreeLogOut}>
              Đồng ý</button>
    
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default forwardRef(ListItemAccount);
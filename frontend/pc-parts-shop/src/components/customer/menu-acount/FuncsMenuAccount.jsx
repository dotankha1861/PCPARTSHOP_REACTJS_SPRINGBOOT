import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from '../../Modal'; 
import { logoutStart } from '../../../redux/slices/authSlice';
import { resetCart } from '../../../redux/slices/cartSlice';

const FuncsMenuAccount = (props, ref) => {
    const [toggle, setToggle] = useState(false);
    const dispatch = useDispatch();
    const modalLogout = useRef();
    const navigate = useNavigate();
  
    useImperativeHandle(ref, () => ({
      toggle: () => handleToggle(),
      getToggle: () => toggle
    }));
  
    const handleClickProfile = () => {
    //   clearActiveLinkSideBar();
      navigate("/profile");
    };
  
    const handleClickLogOut = () => {
      modalLogout.current.show();
    };
  
    const handleToggle = () => {
      setToggle(() => !toggle);
    }
    const deleteCart = () => {
      dispatch(resetCart());
    } 

    const handleClickAgreeLogOut = () => {
      dispatch(logoutStart({navigate, hide: () => modalLogout.current.hide(), page: "CUSTOMER", deleteCart}));
    }

    const handleClickHistoryOrder = () => {
        navigate("/history-order");
    }
  return (
    <div>
        {toggle &&
        <div className='fixed right-0 top-[61px] w-fit h-fit bg-neutral-100 mt-1 z-50 shadow-md'>
          <ul className='flex flex-col justify-start rounded-md shadow-md overflow-hidden'>
            <li className='hover:text-gray-70 hover:bg-neutral-200 py-2 px-5' onClick={handleClickProfile}>
              Thông tin cá nhân
            </li >
            <li className='hover:text-gray-70 hover:bg-neutral-200 py-2 px-5' onClick={handleClickHistoryOrder}>
               Lịch sử đặt hàng 
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

export default forwardRef(FuncsMenuAccount);
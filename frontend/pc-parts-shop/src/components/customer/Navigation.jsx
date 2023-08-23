import React, { useEffect, useRef, useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import Log from './login/Log';
import Cart from './cart/Cart';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {FaUserCircle} from 'react-icons/fa';
import {AiOutlineSearch} from 'react-icons/ai';
import { convertToPath } from '../../utils/convert_helper';

const Navigation = ({listItemAcount}) => {
  const [searchText, setSearchText] = useState(''); 
  const logModal = useRef();
  const cartModal = useRef();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.auth);
  const {currentCart} = useSelector(state => state.cart);
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
    <div className='fixed top-0 right-0 w-full h-16 bg-slate-800 shadow-md flex items-center px-3 '>
      <h1 className='text-4xl font-bold drop-shadow-md text-white cursor-pointer'
        onClick={() => navigate("/")}>
        PCPartsShop
      </h1>
      <form onSubmit={(e) => {e.preventDefault(); 
                        if(searchText.length === 0) return; 
                        navigate("/search?keywords=" +  encodeURIComponent(searchText))
                        setSearchText('')}}
        className="ml-10 p-1 py-[4.5px]  rounded-xl w-[300px] flex gap-2 items-center bg-white">
        <input type='text' 
          className='px-1 focus:outline-none rounded-xl w-full  h-full'
          placeholder='Tìm kiếm' value={searchText} onChange={(e)=>setSearchText(e.target.value)}></input>
        <AiOutlineSearch color='black' size={23} className='cursor-pointer'
        onClick={() => {if(searchText.length === 0) return; navigate("/search?keywords=" +  encodeURIComponent(searchText))
                        setSearchText('')}}/>
      </form>
      
      <div className='relative ml-[200px] flex gap-2 items-center cursor-pointer hover:transition-all hover:duration-500 hover:ease-out hover:scale-110 hover:text-md'
        onClick={() => cartModal.current.show()}>
        <div className='text-white '>Giỏ hàng</div>
        <FaShoppingCart size={24} color='white' />
        {currentCart.length > 0 && <div class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-slate-800 rounded-full -top-3 -right-3">{
          currentCart.length
        }</div>}
        
      </div>
      <div></div>
      {
        currentUser && currentUser.role == "CUSTOMER"?
          <div className='ml-auto flex gap-2 text-white items-center'
            ref={threeDotMenu}>
            <div>{currentUser?.lastName + " " + currentUser?.firstName}</div>
            <FaUserCircle size={30}/>
          </div> :
          <div className='ml-[150px] flex gap-9 items-center mr-8'>
            <button className='text-white'
              onClick={() => logModal.current?.show("logIn")}>
              Đăng nhập
            </button>
            <button className='text-white'
              onClick={() => logModal.current?.show("signUp")}>
              Đăng ký
            </button>
          </div>
      }
      <Log ref={logModal} />
      <Cart ref={cartModal} showLog = {() => logModal.current.show("logIn")} />
    </div>
  )
}

export default Navigation
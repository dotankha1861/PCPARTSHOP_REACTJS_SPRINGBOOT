
import React, { useEffect, useRef } from 'react'
import Navigation from '../components/admin/navigation/Navigation';
import Sidebar from '../components/admin/sidebar/Sidebar';
import Section from '../components/admin/section/Section';
import FuncsMenuAccount from '../components/admin/menu-account/FuncsMenuAccount';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const LayoutAdmin = () => {
  const clearActiveLinkSideBar = useRef();
  const listItemAcount = useRef();
  return (
    <div className='select-none relative'>
      <Navigation listItemAcount={listItemAcount}/>
      <Sidebar ref={clearActiveLinkSideBar}/>
      <Section/>
      <FuncsMenuAccount ref={listItemAcount} 
        clearActiveLinkSideBar={() => clearActiveLinkSideBar.current.clearActiveLinkSideBar()}/>
      {/* <Alert severity="error" className='top-0 center fixed x-50 w-300'>This is an error alert — check it out!</Alert> */}
      <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={
              {color: "black"}
            }
        />
    </div>
    
  )
}

export default LayoutAdmin;

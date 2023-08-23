import React, { useRef } from 'react'
import Navigation from '../components/customer/Navigation';
import Section from '../components/customer/Section';
import { ToastContainer} from 'react-toastify';
import FuncsMenuAccount from '../components/customer/menu-acount/FuncsMenuAccount';
import 'react-toastify/dist/ReactToastify.css';
const LayoutCustomer = () => {
  const listItemAcount = useRef();
  return (
    <div className='select-none'>
      <Section/>
      <Navigation listItemAcount ={listItemAcount}/>
      <FuncsMenuAccount ref={listItemAcount} />
      <ToastContainer 
           position="top-center"
           autoClose={2000}
           hideProgressBar={false}
           newestOnTop={true}
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

export default LayoutCustomer;
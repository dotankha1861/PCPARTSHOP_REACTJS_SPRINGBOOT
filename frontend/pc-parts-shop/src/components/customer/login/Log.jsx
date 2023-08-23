import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react'
import Modal from '../../Modal';
import LogIn from './LogIn';
import SignUp from './SignUp';
import SendEmailReset from './SendEmailReset';
import { useDispatch } from 'react-redux';
import { getAllCartItemStart } from '../../../redux/slices/cartSlice';
// import ForgetPassword from './ForgetPassword';

const pages = {
  logIn: 0,
  signUp: 1,
  resetPassword: 2
}

const Log = (props, ref) => {
  const dispatch = useDispatch();
  const logModal = useRef();
  const loginPage = useRef();
  const [page, setPage] = useState();

  useImperativeHandle(ref, () => ({
    show: (opt) => {
      setPage(pages[opt]);
      logModal.current.show();
    },
    hide: () => ref.current.hide(),
  }));

  return (
    <div className='flex justify-center items-center'>
      <Modal ref={logModal} onExit={() => {if(page === pages.logIn 
        && loginPage.current.isSuccess()) { 
          dispatch(getAllCartItemStart())}}}>
        {page === pages.logIn && 
          <LogIn setPageSignUp = {() => setPage(pages.signUp)}
            setPageResetPassword = {() => setPage(pages.resetPassword)}
            hide={() => logModal.current.hide()} ref={loginPage}/>
        }
        {page === pages.signUp && 
          <SignUp setPageLogIn = {() => setPage(pages.logIn)}/>
        }
        {page === pages.resetPassword && 
          <SendEmailReset  setPageLogIn = {() => setPage(pages.logIn)}/>
        }
      </Modal>
    </div>
  )
}

export default forwardRef(Log);
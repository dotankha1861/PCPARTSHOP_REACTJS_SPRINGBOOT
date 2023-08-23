import React, { useEffect, useRef, useState } from 'react'
import { LuUser } from 'react-icons/lu'
import { PiLockKeyBold } from 'react-icons/pi'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from "yup"
import { loginStart } from '../../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import '../../App.css'
import SendEmailReset from '../../components/admin/login/SendEmailReset'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const LoginAdmin = () => {

  const forgetPasswordModal = useRef();
  const dispatch = useDispatch();
  const { isFetching } = useSelector(state => state.auth);
  const [isShowPassword, setShowPassWord] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup.string().required("* Vui lòng nhập tài khoản"),
    password: yup.string().required("* Vui lòng nhập mật khẩu"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const handleClickShowPassword = () => {
    setShowPassWord(() => !isShowPassword);
  };

  const onLogIn = (data) => {
    dispatch(loginStart({ data, navigate, page: "ADMIN" }));
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-800 select-none font-serif fixed top-0 left-0">
      <div className="flex flex-col items-center">
        <h1 className="text-white text-5xl mb-16">
          Đăng nhập
        </h1>
        <form className='flex flex-col gap-2 items-center justify-center'
          onSubmit={handleSubmit(onLogIn)}>
          <div>
            <div className='bg-white flex p-2 rounded-xl w-72 shadow-md justify-stretch items-center gap-3'>
              <LuUser color='gray'
                size={'20px'}>
              </LuUser>
              <input className="focus:outline-none w-[250px]"
                type="text"
                placeholder='Username'
                {...register("username")} />
            </div>
            <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.username?.message}</pre></div>
          </div>
          <div>
            <div className='bg-white flex p-2 rounded-xl w-72 shadow-md justify-start items-center gap-3 mt-1'>
              <PiLockKeyBold color='gray'
                size={'20px'}>
              </PiLockKeyBold>
              <input className="focus:outline-none appearance-none w-[250px]"
                type={isShowPassword ? "text" : "password"}
                placeholder='Password'
                {...register("password")} />
              {(isShowPassword) ?
                <AiOutlineEyeInvisible className='cursor-pointer ml-auto'
                  color='black'
                  size={'20px'}
                  onClick={handleClickShowPassword} >
                </AiOutlineEyeInvisible> :
                <AiOutlineEye className='cursor-pointer ml-auto'
                  color='black'
                  size={'20px'}
                  onClick={handleClickShowPassword} >
                </AiOutlineEye>
              }
            </div>
            <div className="text-red-500 text-sm mt-1"><pre className='font-serif'>    {errors.password?.message}</pre></div>
          </div>
          <input type="submit"
            className='rounded-xl mt-4 text-white p-2 bg-green-500 hover:bg-green-400 self-stretch cursor-pointer'
            value={"Đăng nhập"} />
          <div className='text-[darkGray] my-auto italic underline underline-offset-4 hover:text-white mt-2'
            onClick={() => forgetPasswordModal.current.show()}>
            Quên mật khẩu
          </div>
        </form>
      </div>
      <SendEmailReset ref={forgetPasswordModal} />
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
          { color: "black" }
        }
      />
    </div>
  )
}

export default LoginAdmin;
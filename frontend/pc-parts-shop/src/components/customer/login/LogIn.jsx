import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginStart } from '../../../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from "yup";
import { getAllCartItemStart } from '../../../redux/slices/cartSlice'
import { mergeCartItem } from '../../../redux/apis/cartApi'
import Toast from '../../../utils/toast_helper'
import Modal from '../../Modal'

const LogIn = ({ setPageSignUp, setPageResetPassword, hide }, ref) => {
  const [isSuccess, setSuccess] = useState(false);
  useImperativeHandle(ref, () => ({
    isSuccess: () => isSuccess,
  }));

  const { currentCart } = useSelector(state => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    username: yup.string().required("* Vui lòng nhập tài khoản"),
    password: yup.string().required("* Vui lòng nhập mật khẩu"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const getCart = () => {
    setSuccess(() => true);
  }

  const onLogIn = (data) => {
    dispatch(loginStart({ data, navigate, page: "CUSTOMER", getCart }));
  };

  useEffect(() => {
    if (isSuccess && currentCart.length === 0) hide();
  }, [isSuccess])

  const handleClickAgreeMerge = async () => {
    try {
      await mergeCartItem({ listCartItem: currentCart });
      Toast.success('Gộp giỏ hàng thành công');
      hide();
    }
    catch (error) {
      // xử lý sau
    }
  }

  return (
    <div className='flex flex-col items-center py-6 px-12 gap-9 w-[400px]'>
      {!isSuccess || !(currentCart.length > 0) ? <div className="flex flex-col items-center py-6 px-12 gap-9 w-[400px]">
        <div className='font-semibold text-2xl'>ĐĂNG NHẬP</div>
        <form onSubmit={handleSubmit(onLogIn)}>
          <div className='flex flex-col gap-3 items-center w-full'>
            <div className='flex justify-start gap-2 items-start'>
              <label htmlFor='username' className='whitespace-nowrap'>
                Tài khoản (*)
              </label>
              <div className="flex flex-col w-full">
                <input type='text'
                  id="username"
                  className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'
                  {...register("username")}>
                </input>
                <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.username?.message}</pre></div>
              </div>

            </div>
            <div className='flex justify-start gap-2 items-start'>
              <label htmlFor='password' className='whitespace-nowrap'>
                Mật khẩu (*)
              </label>
              <div className="flex flex-col w-full">
                <input type='password'
                  id="password"
                  className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'
                  {...register("password")}>
                </input>
                <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.password?.message}</pre></div>
              </div>

            </div>
          </div>

          <button className='button mt-4 bg-green-600 hover:bg-green-500 border-none text-white p-2 w-[300px]'>Đăng nhập</button>
        </form>
        <div className='flex items-center gap-12'>
          <div className='cursor-pointer font-semibold'
            onClick={() => setPageSignUp()}> Đăng ký </div>
          <div className="text-blue-800 cursor-pointer"
            onClick={() => setPageResetPassword()}>Quên mật khẩu</div>
        </div>
      </div>
        :
        <div className='py-5 px-5 flex flex-col gap-3 justify-start items-center w-full'>
          <div className='font-bold'>Bạn có muốn đưa các sản phẩm đã chọn vào giỏ hàng chính không?</div>
          <div className='flex gap-3 my-4'>
            <button className='middle none center mr-4 rounded-lg bg-red-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
              onClick={() => hide()}
            >&nbsp;&nbsp;Hủy&nbsp;&nbsp;</button>
            <button className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
              onClick={handleClickAgreeMerge}>
              Đồng ý</button>

          </div>
        </div>}

    </div>
  )
}

export default forwardRef(LogIn);
import React, { forwardRef } from 'react'
import Modal from '../Modal'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { changePassword } from '../../redux/apis/authApi';
import Toast from '../../utils/toast_helper';
import { setAuthHeader } from '../../utils/axios_helper';
import { deleteCartSuccess, resetCart } from '../../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutSuccess } from '../../redux/slices/authSlice';

const ChangePassword = ({hide}) => {
  const { currentUser } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const schema = yup.object().shape({
    crtPassword: yup.string().max(30, "Mật khẩu không quá 30 ký tự").required("Vui lòng nhập mật khẩu cũ"),
    newPassword: yup.string().max(30, "Mật khẩu không quá 30 ký tự").required("Vui lòng nhập mật khẩu mới"),
    confirmPassword: yup.string().max(30, "Mật khẩu không quá 30 ký tự")
      .oneOf([yup.ref('newPassword')], "Mật khẩu nhập lại không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      await changePassword(data);
      hide();

      dispatch(resetCart());

      if (currentUser?.role === "CUSTOMER") navigate("/")
      else navigate('/admin/login');
      
      dispatch(logoutSuccess());
      Toast.success("Đổi mật khẩu thành công vui lòng đăng nhập lại");
    }
    catch (error) {
      hide();
      const { data: resBody } = error.response;
      Toast.error(resBody.message);
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col px-10 justify-center items-center py-3 gap-2 pt-10'>
      <div className='flex justify-start gap-2  items-baseline w-full'>
        <label htmlFor='crtPassword'
          className='whitespace-nowrap w-[50%]'>Mật khẩu cũ</label>

        <div className="flex flex-col w-[50%]">
          <input type='password' id="crtPassword"
            {...register("crtPassword")}
            className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px]'>
          </input>
          <div className="text-red-500 text-sm font-serif"><pre className='font-serif'>  {errors.password?.message}</pre></div>
        </div>
      </div>
      <div className='flex justify-start gap-2 items-baseline w-full'>
        <label htmlFor='newPassword'
          className='whitespace-nowrap w-[50%]'>
          Mật khẩu mới
        </label>
        <div className="flex flex-col w-[50%]">
          <input type='password' id="newPassword"
            {...register("newPassword")}
            className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] '>
          </input>
          <div className="text-red-500 text-sm font-serif"><pre className='font-serif'>  {errors.newPassword?.message}</pre></div>
        </div>

      </div>

      <div className='flex justify-start gap-2  items-baseline w-full'>
        <label htmlFor='last-name'
          className='whitespace-nowrap w-[50%]'>
          Xác nhận mật khẩu
        </label>
        <div className="flex flex-col w-[50%]">
          <input type='password' id="confirmPassword"
            {...register("confirmPassword")}
            className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px]'>
          </input>
          <div className="text-red-500 text-sm font-serif"><pre className='font-serif'>  {errors.confirmPassword?.message}</pre></div>
        </div>

      </div>
      <button className='button mt-4 mb-2 bg-green-600 hover:bg-green-500 border-none text-white p-2 w-[300px]'>Đổi mật khẩu</button>
    </form>
  )
}

export default forwardRef(ChangePassword);
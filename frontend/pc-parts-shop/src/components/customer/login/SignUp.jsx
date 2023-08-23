import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerStart } from '../../../redux/slices/authSlice';

const SignUp = ({ setPageLogIn }) => {
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    lastName: yup.string().required("Vui lòng nhập Họ và tên đệm"),
    firstName: yup.string().required("Vui lòng nhập tên"),
    email: yup.string().email("Email không đúng định dạng")
      .required("Vui lòng nhập email"),
    phone: yup.string().matches(/^\d+$/, 'Số điện thoại không hợp lệ'),
    username: yup.string().max(30, "Tài khoản không quá 30 ký tự").required("Vui lòng nhập tài khoản"),
    password: yup.string().max(30, "Tài khoản không quá 30 ký tự").required("Vui lòng nhập mật khẩu"),
    confirm: yup.string().max(30, "Tài khoản không quá 30 ký tự")
      .oneOf([yup.ref('password')], "Mật khẩu nhập lại không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
    gender: yup.string().required("Vui lòng chọn giới tính")
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSignUp = (data) => {
    const registerData = {
      ...data,
      male: data.gender === "male" ? 1 : 0
    }
    console.log(data);
    console.log(registerData);
     dispatch(registerStart({ registerData, setPageLogIn}));
  };

  console.log(errors);

  return (
    <div className='flex flex-col items-center py-4 px-12 gap-4'>
      <div className='font-semibold text-2xl'>ĐĂNG KÝ</div>
      <form onSubmit={handleSubmit(onSignUp)} className='flex flex-col items-center gap-7'>
        <fieldset className='flex flex-col items-center gap-3 text-black'>
          <div className='flex gap-7 items-center w-full'>
            <div className='w-[55%] flex justify-start gap-2 items-start'>
              <label htmlFor='last-name' className='whitespace-nowrap'>
                Họ (*)
              </label>
              <div className="flex flex-col w-full">
                <input type='text'
                  id="last-name"
                  className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'
                  {...register("lastName")}>
                </input>
                <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.lastName?.message}</pre></div>
              </div>

            </div>
            <div className='w-[45%] flex justify-start gap-2 items-start'>
              <label htmlFor='first-name' className='whitespace-nowrap'>
                Tên (*)
              </label>
              <div className="flex flex-col w-full">
                <input type='text'
                  id="first-name"
                  className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'
                  {...register("firstName")}>
                </input>
                <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.firstName?.message}</pre></div>
              </div>

            </div>
          </div>
          <div className='w-[100%] flex justify-start gap-2 items-start'>
            <label htmlFor='email' className='whitespace-nowrap'>
              Email (*)
            </label>
            <div className="flex flex-col w-full">
              <input type='email'
                id="email"
                className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'
                {...register("email")} >
              </input>
              <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.email?.message}</pre></div>
            </div>

          </div>

          <div className="flex gap-7 items-center w-full">
            <div className='w-[50%] flex justify-start gap-2 items-start self-start'>
              <label htmlFor='phone'
                className='w-fit whitespace-nowrap'>
                Số điện thoại
              </label>
              <div className="flex flex-col w-full">
                <input type='tel'
                  id="phone"
                  className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'
                  {...register("phone")}>
                </input>
                <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.phone?.message}</pre></div>
              </div>

            </div>

            <div className='flex w-[50%] self-start gap-3 items-start'>
              <label className='whitespace-nowrap'>
                Giới tính (*)
              </label>
              <div className="flex flex-col w-full">
                <div className='flex justify-center w-full gap-12'  >
                  <div>
                    <input type='radio' id="male" name="gender" value={"male"} {...register("gender")} />
                    <label htmlFor='male'>Nam</label>
                  </div>
                  <div>
                    <input type='radio' id="female" name="gender" value={"female"} {...register("gender")} />
                    <label htmlFor='female'>Nữ</label>
                  </div>
                </div>
                <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.gender?.message}</pre></div>
              </div>

            </div>
          </div>

          <div className='flex gap-7 items-center w-full'>
            <div className='w-[50%] flex justify-start gap-2 items-start'>
              <label htmlFor='username' className='whitespace-nowrap' >
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
            <div className='w-[50%] flex justify-end gap-2 items-start'>
              <label htmlFor='password' className='whitespace-nowrap'>
                Mật khẩu (*)
              </label>
              <div className="flex flex-col w-full">
                <input type='password'
                  id="password"
                  className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-[180px]'
                  {...register('password')}>
                </input>
                <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.password?.message}</pre></div>
              </div>

            </div>
          </div>

          <div className='w-full flex justify-end gap-2 items-start self-end'>
            <label htmlFor='confirm' className='whitespace-nowrap'>
              Xác nhận mật khẩu (*)
            </label>
            <div className="flex flex-col flex-end">
              <input type='password'
                id="confirm"
                className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-[180px]'
                {...register("confirm")}>
              </input>
              <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.confirm?.message}</pre></div>
            </div>
          </div>
          <input type="submit"
            className='button w-[300px] bg-green-600 hover:bg-green-500 border-none text-white p-2'
            value='Đăng ký'>
          </input>
        </fieldset>
      </form >
      <div className='button text-center w-[300px] mb-4' onClickCapture={() => setPageLogIn()}>Đăng nhập</div>
    </div>

  )
}

export default SignUp
import React, { useLayoutEffect, useState } from 'react'
import { resetPassword, validateToken } from '../redux/apis/resetPasswordApi';
import * as yup from "yup";
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Toast from '../utils/toast_helper';
import { ToastContainer } from 'react-toastify';
import { PiLockKeyBold } from "react-icons/pi";
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';

const ResetPassword = () => {
  const [correctToken, setCorrectToken] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [isShowPassword, setShowPassWord] = useState(false);
  const [isShowConfirm, setShowConfirm] = useState(false);
  const validate = async (token) => {
    try {
      setFetching(() => true);
      await validateToken(token);
      setCorrectToken(() => true);
      setFetching(() => false);
    }
    catch {
      setCorrectToken(() => false);
      setFetching(() => false);
    };
  };

  const schema = yup.object().shape({
    password: yup.string().max(30, "Tài khoản không quá 30 ký tự").required("Vui lòng nhập mật khẩu"),
    confirm: yup.string().max(30, "Tài khoản không quá 30 ký tự")
      .oneOf([yup.ref('password')], "Mật khẩu nhập lại không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onUpdate = async (data) => {
    const currentUrl = window.location.href;
    const token = currentUrl.split('/reset-password/')[1];
    try {
      await resetPassword({ token, newPassword: data.password });
      Toast.success("Cập nhật mật khẩu thành công");
    }
    catch (error) {
      Toast.error("Link không tồn tại hoặc đã hết hiệu lực");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassWord(() => !isShowPassword);
  };

  const handleClickShowConfirm = () => {
    setShowConfirm(() => !isShowConfirm);
  };

  useLayoutEffect(() => {
    const currentUrl = window.location.href;
    const token = currentUrl.split('/reset-password/')[1];
    validate(token);
  }, []);

  return (
    <div className='flex justify-center items-center h-full'>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {isFetching ? <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-800 motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status">
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >Loading...</span>
      </div> : <div>
        {correctToken ?
          <div className="flex flex-col items-center bg-slate-800 h-screen w-screen justify-center">
            <h1 className="text-white text-5xl mb-16">
              Đặt lại mật khẩu
            </h1>
            <form className='flex flex-col gap-2 items-center justify-center'
              onSubmit={handleSubmit(onUpdate)}>
              <div>
                <div className='bg-white flex p-2 rounded-xl w-72 shadow-md justify-stretch items-center gap-3'>
                <PiLockKeyBold color='gray'
                    size={'20px'}>
                  </PiLockKeyBold>
                  <input className="focus:outline-none appearance-none w-[250px]"
                    type={isShowPassword ? "text" : "password"}
                    placeholder='Mật khẩu mới'
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
                <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.username?.message}</pre></div>
              </div>
              <div>
                <div className='bg-white flex p-2 rounded-xl w-72 shadow-md justify-start items-center gap-3 mt-1'>
                  <PiLockKeyBold color='gray'
                    size={'20px'}>
                  </PiLockKeyBold>
                  <input className="focus:outline-none appearance-none w-[250px]"
                    type={isShowConfirm ? "text" : "password"}
                    placeholder='Xác nhận mật khẩu'
                    {...register("confirm")} />
                  {(isShowConfirm) ?
                    <AiOutlineEyeInvisible className='cursor-pointer ml-auto'
                      color='black'
                      size={'20px'}
                      onClick={handleClickShowConfirm} >
                    </AiOutlineEyeInvisible> :
                    <AiOutlineEye className='cursor-pointer ml-auto'
                      color='black'
                      size={'20px'}
                      onClick={handleClickShowConfirm} >
                    </AiOutlineEye>
                  }
                </div>
                <div className="text-red-500 text-sm mt-1"><pre className='font-serif'>    {errors.password?.message}</pre></div>
              </div>
              <input type="submit"
                className='rounded-xl mt-4 text-white p-2 bg-green-500 hover:bg-green-400 self-stretch cursor-pointer'
                value={"Cập nhật mật khẩu"} />
            </form>
          </div> :
          <div className='h-screen flex justify-center items-center'>Link không còn tồn tại</div>
        }
      </div>

      }
    </div>
  );
}

export default ResetPassword
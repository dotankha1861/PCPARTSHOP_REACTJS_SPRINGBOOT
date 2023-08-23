
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiFillLock } from 'react-icons/ai'
import { BiSolidEditAlt } from 'react-icons/bi'
import { MdSaveAs } from 'react-icons/md'
import Modal from '../../components/Modal'
import { BiCloudUpload } from 'react-icons/bi';
import ChangePassword from '../../components/common/ChangePassword'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { updateProfileCustomerStart } from '../../redux/slices/authSlice'
import { TiCancel } from 'react-icons/ti'
const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  const [isLoadingImage, setLoadImage] = useState();
  const [readOnlyInput, setReadOnlyInput] = useState(true);
  const changePasswordModal = useRef();

  const handleLoadImage = () => {
    setLoadImage(() => !isLoadingImage);
  }

  const handleClickEdit = () => {
    setReadOnlyInput(() => !readOnlyInput);
  }

  const schema = yup.object().shape({
    lastName: yup.string().required("Vui lòng nhập Họ và tên đệm"),
    firstName: yup.string().required("Vui lòng nhập tên"),
    email: yup.string().email("Email không đúng định dạng")
      .required("Vui lòng nhập email"),
    phone: yup.string().matches(/^\d+$/, 'Số điện thoại không hợp lệ'),
    gender: yup.string().required("Vui lòng chọn giới tính"),
    address: yup.string(),
    // fir: yup.string().max(30, "Mật khẩu không quá 30 ký tự").required("Vui lòng nhập mật khẩu cũ"),
    // newPassword: yup.string().max(30, "Mật khẩu không quá 30 ký tự").required("Vui lòng nhập mật khẩu mới"),
    // confirmPassword: yup.string().max(30, "Mật khẩu không quá 30 ký tự")
    //   .oneOf([yup.ref('newPassword')], "Mật khẩu nhập lại không khớp")
    //   .required("Vui lòng xác nhận mật khẩu"),
  });

  const { register, handleSubmit, reset,  formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  
  const handleUpdateProfile = (data) => {
    console.log(data);
    if(readOnlyInput) handleClickEdit();
    else{
      const updateData = {
        ...data,
        male: data.gender === "male" ? 1 : 0
      }
      
      dispatch(updateProfileCustomerStart({updateData , onSuccess: handleClickEdit} ));
    }
  }
  
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
      });
    };
    scrollToTop();
  },[]);

  const handleReset = () => {
    setReadOnlyInput(true);
    handleClickEdit();
    reset();
  }

  return (
    <div>
      <div>
        <div className='p-5 flex flex-col gap-4 items-center'>
          <h1 className='font-bold text-2xl'>
            Thông tin cá nhân
          </h1>
          <form className='flex items-start gap-3 over'
            onSubmit={handleSubmit(handleUpdateProfile)}>

            <fieldset className='py-10 flex flex-col items-center px-16 bg-white drop-shadow-md shadow-inner rounded-xl gap-10 text-black'
              disabled={readOnlyInput}>
              <div className='flex gap-7 items-center w-full'>
                <div className='w-[50%] flex justify-start gap-2 items-center'>
                  <label htmlFor='last-name'>
                    Họ
                  </label>
                  <input type='text'
                    id="last-name"
                    defaultValue={currentUser?.lastName}
                    {...register("lastName")}
                    className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'>
                  </input>
                </div>
                <div className='w-[50%] flex justify-start gap-2 items-center'>
                  <label htmlFor='first-name'>
                    Tên
                  </label>
                  <input type='text'
                    id="first-name"
                    defaultValue={currentUser?.firstName}
                    {...register("firstName")}
                    className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'>
                  </input>
                </div>
              </div>

              <div className='w-[100%] flex justify-start gap-2 items-center'>
                <label htmlFor='email'>
                  Email
                </label>
                <input type='text'
                  id="email"
                  defaultValue={currentUser?.email}
                  {...register("email")}
                  className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full' >
                </input>
              </div>

              <div className="flex gap-7 items-center w-full">
                <div className='w-[50%] flex justify-start gap-2 items-center self-start'>
                  <label htmlFor='phone'
                    className='w-fit whitespace-nowrap'>
                    Số điện thoại
                  </label>
                  <input type='text'
                    id="phone"
                    defaultValue={currentUser?.phone}
                    {...register("phone")}
                    className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full' >
                  </input>
                </div>

                <div className='flex w-[50%] self-start gap-3 items-center'>
                  <label className='whitespace-nowrap'>
                    Giới tính
                  </label>
                  <div className='flex justify-center w-full gap-12'  >
                    <div>
                      <input type='radio' id="male" name="gender"
                      value={"male"} {...register("gender")}
                        defaultChecked={currentUser?.male} />
                      <label htmlFor='male'>Nam</label>
                    </div>
                    <div>
                      <input type='radio' id="female" name="gender"
                        value={"feMale"} {...register("gender")}
                        defaultChecked={!currentUser?.male} />
                      <label htmlFor='female'>Nữ</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className='w-[100%] flex justify-start gap-2 items-center'>
                <label htmlFor='email' className='whitespace-nowrap'>
                  Địa chỉ
                </label>
                <input type='text'
                  id="email"
                  defaultValue={currentUser?.address}
                  {...register("address")}
                  className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full' >
                </input>
              </div>

              <div className='flex items-baseline w-full '>
                <div className="flex gap-1 items-center mt-2 cursor-pointer"
                  onClick={() => changePasswordModal.current.show()}>
                  <div className=' text-blue-900'>
                    Đổi mật khẩu
                  </div>
                  <AiFillLock size={20}
                    className='text-blue-900' />
                </div>
                {readOnlyInput ?
                  <div className="flex gap-2 items-center self-end cursor-pointer ml-auto" onClick={handleClickEdit}>
                    <div className='text-blue-900'>
                      Sửa thông tin
                    </div>
                    <BiSolidEditAlt size={20}
                      className='text-blue-900' />
                  </div> :
                  <div className='flex gap-4 ml-auto'>
                    <div className='flex gap-1 items-center  justify-start cursor-pointer ml-auto'
                      onClick={handleReset}>
                      <div className='text-red-700'>
                        Hủy
                      </div>
                      <TiCancel size={20}
                        className='text-red-700' />
                    </div>
                    <button type="submit" className="flex gap-1 items-center  justify-start cursor-pointer ml-auto">

                      <div className='text-green-900'>
                        Lưu
                      </div>
                      <MdSaveAs size={20}
                        className='text-green-900' />
                    </button>
                  </div>

                }
              </div>

            </fieldset>
          </form>
        </div>
        <Modal ref={changePasswordModal} title={"ĐỔI MẬT KHẨU"}>
          <ChangePassword ref={changePasswordModal} hide={() => changePasswordModal.current.hide()}/>
          </Modal>
      </div>
    </div>
  )
}

export default Profile
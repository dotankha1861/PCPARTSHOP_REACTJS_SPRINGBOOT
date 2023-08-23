
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiFillLock } from 'react-icons/ai'
import { BiSolidEditAlt } from 'react-icons/bi'
import { MdSaveAs } from 'react-icons/md'
import Modal from '../../components/Modal'
import { BiCloudUpload } from 'react-icons/bi';
import ChangePassword from '../../components/common/ChangePassword'
import * as yup from 'yup';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateProfileEmplyeeStart } from '../../redux/slices/authSlice'
import { TiCancel } from 'react-icons/ti';
import { TbRuler2 } from 'react-icons/tb'


const Profile = () => {
  const { currentUser } = useSelector(state => state.auth);
  const [isLoadingImage, setLoadImage] = useState();
  const [readOnlyInput, setReadOnlyInput] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileChoose, setFileChoose] = useState(null);
  const changePasswordModal = useRef();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    lastName: yup.string().required("Vui lòng nhập Họ và tên đệm"),
    firstName: yup.string().required("Vui lòng nhập tên"),
    email: yup.string().email("Email không đúng định dạng")
      .required("Vui lòng nhập email"),
    phone: yup.string().matches(/^\d+$/, 'Số điện thoại không hợp lệ'),
    gender: yup.string().required("Vui lòng chọn giới tính"),
    // fir: yup.string().max(30, "Mật khẩu không quá 30 ký tự").required("Vui lòng nhập mật khẩu cũ"),
    // newPassword: yup.string().max(30, "Mật khẩu không quá 30 ký tự").required("Vui lòng nhập mật khẩu mới"),
    // confirmPassword: yup.string().max(30, "Mật khẩu không quá 30 ký tự")
    //   .oneOf([yup.ref('newPassword')], "Mật khẩu nhập lại không khớp")
    //   .required("Vui lòng xác nhận mật khẩu"),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLoadImage = () => {
    setLoadImage(() => !isLoadingImage);
  }

  const handleClickEdit = () => {
    setReadOnlyInput(() => !readOnlyInput);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFileChoose(file);
    }
  };

  const handleUpdateProfile = async (data) => {
    const formData = new FormData();
    formData.append('lastName', data.lastName);
    formData.append('firstName', data.firstName);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('male', data.gender === "male");
    if (fileChoose) formData.append('image', new Blob([fileChoose], { type: fileChoose?.type }));
    dispatch(updateProfileEmplyeeStart({ formData, onSuccess: handleClickEdit }));

  };

  const handleReset = () => {
    setLoadImage(null);
    setReadOnlyInput(true);
    setSelectedImage(null);
    setFileChoose(null);
    handleClickEdit();
    reset();
  }

  return (
    <div>
      <div className='p-5 flex flex-col gap-4'>
        <h1 className='font-bold text-2xl'>
          Thông tin cá nhân
        </h1>
        <div className='flex items-start gap-3 w-full'>
          <div className='w-[25%] flex flex-col items-center p-5 bg-white drop-shadow-md shadow-inner rounded-xl gap-1'>

            <div className='relative flex flex-col items-center'>
              <img src={selectedImage ? selectedImage : (currentUser?.avatar ? currentUser?.avatar : "http://localhost:8080/images/setting/avatar-user")}
                className='w-[150px] h-[150px] shadow-md rounded-full overflow-hidden'
                onLoad={handleLoadImage} >
              </img>
              <input
                onChange={handleImageChange}
                type="file" id="file-input"
                class="hidden"
                disabled={readOnlyInput}
              />
              {readOnlyInput ?
                <label id="file-input-label" for="file-input" className='mt-2 flex items-center gap-2 text-sm opacity-0 text-slate-500
                    file:mr-4 file:py-2 file:px-4 file:rounded-md
                    file:border-0 file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100' >
                  <span>Tải ảnh lên</span>
                  <BiCloudUpload size={24} />
                </label> :
                <label id="file-input-label" for="file-input" className='mt-2 flex items-center gap-2 text-sm text-blue-900
        						file:mr-4 file:py-2 file:px-4 file:rounded-md
										file:border-0 file:text-sm file:font-semibold
									file:bg-blue-50 file:text-blue-800
									hover:file:bg-blue-100'>
                  <span>Tải ảnh lên</span>
                  <BiCloudUpload size={24} />
                </label>
              }
            </div>

            <div className='font-bold text-lg mt-2'>
              {currentUser?.lastName + " " + currentUser?.firstName}
            </div>
            <div className='font-semibold'>
              {currentUser?.username}
            </div>
            <div className='italic'>
              {currentUser?.role === "ADMIN" ? "ADMIN - Quản trị" : "SUPER - Quản lý"}
            </div>
            <div>Mã nhân viên: {currentUser?.employeeId}</div>

          </div>
          <form className='flex items-start gap-3 w-[75%]'
            onSubmit={handleSubmit(handleUpdateProfile)}>

            <fieldset className='py-10 flex flex-col items-center px-16 bg-white drop-shadow-md shadow-inner rounded-xl gap-10 text-black w-full'
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

              <div className='flex items-baseline w-full'>
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
      </div>
      <Modal ref={changePasswordModal} title={"ĐỔI MẬT KHẨU"}><ChangePassword hide={() => changePasswordModal.current.hide()}/></Modal>
    </div>
  )
}

export default Profile;
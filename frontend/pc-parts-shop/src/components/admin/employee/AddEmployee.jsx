import React, { useState } from 'react'
import { BiCloudUpload } from 'react-icons/bi'
import * as yup from "yup";
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createCategoryStart } from '../../../redux/slices/categorySlice';
import { createEmployeeStart } from '../../../redux/slices/employeeSlice';

const categoryStatus = [
  {
    name: "Đang kinh doanh",
    value: true
  },
  {
    name: "Ngưng kinh doanh",
    value: false
  }
]

const AddEmployee = ({ hide }) => {

  const [selectedImage, setSelectedImage] = useState(null);
  const [fileChoose, setFileChoose] = useState(null);

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
  console.log(errors);
  const onCreateEmployee = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append('lastName', data.lastName);
    formData.append('firstName', data.firstName);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('male', data.gender === "male");
    formData.append('role', data.role);
    formData.append('username', data.username);
    formData.append('password', data.password);
    if (fileChoose) formData.append('image', new Blob([fileChoose], { type: fileChoose?.type }));
    dispatch(createEmployeeStart({ data: formData, hide }));

  };

  return (
    <div className="flex flex-col items-center  gap-5">
      <form onSubmit={handleSubmit(onCreateEmployee)} className='flex gap-3 ' encType='multipart/form-data'>
        <fieldset className='py-8 flex flex-col justify-center items-center px-6 bg-white  gap-10 text-black'>
          <div className="flex flex-col items-center p-5 gap-5">
            <div className='flex gap-3 mb-10'>
              <fieldset className=' w-[25%] py-10 flex flex-col items-center px-6 bg-white drop-shadow-md shadow-inner rounded-xl gap-10 text-black'>
                <div className='flex flex-col items-center gap-2'>
                  <img src={selectedImage ? selectedImage : "http://localhost:8080/images/setting/avatar-user"} alt="Avatar"
                    className='w-[150px] h-[150px] shadow-md rounded-full overflow-hidden text-center align-middle'>
                  </img>
                  <input onChange={handleImageChange}
                    type="file" id="file-input"
                    class="hidden"
                  />
                  <label id="file-input-label" for="file-input" className='flex items-center gap-2 text-sm text-slate-500
        						file:mr-4 file:py-2 file:px-4 file:rounded-md
										file:border-0 file:text-sm file:font-semibold
									file:bg-blue-50 file:text-blue-700
									hover:file:bg-blue-100'>
                    <span>Tải ảnh lên</span>
                    <BiCloudUpload size={24} />
                  </label>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">PNG, JPG</p>
                </div>
              </fieldset>
              <fieldset className='w-[50%] py-10 flex flex-col items-center px-6 bg-white drop-shadow-md shadow-inner rounded-xl gap-10 text-black'>
                <div className='flex gap-7 items-center w-full'>
                  <div className='w-[65%] flex justify-start gap-2 items-center'>
                    <label htmlFor='last-name'>
                      Họ
                    </label>
                    <input type='text'
                      id="last-name"
                      className='input w-full'
                      {...register("lastName")}>
                    </input>
                  </div>
                  <div className='w-[35%] flex justify-start gap-2 items-center'>
                    <label htmlFor='first-name'>
                      Tên
                    </label>
                    <input type='text'
                      id="first-name"
                      {...register("firstName")}
                      className='input w-full'>
                    </input>
                  </div>
                </div>

                <div className='w-[100%] flex justify-start gap-2 items-center'>
                  <label htmlFor='email'>
                    Email
                  </label>
                  <input type='text'
                    id="email"
                    {...register("email")}
                    className='input w-full' >
                  </input>
                </div>

                <div className="flex gap-7 items-center w-full ">
                  <div className='w-[50%] flex justify-start gap-2 items-center self-start'>
                    <label htmlFor='phone'
                      className='w-fit whitespace-nowrap'>
                      Số ĐT
                    </label>
                    <input type='text'
                      id="phone"
                      {...register("phone")}
                      className='input w-full' >
                    </input>
                  </div>

                  <div className='flex w-[50%] self-start gap-1 items-center'>
                    <label className='whitespace-nowrap'>
                      Giới tính
                    </label>
                    <div className='flex justify-center w-full gap-5'  >
                      <div>
                        <input type='radio' id="male" name="gender" value={"male"} {...register("gender")}/>
                        <label htmlFor='male'>Nam</label>
                      </div>
                      <div>
                        <input type='radio' id="female" name="gender" value={"female"} {...register("gender")}/>
                        <label htmlFor='female'>Nữ</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-7 items-center w-full">
                  <div className='w-[50%] flex justify-start gap-2 items-center self-start'>
                    <label htmlFor='role'
                      className='w-fit whitespace-nowrap'>
                      Vai trò
                    </label>
                    <select name="role"
                      id="role"
                      data-te-select-init
                      className='input w-full'
                      {...register('role')} >
                      <option value="MEMBER" className='block'>Thành viên</option>
                      <option value="ADMIN" className='block'>Quản lý</option>
                    </select>
                  </div>
                </div>

              </fieldset>
              <fieldset className=' w-[30%] flex flex-col justify-start items-center px-3 bg-white drop-shadow-md shadow-inner rounded-xl text-black'>
                <div className='font-semibold m-10'>TÀI KHOẢN</div>
                <div className='flex flex-col gap-10'>
                  <div className='flex justify-start gap-2 items-center w-full'>
                    <label htmlFor='username'
                      className='whitespace-nowrap w-[50%]'>Tên tài khoản</label>
                    <input type='text' id="username"
                    {...register("username")}
                      className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-[200px]'>
                    </input>
                  </div>
                  <div className='flex justify-start gap-2 items-center w-full'>
                    <label htmlFor='text'
                      className='whitespace-nowrap w-[50%]'>
                      Mật khẩu
                    </label>
                    <input type='password' id="password" {...register("password")}

                      className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-[200px]'>
                    </input>
                  </div>
                  <div className='flex justify-start gap-2 items-center w-full'>
                    <label htmlFor='password'
                      className='whitespace-nowrap w-[50%]'>
                      Xác nhận mật khẩu
                    </label>
                    <input type='password' id="password"
                      {...register("confirm")}
                      className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-[200px]'>
                    </input>
                  </div>
                </div>

              </fieldset>
            </div>

   
          </div>


        </fieldset>
        <div className='gap-2 fixed bottom-0 w-full bg-slate-700 p-2 right-0 flex justify-end '>
          <button className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'>
            Thêm</button>
          <div className=""></div>
        </div>
      </form>
    </div>
  )
}

export default AddEmployee;
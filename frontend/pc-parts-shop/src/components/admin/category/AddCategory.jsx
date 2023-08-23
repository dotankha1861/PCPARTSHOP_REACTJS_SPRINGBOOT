import React, { useState } from 'react'
import { BiCloudUpload } from 'react-icons/bi'
import * as yup from "yup";
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createCategoryStart } from '../../../redux/slices/categorySlice';

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

const AddCategory = ({hide}) => {

  const [selectedImage, setSelectedImage] = useState(null);
  const [fileChoose, setFileChoose] = useState(null);

  const dispatch = useDispatch();

  const schema = yup.object().shape({
    name: yup.string().required("* Vui lòng nhập tên sản phẩm"),
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

  const onCreateCategory = async(data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if(fileChoose) formData.append('image', new Blob([fileChoose], { type: fileChoose?.type }));
    dispatch(createCategoryStart({data: formData, hide}));

  };

  return (
      <div className="flex flex-col items-center p-5 gap-5 ">
        <form onSubmit= {handleSubmit(onCreateCategory)} className='flex gap-3 mb-10 w-[600px]' encType='multipart/form-data'>
          <fieldset className='py-10 flex flex-col justify-center items-center px-6 bg-white drop-shadow-md shadow-inner rounded-xl gap-10 text-black'>
            <div className='flex flex-col items-center gap-2'>
              <img src={selectedImage ? selectedImage : "http://localhost:8080/images/setting/default-product"} alt="Avatar"
                className='w-[150px] h-[150px] shadow-md rounded-md overflow-hidden text-center align-middle'>
              </img>
              <input
                type="file" id="file-input" 
                class="hidden" onChange={handleImageChange}
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
          <fieldset className='py-10 flex flex-col justify-center items-center px-6 bg-white drop-shadow-md shadow-inner rounded-xl gap-4 text-black w-[400px]'>

            <div className='flex justify-center gap-2 items-baseline w-full'>
              <label htmlFor='name' className='whitespace-nowrap w-[40%]'>
                Tên danh mục (*)
              </label>
              <div className="flex flex-col w-[60%] items-center ">
                <input type='text'
                  id="name"
                  className='input'
                  {...register("name")} >
                </input>
                <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.name?.message}</pre></div>
              </div>
            </div>

          
              {/* <div className=' flex justify-start gap-2 items-center self-start w-full'>
                <label htmlFor='active'
                  className='whitespace-nowrap w-[40%]'>
                  Trạng thái (*)
                </label>
                <select name="role"
                  id="active"
                  data-te-select-init
                  className='input w-[60%]'
                  disabled={true} >
                  <option value={true} className='block'>{categoryStatus[0].name}</option>
                  <option value={false} className='block'>{categoryStatus[1].name}</option>
                </select>
              </div> */}
          

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

export default  AddCategory;
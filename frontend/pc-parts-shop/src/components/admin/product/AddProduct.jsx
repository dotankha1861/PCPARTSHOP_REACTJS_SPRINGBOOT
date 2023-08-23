import React, { useMemo, useState } from 'react'
import { BiCloudUpload } from 'react-icons/bi'
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createCategoryStart } from '../../../redux/slices/categorySlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createProductStart } from '../../../redux/slices/productSlice';

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

const AddProduct = ({ hide }) => {
  const { categories } = useSelector(state => state.categories);
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ],
    }),
    []
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const [fileChoose, setFileChoose] = useState(null);

  const dispatch = useDispatch();

  const schema = yup.object().shape({
    skuCode: yup.string().required("Vui lòng nhập mã sản phẩm"),
    name: yup.string().required("* Vui lòng nhập tên sản phẩm"),
    price: yup.number().required("Vui lòng nhập giá sản phẩm"),
    categoryId: yup.number(),
    shortDesc: yup.string().required("Vui lòng nhập miêu tả ngắn")
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
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

  const onCreateProduct = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append('skuCode', data.skuCode);
    formData.append('name', data.name);
    formData.append('categoryId', data.categoryId);
    formData.append('shortDesc', data.shortDesc);
    formData.append('detailDesc', data.detailDesc);
    formData.append('price', data.price);
    if (fileChoose) formData.append('image', new Blob([fileChoose], { type: fileChoose?.type }));
    dispatch(createProductStart({ formData, hide }));

  };

  const editorContent = watch("detailDesc");
  const onEditorStateChange = (editorState) => {
    setValue("detailDesc", editorState);
  };
  return (
    <div className="flex flex-col items-center p-5 gap-5 ">
      <form onSubmit={handleSubmit(onCreateProduct)} className='flex gap-3 mb-10' encType='multipart/form-data'>
        <fieldset className='py-10 h-fit flex flex-col justify-center items-center px-6 bg-white drop-shadow-md shadow-inner rounded-xl gap-10 text-black'>
          <div className='flex flex-col items-center gap-2'>
            <img src={selectedImage ? selectedImage : "http://localhost:8080/images/setting/default-product"} alt="Avatar"
              className='w-[150px] h-[150px] shadow-md rounded-md overflow-hidden text-center align-middle'>
            </img>
            <input
              type="file" id="file-input"
              class="hidden" onChange={handleImageChange}
            />
            <label id="file-input-label" for="file-input" className='flex items-center gap-2 text-sm text-blue-900
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

        <fieldset className='w-[900px] py-10 flex flex-col justify-center items-center px-6 bg-white drop-shadow-md shadow-inner rounded-xl gap-4 text-black'>
          <div className='flex justify-start gap-2 items-start self-start w-full'>
            <label htmlFor='first-name' className='whitespace-nowrap'>
              Tên sản phẩm (*)
            </label>
            <div className="flex flex-col w-full">
              <input type='text'
                id="first-name"
                className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'
                {...register("name")}>
              </input>
              <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.firstName?.message}</pre></div>
            </div>

          </div>
          <div className='flex gap-10 items-center w-full justify-start'>
            <div className='w-[50%] flex justify-start gap-2 items-start'>
              <label htmlFor='last-name' className='whitespace-nowrap w-[30%]'>
                Mã sản phẩm (*)
              </label>
              <div className="flex flex-col  w-[70%]">
                <input type='text'
                  id="last-name"
                  className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px]'
                  {...register("skuCode")}>
                </input>
                <div className="text-red-500 text-sm mt-1 font-serif "><pre className='font-serif'>    {errors.lastName?.message}</pre></div>
              </div>
            </div>
            <div className='w-[46%] flex gap-7 items-baseline'>
              <label htmlFor='last-name' className='whitespace-nowrap w-[20%]'>
                Giá bán (*)
              </label>
              <div className="flex flex-col  w-full">
                <input type='text'
                  id="last-name"
                  className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] '
                  {...register("price")}>
                </input>
                <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.lastName?.message}</pre></div>
              </div>

            </div>
          </div>
          <div className='w-[50%] flex justify-start gap-2 items-start self-start'>
            <label htmlFor='first-name' className='whitespace-nowrap w-[30%]'>
              Danh mục (*)
            </label>
            <div className="flex flex-col w-[70%]">
              <select name="categoryId"
                {...register('categoryId')}
                id="categoryId"
                data-te-select-init
                className='input' >
                {categories.map(item => <option key={item.id} value={item.id} className='block'  >{item.name}</option>)}
              </select>
              <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.firstName?.message}</pre></div>
            </div>
          </div>
          <div className='w-[100%] flex flex-col justify-start gap-2 items-start'>
            <label htmlFor='email' className='whitespace-nowrap'>
              Mô tả ngắn (*)
            </label>
            <div className="flex flex-col w-full">
              <textarea type='email'
              spellCheck={false}
                id="email"
                className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full h-[150px]'
                {...register("shortDesc")} >
              </textarea>
              <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.email?.message}</pre></div>
            </div>

          </div>

          <div className='w-[100%] flex flex-col justify-start gap-2 items-start'>
            <label htmlFor='email' className='whitespace-nowrap'>
              Mô tả chi tiết
            </label>
            <div className="flex flex-col w-full">
              <ReactQuill
               spellCheck={false}
                className='h-[500px] '
                modules={modules}
                theme="snow"
                name='detailDesc'
                value={editorContent}
                onChange={onEditorStateChange}
              />
              <div className="text-red-500 text-sm mt-1 font-serif"><pre className='font-serif'>    {errors.email?.message}</pre></div>
            </div>

          </div>


        </fieldset>
        <div className='gap-2 fixed bottom-0 w-full bg-slate-700 p-2 right-0 flex justify-end '>
          <button className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
          >
            Thêm</button>
          <div className=""></div>
        </div>
        {/* 
        <div className='gap-2 fixed bottom-0 w-full bg-slate-100 p-1 right-0 flex justify-end'>
          <button className="button"
            onClick={() => hide()}>
            Hủy
          </button>
          <button type="submit" className="button">
            Thêm
          </button>
        </div> */}
      </form>
    </div>
  )
}

export default AddProduct;
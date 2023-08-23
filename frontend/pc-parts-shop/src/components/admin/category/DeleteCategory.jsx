import React from 'react'
import { useDispatch } from 'react-redux'
import { deleteCategoryStart } from '../../../redux/slices/categorySlice';

const DeleteCategory = ({category, hide}) => {
  const dispatch = useDispatch();
  const handleDeleteCategory = () => {
    dispatch(deleteCategoryStart({category, hide}));
  }

  return (
    <div className='py-5 px-20 flex flex-col gap-3 justify-start items-center shadow-md overflow-hidden'>
          <div>Bạn chắc chắn muốn xóa danh mục <span className='font-semibold'>#{category.id} - {category.name} ?</span></div>
          <img src={category.image || "http://localhost:8080/images/setting/default-product" } alt="" 
            className='w-16 h-16 rounded-md'></img>
          <div className='flex gap-5 my-4'>
          <button className='middle none center mr-4 rounded-lg bg-red-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
              onClick={() => hide()}
            >&nbsp;&nbsp;Quay lại&nbsp;&nbsp;</button>
            <button className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                onClick={handleDeleteCategory}
              >
              Đồng ý</button>
          </div>
        </div>
  )
}

export default DeleteCategory
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {BiSolidCategory} from 'react-icons/bi'
import { convertToPath } from '../../utils/convert_helper';
import { useNavigate } from 'react-router-dom';

import { getAllCategoryStart } from '../../redux/slices/categorySlice';
import { getAllProduct } from '../../redux/apis/productApi';

const Home = () => {
 
  const { categories } = useSelector(state => state.categories);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategoryStart());
  },[dispatch]);

 
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
      });
    };
    scrollToTop();
  },[]);

  return (
    <div className='flex justify-start items-start flex-col mt-[0.25px] bg-slate-100 h-full'>
      <div className='flex justify-start my-1'>
        <img src="http://localhost:8080/images/setting/home1" className='w-[50%] pr-[0.5px] h-[130px] shadow-sm'></img>
        <img src="http://localhost:8080/images/setting/home2" className='w-[50%] pl-[0.5px] h-[130px] shadow-sm'></img>
      </div>
      <div className='flex items-center text-slate-800 gap-2 justify-start px-3 pt-[-10px] w-full bg-slate-200 p-1 '>
        <BiSolidCategory size={21} />
        <div className='text-xl font-bold'>Danh mục sản phẩm</div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2 w-full bg-slate-100 p-1">
        {
          categories.map(category => category.active &&
            <div key={category.id}
              class="p-4 bg-white rounded-lg  shadow-sm hover:shadow-md flex flex-col justify-center items-center">
              <img src={category?.image} class="w-32 h-32 bg-gray-100 rounded-lg"
                onClick={() => navigate("/" + convertToPath(category.id + "-" + category.name))}></img>
              <h2 class="mt-2 text-gray-800 text-sm font-semibold line-clamp-1">
                {category.name}
              </h2>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home
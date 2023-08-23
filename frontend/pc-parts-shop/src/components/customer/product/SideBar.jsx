import React, { useEffect, useState } from 'react'
import Card from '../../Card';
import { useDispatch, useSelector } from 'react-redux'
import { getAllCategoryStart } from '../../../redux/slices/categorySlice';
import { convertToPath } from '../../../utils/convert_helper';
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector(state => state.categories)
  const [selectedCategory, setSelectedCategory] = useState(()=> {
    const currentUrl = window.location.href;
    return currentUrl.split('/')[1];
  });
  // useEffect(()=> {
  //   dispatch(setSelected(categories.filter(category => convertToPath(category.name) === selectedCategory)));
  // },[selectedCategory, categories]);
  useEffect(() => {
    dispatch(getAllCategoryStart());
  },[]);
 
  return (
    <div className='fixed top-0 left-0 min-w-[18%] '>
      <Card>
        <div className='flex flex-col items-start justify-start h-screen bg-slate-200'>
          <div className='relative pt-16 w-full'>
            <h1 className='text-lg text-center p-1 w-full text-black font-bold my-2 '>
              DANH MỤC SẢN PHẨM
            </h1>
          </div>
          <div class="h-full bg-gray-50 dark:bg-gray-800 w-full overflow-y-auto ">
            <ul class="font-medium">
              {
                categories.map(category => category.active && 
                  <li  onClick={() => {
                        // setClick(category);
                        navigate("/" + convertToPath(category.id + "-" + category.name));
                    }}>
                    <div href="#" className="flex items-center p-2 text-gray-900  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group border-b-[1.5px]">
                      <img src={category?.image} class="w-7 h-7 bg-gray-100 rounded-lg"></img>
                      <span class="ml-3 text-sm">
                        {category?.name}
                      </span>
                    </div>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SideBar
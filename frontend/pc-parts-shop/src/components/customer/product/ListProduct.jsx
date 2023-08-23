import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import Select from '../../Select'
import { TfiShoppingCartFull } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';
import { convertToPath, formatMoney, getPathAndFragmentFromURL } from '../../../utils/convert_helper';
import { getAllProductStart } from '../../../redux/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategory } from '../../../redux/apis/categoryApi';
import { getAllCategoryStart } from '../../../redux/slices/categorySlice';
import { addToCartStart, addToCartSuccess, updateCartStart, updateCartSuccess } from '../../../redux/slices/cartSlice';
import {calculateJaccardSimilarity} from '../../../utils/search_helper';
import Toast from '../../../utils/toast_helper';

const optionsSort = [
  {
    name: "Không",
    value: "none"
  },
  {
    name: "Giá giảm dần",
    value: "descPrice"
  },
  {
    name: "Giá tăng dần",
    value: "ascPrice"
  },
  {
    name: "Giảm giá nhiều",
    value: "discount"
  }]

const ListProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState(null);

  // useImperativeHandle(ref, () => ({
  //   setChangeProductList: (category) => setSelectedCategory(category),
  //   setSearchText: (text) => setSearchText(text)
  // }));

  const { products } = useSelector(state => state.products);
  const { categories } = useSelector(state => state.categories);
  const { currentUser } = useSelector(state => state.auth);
  const { currentCart } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
      });
    };
    scrollToTop();
  },[data])
  
  useEffect(() => {
    const { path: urlCurrent, fragment, params } = getPathAndFragmentFromURL(window.location.href);
    if (params.keywords?.length > 0) {
      console.log(params.keywords)
      setSelectedCategory(null);
      setSearchText(decodeURIComponent(params.keywords));
    }
    else {
      setSearchText(null);
      const category = categories.find(category => convertToPath(category.id + "-" + category?.name) === urlCurrent);
      if (category) setSelectedCategory(categories.find(category => convertToPath(category.id + "-" + category?.name) === urlCurrent));
    }
  }, [window.location.href, categories, products]);

  useEffect(() => {
    if(!selectedCategory) return;
    setData([...products.filter(product => product.categoryId === selectedCategory?.id).sort((a,b) => b.id - a.id)]);
  }, [selectedCategory, products]);

  useEffect(() => {
    if(!searchText) return;
    setData(([...products.filter(product => calculateJaccardSimilarity(
      new Set(searchText.toLowerCase().split(' ')),
      new Set(product.name.toLowerCase().split(' '))
    ))]).sort((a, b) => {
      const aSimilarity = calculateJaccardSimilarity(
        new Set(searchText.toLowerCase().split(' ')),
        new Set(a.name.toLowerCase().split(' '))
      );
      const bSimilarity = calculateJaccardSimilarity(
        new Set(searchText.toLowerCase().split(' ')),
        new Set(b.name.toLowerCase().split(' '))
      );
      return bSimilarity - aSimilarity;
    }));
  }, [searchText,products]);
  console.log("as", data);
  useEffect(() => {
    dispatch(getAllProductStart())
  }, [])


  useEffect(() => {
    dispatch(getAllCategoryStart());
  }, []);

  const navigate = useNavigate();
  const selectSort = useRef();
  const handleClickProduct = (product) => {
    console.log("OK")
    navigate("/" + convertToPath(categories.find(item => item.id === product.categoryId).name) + "/" + convertToPath(product.name + "---s" + product.skuCode));
  }

  const handleAddToCart = ({ skuCode, quantity }) => {
    const item = currentCart.find((item) => item.skuCode === skuCode);
    if (currentUser?.role === "CUSTOMER") {
      if (item) {
        dispatch(updateCartStart({ skuCode, quantity: item.quantity + quantity, isAdd: true}));
      }
      else dispatch(addToCartStart({ skuCode, quantity }));
    }
    else {
      if (item) {
        dispatch(updateCartSuccess({ skuCode, quantity: item.quantity + quantity, isAdd: true }));
        Toast.success("Đã thêm sản phẩm vào giỏ hàng");
      }
      else {
        dispatch(addToCartSuccess({ skuCode, quantity }));
        Toast.success("Đã thêm sản phẩm vào giỏ hàng");
      }
    }
  }
  
  const handleSortChange = ({value}) => {
    if(value === "none"){
      setData([...data].sort((a,b) => b.id - a.id));
    }
    else if(value === "ascPrice"){
      setData([...data].sort((a, b) => a.price - b.price));
    }
    else if(value === "descPrice"){
      setData([...data].sort((a, b) => b.price - a.price));
    }
    else{ // discount
      setData([...data].sort((a, b) => b.discount*b.price - a.discount*a.price))
    }
  }
  return (
    <div className='ml-[20%]'>
    
      <div class=" bg-slate-50 pt-10 shadow-md mt-16 min-h-screen">
        <div class="mx-auto max-w-2xl sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8 w-full">
          <div class="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {data?.map(datum => datum.active && <div class="group relative shadow-md p-3 rounded-md bg-white z-0">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src={datum.image} alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={() => handleClickProduct(datum)}>
                      <span aria-hidden="true" className="absolute inset-0 truncate "></span>
                      {datum.name.length > 45 ? datum.name.substring(0, 42) + "..." : datum.name.length}
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900 my-1 flex gap-4 ">
                    <div className='w-full'>
                      {datum.discount > 0 ? <div className='flex w-full justify-start'>
                        <div>{formatMoney((100 - datum.discount) * datum.price / 100)}</div>
                        <div className='text-red-600 line-through line ml-auto'>{formatMoney(datum.price)}</div>
                      </div> :
                        formatMoney(datum.price)}
                    </div>
                    <div></div>
                  </p>
                  <div className='flex w-full justify-end relative text-red-600 items-center'>
                    <div className='mr-auto'>{datum.discount > 0 && "-" + datum.discount + "%"}</div>
                    <button
                      class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs"
                      onClick={() => handleAddToCart({ skuCode: datum.skuCode, quantity: 1 })}>Thêm vào giỏ</button>
                  </div>
                </div>
              </div>
            </div>)}


            {/* <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>



            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="group relative shadow-md p-3 rounded-md bg-white ">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-40">
                <img src="https://lh3.googleusercontent.com/3vrW3GscQ8TiIWlRO1SqK-J_R_9kgSRgU2dzlRzw6fZxBYO_4YFJHSjRTvFpcNg-sEQ88oHSDAmgEdQ4MQ=w500-rw" alt="Front of men&#039;s Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div class="mt-4 flex justify-betwee">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <div className="cursor-pointer" onClick={handleClickProduct}>
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      CPU Intel Core I7-7700 (3.6GHz)
                    </div>
                  </h3>
                  <p class="text-sm font-medium text-gray-900">8.299.000 ₫</p>
                  <div className='flex w-full justify-end relative text-red-500 items-center'>
                  <button
                  class="px-3 py-1 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-xs">Add
            to cart</button>
                  </div>
                </div>
              </div>
            </div> */}

          </div>
        </div>
      </div>
      <div className='fixed w-[80%] shadow-md bg-neutral-50 rounded-sm flex items-center overflow-visible top-16'>
        <h2 class="text-md font-semibold tracking-tight text-gray-900 p-3 shadow-sm">{selectedCategory?.name ? 'Danh mục "' +  selectedCategory?.name + '"' : searchText && 'Tìm kiếm "' + searchText + '"'}</h2>
        <div className='flex gap-2 items-center justify-end ml-auto mr-2'>
          <div className='ml-10  font-normal text-gray-600'>Xếp theo</div>
          <div className='w-[150px]'>
            <Select ref={selectSort} options={optionsSort}  setOnSelected={handleSortChange}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListProduct;
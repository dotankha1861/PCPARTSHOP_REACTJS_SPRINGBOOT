import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { getProductBySkuCode } from '../../../redux/apis/productApi';
import { formatMoney } from '../../../utils/convert_helper';
import { deleteCartStart, deleteCartSuccess, updateCartStart, updateCartSuccess } from '../../../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { updateCartItem } from '../../../redux/apis/cartApi';

const CartDetail = ({showSubmit}, ref) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {currentUser} = useSelector(state => state.auth);
  const { currentCart } = useSelector(state => state.cart);
  const [data, setData] = useState([]);

  useImperativeHandle(ref, () => ({
    getDetailCart: () => data,
  }));

  useEffect(() => {
    const getDetail = async () => {
      let data = [];
      for (const item of currentCart) {
        const { data: resBody } = await getProductBySkuCode(item.skuCode);
        data =[...data, { ...resBody.data, quantity: item.quantity }];
      }
      setData(data);
    }
    getDetail();
  }, []);

  useEffect(() => {
    showSubmit(() => true);
  }, [data]);

  const handleClickDelete = (skuCode) => {
    if(currentUser?.role === "CUSTOMER") {
      dispatch(deleteCartStart({ skuCode , setData: () => setData((preData) => preData.filter(item => item.skuCode !== skuCode)) }));
    }
    else {
      dispatch(deleteCartSuccess({ skuCode }));
      setData((preData) => preData.filter(item => item.skuCode !== skuCode));
    }
  }

  const handleUpdateQuantity = ({skuCode, quantity}) => {
    if(currentUser?.role === "CUSTOMER") dispatch(updateCartStart({skuCode, quantity}));
    else dispatch(updateCartSuccess({skuCode, quantity}));
  }

  
  return (
    <div className="flex flex-col items-center mx-3 mb-5 w-[1000px]">

      <div className='text-black text-center align-middle w-full'>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            {data.length > 0 && <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3 w-[100px]">
                  <span class="sr-only">Image</span>
                </th>
                <th scope="col" class="px-6 py-3 w-[400px]">
                  Sản phẩm
                </th>
                <th scope="col" class="px-6 py-3 text-center w-[200px]">
                  Số lượng
                </th>
                <th scope="col" class="px-6 py-3 text-start w-[150px]">
                  Giá
                </th>
                <th scope="col" class="px-6 py-3 text-center w-[300px]">
                  Thành tiền
                </th>
                <th scope="col" class="px-6 py-3 text-center w-[100px]">
                  
                </th>
               
              </tr>
            </thead>}
            <tbody>
              {
                 data.map((item, index) => <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 h-[80px]">
                  <td class=" p-4 flex flex-col w-[100px] ">
                    <img src={item.image} className="w-16 h-16" alt="Apple Watch" />
                    <div>{item.skuCode}</div>
                  </td>
                  <td class="w-[400px] px-6 py-4 font-semibold text-gray-900 dark:text-white whitespace-pre-wrap">
                    {item.name}
                  </td>
                  <td class="px-6 py-4 w-[200px]">
                    <div class="flex items-center space-x-3">
                      <button class="inline-flex items-center justify-center p-1 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button"
                        onClick={() => {
                          item.quantity > 1 && setData(() => data.map(datum => datum.id === item.id  ? {...datum, quantity: datum.quantity - 1} : datum))
                          item.quantity > 1 && handleUpdateQuantity({skuCode: item.skuCode, quantity: item.quantity-1})
                        }}>
                        <span class="sr-only">Quantity button</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
                        </svg>
                      </button>
                      <div>
                        <input type = "text" class="text-center justify-center bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" value={item.quantity} 
                        onChange={(e) => {
                          if(e.target.value < 1) e.target.value = "";
                          item.quantity >= 1 && setData(() => data.map(datum => datum.id === item.id  ? {...datum, quantity: e.target.value} : datum))
                          item.quantity >= 1 && handleUpdateQuantity({skuCode: item.skuCode, quantity: Number(e.target.value)});
                        }}></input>
                      </div>
                      <button onClick={() => {
                        setData(() => data.map(datum => datum.id === item.id  ? {...datum, quantity: datum.quantity + 1} : datum))
                        handleUpdateQuantity({skuCode: item.skuCode, quantity: item.quantity+1})
                      } }
                        class="inline-flex items-center justify-center h-6 w-6 p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                        <span class="sr-only">Quantity button</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white w-[150px]">
                    {item.discount > 0 ? <div className='flex gap-2 flex-col'>
                      <div className='flex'>
                        <div className='line-through text-red-600'>{formatMoney(item.price)}</div>
                        <div className='ml-auto'>-{item.discount + "%"}</div>
                      </div>
                      <div>{formatMoney((item.price - item.discount * item.price / 100) * item.quantity)}</div>
                    </div> : <div>{formatMoney(item.price)}</div>
                    }
                  </td>
                  <td className="w-[200px] text-center px-6 py-4 font-semibold text-gray-900 dark:text-white">{formatMoney((item.price - item.discount * item.price / 100) * item.quantity)}</td>
                  <td class="px-6 py-4">
                    <div class="font-medium text-red-600 dark:text-red-500 hover:underline" onClick={() => handleClickDelete(item.skuCode)}>Xóa</div>
                  </td>
                </tr>
                )
              }


            </tbody>
            {data.length > 0  && <tr>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Image</span>
              </th>
              <th scope="col" class="px-6 py-3 text-slate-900">
                Tổng
              </th>
              <th scope="col" class="px-6 py-3 text-center text-red-500">
                {data.reduce((curr, item) => Number(item.quantity) + curr, 0)}
              </th>
              <th scope="col" class="px-6 py-3 text-center">

              </th>
   
              <th scope="col" class="px-6 py-3 text-center text-red-500 text-xl w-[300px]">
                {formatMoney(data.reduce((curr, item) => (item.price - item.discount * item.price / 100) * Number(item.quantity) + curr, 0))}
              </th>
              <th scope="col" class="px-6 py-3 text-center text-red-500">

              </th>
            </tr>}

          </table>
        </div>
      </div>
    </div>
  )
}

export default forwardRef(CartDetail);
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useRef } from 'react'
import { RiBillLine } from 'react-icons/ri'
import Select from '../../components/Select'
import Modal from '../../components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrderByCustomerId } from '../../redux/apis/orderApi';
import { getAllOrderCustomerStart } from '../../redux/slices/orderSlice';
import { formatMoney } from '../../utils/convert_helper';
import ViewDetail from '../../components/customer/order/ViewDetail';
import CancelOrder from '../../components/customer/order/cancelOrder';

const optionsFilter = [
  {
    name: "Tất cả",
    value: "all"
  },
  {
    name: "Chờ xác nhận",
    value: "CHOXACNHAN"
  },
  {
    name: "Đã xác nhận",
    value: "XACNHAN"
  },
  {
    name: "Đang giao",
    value: "DANGGIAO"
  },
  {
    name: "Hoàn tất",
    value: "HOANTAT"
  },
  {
    name: "Đã hủy",
    value: "DAHUY"
  }
]

const HistoryOrder = () => {
  const { orders } = useSelector(state => state.orders);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const selectSort = useRef();
  const orderDetailModal = useRef();
  const cancelOrderModal = useRef();

  const [orderSelected, setOrderSelected] = useState();
  
  const handleClickOrderDetail = () => {
    orderDetailModal.current.show();
  }

  useEffect(() => {
    setData(orders);
  }, [orders]);

  useLayoutEffect(() => {
    dispatch(getAllOrderCustomerStart());
  },[dispatch])

  const onSelectedSelect = ({value}) => {
    if(value === "all") setData(orders);
    else setData(orders.filter(item => item.status === value));
  }


  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
      });
    };
    scrollToTop();
  },[]);

  return (
    <div className="flex flex-col items-center mx-3 mb-5 justify-center">
      <div className='font-bold my-3 self-start text-lg flex gap-2 items-center w-fit'>
        <RiBillLine size={21} />
        <div className='font-bold my-3 self-start text-lg'>ĐƠN HÀNG ĐÃ ĐẶT
        </div>
        <div className='w-[150px] ml-3 '>
          <Select ref={selectSort} options={optionsFilter} setOnSelected={onSelectedSelect} />
        </div>
      </div>

      <div className='text-black w-[95%] text-center align-middle'>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3 w[50px]" className='text-center w-[100px]'>
                  Mã ĐH
                </th>
                <th scope="col" class="px-6 py-3 w-[250px]">
                  Sản phẩm
                </th>
                <th scope="col" class="px-6 py-3 text-center w-[150px]">
                  Thời gian đặt
                </th>
                <th scope="col" class="px-6 py-3 text-center w-[150px]">
                  Tổng tiền
                </th>
                <th scope="col" class="px-6 py-3 text-center w-[200px]">
                  Trạng thái
                </th>
                <th scope="col" class="px-6 py-3 text-center w-[200px]">

                </th>
                <th scope="col" class="px-6 py-3 text-center w-[150px]">

                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map(order => <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {order.id}
                </td>
                <td class="w-[350px] p-4">
                  <div className='flex flex-col gap-1'>
                    <img src={order.firstProductImage} className="w-16 h-16" alt="Apple Watch" />
                    <div className="text-black">{order.firstProductName} <span className='whitespace-pre-wrap text-red-600'>{order.quantityProduct > 1 && <span>{"và " + (order.quantityProduct - 1) + " sản phẩm khác"}</span>}</span></div>
                  </div>
                </td>
                <td class="px-6 py-4 font-semibold text-gray-500 dark:text-white text-center">
                  {order.createdAt}
                </td>
                <td class="px-6 py-4 font-semibold text-red-500 dark:text-white text-center">
                  {formatMoney(order.total)}
                </td>
                <td className='text-center px-6 py-4 font-semibold text-gray-900 dark:text-white uppercase'>{optionsFilter.find(item => item.value === order.status).name}</td>
                <td className="text-center px-6 py-4 font-semibold dark:text-white text-blue-800"
                   onClick={() => {
                    setOrderSelected(() => order);
                    orderDetailModal.current.show();
                  }}>Xem chi tiết</td>
                {order.status === "CHOXACNHAN" && <td className="text-center px-6 py-4 font-semibold dark:text-white text-red-500"
                  onClick={() => {
                    setOrderSelected(() => order);
                    cancelOrderModal.current.show();
                  }}>Hủy đơn</td>}
              </tr>)}


            </tbody>
          </table>
        </div>
      </div>
      <Modal ref={orderDetailModal}><ViewDetail hide={() => orderDetailModal.current.hide()} order={orderSelected}></ViewDetail></Modal>
      <Modal ref ={cancelOrderModal}><CancelOrder hide={() => cancelOrderModal.current.hide()} order={orderSelected}></CancelOrder></Modal>
    </div>
  )
}

export default HistoryOrder
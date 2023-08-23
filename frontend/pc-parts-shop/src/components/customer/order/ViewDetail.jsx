import React, { useEffect, useState } from 'react'
import { getOrderDetailsByOrderId } from '../../../redux/apis/orderApi';
import { formatMoney } from '../../../utils/convert_helper';

const orderStatus = [
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

const ViewDetail = ({ order, hide }) => {
    const [data, setData] = useState();
    useEffect(() => {
        const getOrderDetails = async() => {
            try{
                const {data: resBody} = await getOrderDetailsByOrderId(order.id);
                setData(() => resBody.data);
            }
            catch(error) {
                //Xử lý sau
            }
        }
        getOrderDetails();
    },[])
    return (
        <div className='h-screen'>
            <div className='text-center font-bold text-xl'>ĐƠN HÀNG</div>

            <div className="flex flex-col items-center mx-10 mb-5">
                <div className='flex items-start justify-start w-full flex-col'>
                    <div>Mã đơn hàng: {order.id}</div>
                    <div>Thời gian đặt: {order.createdAt}</div>
                    <div>Trạng thái: {orderStatus.find(item => item.value === order.status).name} </div>

                </div>
                <div className='font-bold mt-3 self-start text-lg'>THÔNG TIN NGƯỜI NHẬN</div>
                <div className='flex items-start justify-start w-full flex-col'>
                    <div className='flex w-full'>
                        <div className='w-[60%]'>Họ tên: {order.fullName}</div>
                        <div className='w-[40%]'>Email: {order.email}</div>
                    </div>
                    <div className='flex w-full'>
                        <div className='w-[60%]'>Địa chỉ: {order.address}</div>
                        <div className='w-[40%]'>Số điện thoại: {order.phone} </div>
                    </div>
                    <div>Ghi chú: {order.note}</div>
                </div>
                <div className='font-bold self-start text-lg flex gap-2 items-center'>
                    {/* <FaShoppingCart size={21} /> */}
                    <div className='font-bold mt-3 self-start text-lg'>CHI TIẾT ĐƠN HÀNG</div>
                </div>

                <div className='text-black w-full text-center align-middle'>
                    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" class="px-6 py-3 w-[100px]">
                                        <span class="sr-only">Image</span>
                                    </th>
                                    <th scope="col" class="px-6 py-3 w-[400px]">
                                        Sản phẩm
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-center w-[150px]">
                                        Số lượng
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-start w-[150px]">
                                        Giá
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-center w-[200px]">
                                        Thành tiền
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-center w-[100px]">

                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.map((item, index) => <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 h-[80px]">
                                        <td class=" p-4 flex flex-col w-[100px] ">
                                            <img src={item.image} className="w-16 h-16" alt="Apple Watch" />
                                            <div>{item.skuCode}</div>
                                        </td>
                                        <td class="w-[400px] px-6 py-4 font-semibold text-gray-900 dark:text-white whitespace-pre-wrap">
                                            {item.name}
                                        </td>
                                        <td class="w-[150px] px-6 py-4 font-semibold text-gray-900 dark:text-white whitespace-pre-wrap text-center">
                                            {item.quantity}
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
                    
                                    </tr>
                                    )
                                }


                            </tbody>
                            {data && <tr>
                                <th scope="col" class="px-6 py-3">
                                    <span class="sr-only">Image</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-slate-900">
                                    Tổng
                                </th>
                                <th scope="col" class="px-6 py-3 text-center text-red-500">
                                    {data.reduce((curr, item) => item.quantity + curr, 0)}
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">

                                </th>

                                <th scope="col" class="px-6 py-3 text-center text-red-500 text-xl">
                                    {formatMoney(data.reduce((curr, item) => (item.price - item.discount * item.price / 100) * item.quantity + curr, 0))}
                                </th>
                                <th scope="col" class="px-6 py-3 text-center text-red-500">

                                </th>
                            </tr>}

                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewDetail
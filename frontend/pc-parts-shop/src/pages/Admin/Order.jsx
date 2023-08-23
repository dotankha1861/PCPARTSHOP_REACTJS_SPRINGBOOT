import { useDispatch, useSelector } from 'react-redux'
import Table, { AvatarCell, SelectColumnFilter, StatusPill } from '../../components/table/Table'  // new
import React, { useEffect, useRef, useState } from 'react'
import { getAllCategoryStart } from '../../redux/slices/categorySlice'
import { classNames } from '../../components/table/shared/Utils'
import { BiSolidEdit } from 'react-icons/bi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import AddCategory from '../../components/admin/category/AddCategory'
import Modal from '../../components/Modal'
import DeleteCategory from '../../components/admin/category/DeleteCategory'
import UpdateCategory from '../../components/admin/category/UpdateCategory'
import AddPromotion from '../../components/admin/promotion/AddPromotion'
import { getAllPromotionStart } from '../../redux/slices/promotionSlice'
import { formatMoney, getStatusDateBetween } from '../../utils/convert_helper'
import { LuView } from 'react-icons/lu'
import UpdatePromotion from '../../components/admin/promotion/UpdatePromotion'
import DeletePromotion from '../../components/admin/promotion/DeletePromotion'
import { approveOrderStart, approveOrderSuccess, cancelOrderStart, getAllOrderStart, updateStatusOrderStart } from '../../redux/slices/orderSlice'
import { approveOrder, cancelOrder } from '../../redux/apis/orderApi'
import Toast from '../../utils/toast_helper'
import ViewDetail from '../../components/customer/order/ViewDetail'
import { getAllEmployee } from '../../redux/apis/employeeApi'
import { getAllEmployeeStart } from '../../redux/slices/employeeSlice'
import CancelOrder from '../../components/customer/order/cancelOrder'
import CompleteOrder from '../../components/customer/order/CompleteOrder'

const Order = () => {
  const dispatch = useDispatch();

  const { employees } = useSelector(state => state.employees);

  const { currentUser } = useSelector(state => state.auth);

  const handleApproveOrder = (id) => {
    dispatch(approveOrderStart({ employeeId: currentUser.employeeId, employeeName: currentUser.lastName + " " + currentUser.firstName, orderId: id }));
  }

  const handleUpdateStatusOrder = ({ orderId, status, hide }) => {
    dispatch(updateStatusOrderStart({ orderId, status, hide }));
  };

  const orderStatus = React.useMemo(() => {
    return {
      CHOXACNHAN: "Chờ xác nhận",
      XACNHAN: "Đã xác nhận",
      DANGGIAO: "Đang giao",
      HOANTAT: "Hoàn tất",
      DAHUY: "Đã hủy"
    }
  }, []);
  useEffect(() => {
    dispatch(getAllEmployeeStart());
  }, []);

  const columns = React.useMemo(() => [
    {
      Header: "Id",
      accessor: 'id',
      Cell: ({ value }) => {
        return (
          <div className="w-[20px]">
            {value}
          </div>
        )
      }
    },
    {
      Header: "Khách hàng",
      accessor: '',
      Cell: ({ row, value }) => {
        return (
          <div className='flex flex-col gap-2'>
            <div className="flex items-center w-fit text-sm text-body justify-center">
              #{row.original.customerId}
            </div>
            <div className="flex items-center w-fit text-sm text-body justify-center">
              {row.original.customerName}
            </div>
          </div>
        );
      }
    },
    {
      Header: "Thời gian đặt",
      accessor: 'createdAt',
      Cell: ({ value }) => {
        const index = value.lastIndexOf(' ');
        return (
          <div className='flex flex-col gap-2'>
            <div className="flex items-center w-fit text-sm text-body justify-center">
              {value.substring(0, index)}
            </div>
            <div className="flex items-center w-fit text-sm text-body justify-center">
              {value.substring(index + 1)}
            </div>
          </div>
        )
      }
    },
    {
      Header: "Người nhận",
      accessor: '',
      Cell: ({ value, column, row }) => {
        return (
          <div className='flex flex-col gap-2'>
            <div className="flex items-center w-fit text-sm text-body justify-center">
              {row.original.fullName}
            </div>
            <div className="flex items-center w-fit text-sm text-body justify-center">
              {row.original.email}
            </div>
            <div className="flex items-center w-fit text-sm text-body justify-center">
              {row.original.phone}
            </div>
          </div>
        )
      }
    },
    {
      Header: "Trạng thái",
      pairsFilter: orderStatus,
      Filter: SelectColumnFilter,
      accessor: 'status',
      Cell: ({ value, column, row }) => {
        return (
          <div className='flex flex-col gap-2 text-center'>
            <div className={
              classNames(
                "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
                value === "HOANTAT" ? "bg-green-100 text-green-800" : null,
                value === "CHOXACNHAN" ? "bg-yellow-100 text-yellow-800" : null,
                value === "XACNHAN" ? "bg-orange-100 text-orange-800" : null,
                value === "DANGGIAO" ? "bg-blue-100 text-blue-800" : null,
                value === "DAHUY" ? "bg-red-100 text-red-800" : null,
              )
            }>
              {orderStatus[value]}
            </div>
          </div>
        )
      }
    },
    {
      Header: "Nhân viên quản lý",
      accessor: 'employeeId',
      pairsFilter: {
        ...employees?.reduce((object, item) =>
          ({ ...object, [item.employeeId]: item.employeeId + " - " + item.lastName + " " + item.firstName }), {}), "null": "Chưa duyệt"
      },
      Filter: SelectColumnFilter,
      Cell: ({ value, column, row }) => {
        return (
          <div className='flex flex-col gap-2 items-center'>
            <div className="flex items-center w-fit text-sm text-body justify-center">
              {value !== "null" ? <div className='flex flex-col gap-2'>
                <div className="flex items-center w-fit text-sm text-body justify-center">
                  #{row.original.employeeId}
                </div>
                <div className="flex items-center w-fit text-sm text-body justify-center">
                  {row.original.employeeName}
                </div>
              </div> : <div className="">Chưa duyệt</div>}
            </div>
          </div>
        )
      }
    },
    {
      Header: "Tính năng",
      accessor: "",
      Cell: ({ row }) => {
        const [toggle, setToggle] = useState(false);
        const update = useRef();
        const handleToggle = (e) => {
          if (update.current?.contains(e.target)) {
            setToggle(() => !toggle);
          }
          else if (toggle) setToggle(() => !toggle);
        }

        useEffect(() => {
          document.addEventListener('click', handleToggle);
          return () => document.removeEventListener('click', handleToggle);
        });
        return <div className='flex gap-10'>
          {
            row.original.employeeId !== "null" ? <div className="flex items-center gap-5">
              <LuView className='text-blue-600 cursor-pointer font-semibold text-sm'
                size={24}
                onClick={() => {
                  setOrderSelected(row.original);
                  orderDetailModal.current.show()
                }} />
              {!(["HOANTAT", "DAHUY"].includes(row.original.status)) && <div className='ralative text-yellow-600 cursor-pointer font-semibold text-sm'
              >
                {row.original.employeeId == currentUser.employeeId &&
                <div className='relative w-[100px] min-w-200px z-1'>
                  <button id="dropdownActionButton" data-dropdown-toggle="dropdownAction" class="w-full inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100  focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                    <div ref={update} className='text-center w-full'>Cập nhật</div>
                  </button>
                  {
                    toggle && <div id="dropdownAction" className={
                      classNames(
                        "w-full z-10 absolute right-0 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ",
                        // position === "TOP" ? "bottom-full" : null
                      )
                    }>
                      <ul class="text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">
                        {row.original.status == "XACNHAN" ? <li className='hover:text-gray-70 hover:bg-neutral-200 py-2 px-5'
                          onClick={() => handleUpdateStatusOrder({ orderId: row.original.id, status: "DANGGIAO" })} >
                          Đang giao
                        </li> : <li className='hover:text-gray-70 hover:bg-neutral-200 py-2 px-5'
                          onClick={() => handleUpdateStatusOrder({ orderId: row.original.id, status: "XACNHAN" })}>
                          Đã xác nhận
                        </li>}

                        <li className='hover:text-gray-70 hover:bg-neutral-200 py-2 px-5'
                         onClick={() => {completeOrderModal.current.show(); setOrderSelected(() => row.original)}}>
                          Hoàn tất
                        </li>
                        <li className='hover:text-gray-70 hover:bg-neutral-200 py-2 px-5'
                          onClick={() => {cancelOrderModal.current.show(); setOrderSelected(() => row.original)}}>
                          Đã hủy
                        </li>
                      </ul>
                    </div>
                  }
                </div>
                 }
              </div>}
            </div> :  <div className="flex gap-2 justify-center items-center">
              <LuView className='text-blue-600 cursor-pointer font-semibold text-sm'
                size={row.original.status == "DAHUY" ? 24: 70}
                onClick={() => {
                  setOrderSelected(row.original);
                  orderDetailModal.current.show()
                }} />
                {
                  row.original.status != "DAHUY" && <div className="text-green-600 cursor-pointer h-8 flex justify-center items-center w-full  bg-white border border-gray-300 focus:outline-none hover:bg-gray-100  focus:ring-gray-200 font-medium rounded-lg text-sm  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => handleApproveOrder(row.original.id)} >Duyệt</div>
                }
                {
                  row.original.status != "DAHUY" && <div className="text-red-600 cursor-pointer flex h-8 justify-center items-center w-full  bg-white border border-gray-300 focus:outline-none hover:bg-gray-100  focus:ring-gray-200 font-medium rounded-lg text-sm  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => {
                    setOrderSelected(() => row.original);
                    cancelOrderModal.current.show();
                  }} >Hủy</div>
                }
              
              
            </div>
          }
        </div >
      }
    }

  ], [employees])

  const { orders } = useSelector(state => state.orders);
  const addModal = useRef();
  const deleteModal = useRef();
  const updateModal = useRef();
  const orderDetailModal = useRef();
  const cancelOrderModal = useRef();
  const completeOrderModal = useRef();
  console.log(orders);

  const [orderSelected, setOrderSelected] = useState();

  const data = React.useMemo(() => {
    return orders.map((order) => {
      // const status = getStatusDateBetween(order.effectiveDate, order.expirationDate);
      // return { ...order, status: status === null ? "CHUADUYET" : (status < 0 ? "CHUAAPDUNG" : "HETHIEULUC") }
      return { ...order, employeeId: order.employeeId ? order.employeeId : "null" };
    })
  }, [orders]);

  const handleReset = () => {
    dispatch(getAllOrderStart({ action: "reset" }))
  }

  useEffect(() => {
    dispatch(getAllOrderStart());
  }, [dispatch])


  return (
    <div className="h-[80%] text-gray-900">
      <main className="sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-start">
          <h1 className="text-xl font-bold">DANH SÁCH ĐƠN HÀNG</h1>
          <div className='ml-auto'>
            <button
              class="middle none center mr-4 rounded-lg bg-blue-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-light="true"
              onClick={handleReset}>
              Làm mới
            </button>
          </div>

        </div>
        <div className="mt-6">
          <Table columns={columns} data={data} />
        </div>
      </main>
      <Modal ref={orderDetailModal}><ViewDetail hide={() => orderDetailModal.current.hide()} order={orderSelected}></ViewDetail></Modal>
      <Modal ref={cancelOrderModal}><CancelOrder hide={() => cancelOrderModal.current.hide()} order={orderSelected} employeeId={currentUser?.employeeId}
        employeeName={currentUser?.lastName + " " + currentUser?.firstName}></CancelOrder></Modal>
      <Modal ref={completeOrderModal}><CompleteOrder hide={() => completeOrderModal.current.hide()} order={orderSelected}/></Modal>
    </div>
  );
}

export default Order;

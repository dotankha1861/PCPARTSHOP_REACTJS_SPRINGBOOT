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
import { TiCancel } from 'react-icons/ti';
import CancelPromotion from '../../components/admin/promotion/CancelPromotion'
import Table2 from '../../components/table/Table2'
import { getStatisticRevenue } from '../../redux/apis/orderApi'
import { Controller, useForm } from 'react-hook-form'
import { DatePicker1Presentation, DatePicker2Presentation } from '../../components/datetime/DateTimePicker'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import Toast from '../../utils/toast_helper'

const Statistic = () => {

  const promotionStatus = React.useMemo(() => {
    return {
      CHUAAPDUNG: "Chưa áp dụng",
      DANGAPDUNG: "Đang áp dụng",
      HETHIEULUC: "Hết hiệu lực"
    }
  }, []);
  const [statistics, setStatistic] = useState([]);
  const columns = React.useMemo(() => [
    {
      Header: "Ngày",
      accessor: 'ngay',
      Cell: ({ value }) => {
        return (
          <div className="flex items-center text-sm text-body ">
            {value}
          </div>
        )
      },
      Footer: "Tổng"
    },

    {
      Header: "Số đơn thành công",
      accessor: 'soLuongDonThanhCong',
      Cell: ({ value, column, row }) => {
        return (
          <div className="flex items-center text-sm text-body  ">
            {value}
          </div>
        )
      },
      Footer: statistics.length > 0 && statistics.reduce((total, item) => total + 1, 0) 
    },
    {
      Header: "Tổng tiền hàng",
      accessor: 'tongTienHang',
      Cell: ({ value, column, row }) => {
        return (
          <div className="flex items-center text-sm text-body  ">
            {formatMoney(value)}
          </div>
        )
      },
      Footer: statistics.length > 0 && formatMoney(statistics.reduce((total, item) => total + item.tongTienHang, 0))
    },
    {
      Header: "Tổng chiết khấu",
      accessor: 'tongChietKhau',
      Cell: ({ value, column, row }) => {
        return (
          <div className="flex items-center text-sm text-body  ">
            {value > 0 && formatMoney(value)}
          </div>
        )
      },
      Footer: statistics.length > 0 && formatMoney(statistics.reduce((total, item) => total + item.tongChietKhau, 0))
    },
    {
      Header: "Doanh thu",
      accessor: '',
      Cell: ({ value, column, row }) => {
        return (
          <div className="flex items-center text-sm text-body  ">
            {formatMoney(row.original.tongTienHang - row.original.tongChietKhau)}
          </div>
        )
      },
      Footer: statistics.length > 0 && formatMoney(statistics.reduce((total, item) => total + item.tongTienHang - item.tongChietKhau, 0))

    },
    // {
    //   Header: "giảm giá",
    //   accessor: 'discount',
    //   Cell: ({ value, column, row }) => {
    //     return (
    //       <div className="flex items-center text-sm text-body justify-center text-center">
    //         {value}%
    //       </div>
    //     )
    //   }
    // },
    // {
    //   Header: "Ngày bắt đầu",
    //   accessor: 'effectiveDate',
    //   Cell: ({ value, column, row }) => {
    //     const index = value.lastIndexOf(' ');
    //     return (
    //       <div className='flex flex-col gap-2'>
    //         <div className="flex items-center w-fit text-sm text-body justify-center">
    //           {value.substring(0, index)}
    //         </div>
    //         <div className="flex items-center w-fit text-sm text-body justify-center">
    //           {value.substring(index + 1)}
    //         </div>
    //       </div>

    //     )
    //   }
    // },
    // {
    //   Header: "Ngày kết thúc",
    //   accessor: 'expirationDate',
    //   Cell: ({ value, column, row }) => {
    //     const index = value.lastIndexOf(' ');
    //     return (
    //       <div className='flex flex-col gap-2'>
    //         <div className="flex items-center w-fit text-sm text-body justify-center">
    //           {value.substring(0, index)}
    //         </div>
    //         <div className="flex items-center w-fit text-sm text-body justify-center">
    //           {value.substring(index + 1)}
    //         </div>
    //       </div>
    //     )
    //   }
    // },
    // {
    //   Header: "Ngày tạo/Người tạo",
    //   accessor: 'createdAt',
    //   Cell: ({ value, column, row }) => {
    //     return (
    //       <div className='flex flex-col gap-2'>
    //         <div className="flex items-center w-fit text-sm text-body justify-center">
    //           {value}
    //         </div>
    //         <div className="flex items-center w-fit text-sm text-body justify-center">
    //           #{row.original.createdId} - {row.original.createdName}
    //         </div>
    //       </div>

    //     )
    //   }
    // },
    // {
    //   Header: "Trạng thái",
    //   accessor: "status",
    //   pairsFilter: promotionStatus,
    //   Filter: SelectColumnFilter,
    //   Cell: ({ value }) => {
    //     return (
    //       <span
    //         className={
    //           classNames(
    //             "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
    //             value === "DANGAPDUNG" ? "bg-green-100 text-green-800" : null,
    //             value === "CHUAAPDUNG" ? "bg-yellow-100 text-yellow-800" : null,
    //             value === "HETHIEULUC" ? "bg-red-100 text-red-800" : null,
    //           )
    //         }
    //       >
    //         {promotionStatus[value]}
    //       </span>
    //     )
    //   }
    // },
    // {
    // 	Header: "Trạng thái",
    // 	accessor: "active",
    // 	pairsFilter: categoryStatuses,
    // 	Filter: SelectColumnFilter,
    // 	Cell: ({ value }) => {
    // 		return (
    // 			<div className={
    // 				classNames(
    // 					"px-3 py-1 uppercase leading-wide font-medium text-xs rounded-full shadow-sm w-fit",
    // 					value === "true" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
    // 				)
    // 			}>{categoryStatuses[value]}</div>
    // 		)
    // 	}
    // },
    // {
    //   Header: "Tính năng",
    //   accessor: "",
    //   Cell: ({ row }) => {
    //     return <div className='flex gap-10'>
    //       <LuView size={24} className='text-blue-600 cursor-pointer'
    //         onClick={() => {
    //           setPromotionSelected(row.original);
    //           updateModal.current.show();
    //         }} />
    //       {row.original.status === "CHUAAPDUNG" ? <RiDeleteBin5Line size={24} className='text-red-600 cursor-pointer'
    //         onClick={() => {
    //           setPromotionSelected(row.original);
    //           deleteModal.current.show();
    //         }} /> : row.original.status === "DANGAPDUNG" && <TiCancel size={24} className='text-red-600 cursor-pointer'
    //           onClick={() => {
    //             setPromotionSelected(row.original);
    //             cancelModal.current.show();
    //           }} />}
    //     </div>
    //    }
    // }

  ], [statistics])

  const dispatch = useDispatch();
  const addModal = useRef();
  const deleteModal = useRef();
  const updateModal = useRef();
  const cancelModal = useRef();

  const schema = yup.object().shape({

  });

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const [promotionSelected, setPromotionSelected] = useState();


  const data = React.useMemo(() => {
    return statistics.map((statistic) => {
      //  const status = getStatusDateBetween(promotion.effectiveDate, promotion.expirationDate);
      return statistic//{ ...promotion, status: status === 0 ? "DANGAPDUNG" : (status < 0 ? "CHUAAPDUNG" : "HETHIEULUC") }
    })
  }, [statistics]);

  const handleReset = () => {
    dispatch(getAllPromotionStart({ action: "reset" }))
  }

  const statisticRevenue = async (data) => {
    try {
      const { data: resBody } = await getStatisticRevenue({ dateFrom: data.dateFrom, dateTo: data.dateTo });
      setStatistic(resBody.data);
      if(resBody.data.length === 0) Toast.warn("Không có dữ liệu trong thời gian này");
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="h-[80%] text-gray-900">
      <main className="sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-start">
          <h1 className="text-xl font-bold">THỐNG KÊ DOANH THU THEO THỜI GIAN</h1>

        </div>
        <div onSubmit={handleSubmit(statisticRevenue)} className="mt-6">

          <form className='flex gap-5 items-center mb-8'>
            <div className='flex items-center gap-2 w-[35%]'>
              <label htmlFor='' className='whitespace-nowrap font-medium'>
                Từ ngày
              </label>
              <Controller
                name={"dateFrom"}
                control={control}
                defaultValue={new Date()}
                render={({ field: { onChange, value } }) => {
                  return (
                    <DatePicker2Presentation
                      onChange={onChange}
                      selected={value}
                    // placeholderText="Enter your birth date"
                    />
                  );
                }}
              />

            </div>
            <div className='flex items-center gap-2 w-[40%]'>
              <label htmlFor='' className='whitespace-nowrap font-medium'>
                Đến ngày
              </label>
              <Controller
                name={"dateTo"}
                control={control}
                defaultValue={new Date()}
                render={({ field: { onChange, value } }) => {
                  return (
                    <DatePicker2Presentation
                      onChange={onChange}
                      selected={value}
                    // placeholderText="Enter your birth date"
                    />
                  );
                }}
              />

            </div>
            <button
              className="middle none center mr-4 rounded-lg bg-green-500 py-[12px] px-4 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-light="true"
              // onClick={statisticRevenue}
            >
              Xem
            </button>
          </form>
          <Table2 columns={columns} data={data} />
        </div>
      </main>
      <Modal title={"THÊM CHƯƠNG TRÌNH KHUYẾN MÃI"} ref={addModal}><AddPromotion hide={() => addModal.current.hide()} /></Modal>
      <Modal title={"XÓA CHƯƠNG TRÌNH KHUYẾN MÃI"} ref={deleteModal}><DeletePromotion promotion={promotionSelected} hide={() => deleteModal.current.hide()} /></Modal>
      <Modal title={"HỦY CHƯƠNG TRÌNH KHUYẾN MÃI"} ref={cancelModal}><CancelPromotion promotion={promotionSelected} hide={() => cancelModal.current.hide()} /></Modal>
      <Modal ref={updateModal} title={"CHI TIẾT CHƯƠNG TRÌNH KHUYẾN MÃI"}><UpdatePromotion promotion={promotionSelected} hide={() => updateModal.current.hide()} /></Modal>
    </div>
  );
}

export default Statistic;

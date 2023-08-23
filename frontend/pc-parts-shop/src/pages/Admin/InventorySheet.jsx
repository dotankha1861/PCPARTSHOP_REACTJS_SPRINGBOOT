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
import {LuView} from 'react-icons/lu'
import UpdatePromotion from '../../components/admin/promotion/UpdatePromotion'
import DeletePromotion from '../../components/admin/promotion/DeletePromotion'
import { getAllSISheetStart, getAllSIsheetStart } from '../../redux/slices/stockInventorySheetSlice'
import { getAllEmployeeStart } from '../../redux/slices/employeeSlice'
import AddSISheet from '../../components/admin/stock-inventory-sheet/AddStockInventorySheet'
import ViewDetailSISheet from '../../components/admin/stock-inventory-sheet/ViewDetailStockInventory'


const inventorySheets = [
  {
    id: 1,
    status: ""
  },
  {}
]
const InventorySheet = () => {

	const promotionStatus = React.useMemo(() => {
		return {
			CHUAAPDUNG: "Chưa áp dụng",
			DANGAPDUNG: "Đang áp dụng",
			HETHIEULUC: "Hết hiệu lực"
		}
	}, []);
	const {employees} = useSelector(state => state.employees);
	useEffect(() => {
		dispatch(getAllEmployeeStart());
	  }, []);
	
	const columns = React.useMemo(() => [
		{
			Header: "Id",
			accessor: 'id',
			sortable: true,
			Cell: ({ value }) => {
				return (
					<div className="w-[20px] text-sm">
						{value}
					</div>
				)
			}
		},
		{
			Header: "Nhân viên kiểm",
			accessor: 'employeeId',
			sortable: true,
			pairsFilter: {
				...employees?.reduce((object, item) =>
				  ({ ...object, [item.employeeId]: item.employeeId + " - " + item.lastName + " " + item.firstName }), {})
			  },
			  Filter: SelectColumnFilter,
			Cell: ({ value, column, row }) => {
				return (
					<div className='flex flex-col gap-2'>
							<div className="flex items-center w-fit text-sm text-body justify-center">
							#{value} - {row.original.employeeName}
						</div>
					</div>

				)
			}
		},
		{
			Header: "Thời gian tạo",
			accessor: 'createdAt',
			Cell: ({ value, column, row }) => {
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
			Header: "Số sản phẩm kiểm",
			accessor: 'quantityProduct',
			Cell: ({ value, column, row }) => {
				return (
					<div className="flex items-center w-fit text-sm text-body justify-center ml-auto mr-auto">
						{value}
					</div>
				)
			}
		},
		{
			Header:  "Tổng chênh lệch",
			accessor: 'difference',
			Cell: ({ value, column, row }) => {
				return (
					<div className='flex flex-col gap-1 items-start'>
						<div className="flex items-center w-fit text-sm text-body justify-center ml-auto mr-auto">
							{value}
						</div>
					</div>

				)
			}
		},
		
		{
			Header: "Tính năng",
			accessor: "",
			Cell: ({ row }) => {
				return <div className='flex gap-10'>
					<div  className='text-blue-900 cursor-pointer text-sm '
						onClick={() => {
							setSISheetSelected(row.original);
							viewModal.current.show();
						}} >Xem chi tiết</div>
				</div>
			}
		}

	], [])

	const dispatch = useDispatch();
	const { siSheets } = useSelector(state => state.siSheets);
	const addModal = useRef();
	const viewModal = useRef();
	const agreeCreateModal = useRef();
	// const updateModal = useRef();
	console.log(siSheets);
	
	const [siSheetSelected, setSISheetSelected] = useState();

	const data = React.useMemo(() => {
		return siSheets.map((siSheet) => {
			//  const status = getStatusDateBetween(siSheet.effectiveDate, siSheet.expirationDate);
			//  return { ...siSheet, status: status === 0 ? "DANGAPDUNG" : (status < 0 ? "CHUAAPDUNG" : "HETHIEULUC") }
			return siSheet;
		})
	}, [siSheets]);

	const handleReset = () => {
		dispatch(getAllSISheetStart({ action: "reset" }))
	}

	useEffect(() => {
		dispatch(getAllSISheetStart());
	}, [dispatch])

	return (
		<div className="h-fit text-gray-900">
			<main className="sm:px-6 lg:px-8 pt-4">
				<div className="flex justify-start">
					<h1 className="text-xl font-bold">DANH SÁCH PHIẾU KIỂM HÀNG</h1>
					<div className='ml-auto'>
						<button
							class="middle none center mr-4 rounded-lg bg-blue-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
							data-ripple-light="true"
							onClick={handleReset}>
							Làm mới
						</button>
						<button
							className="middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
							data-ripple-light="true"
							onClick={() => addModal.current.show()}>
							Tạo mới
						</button>
					</div>

				</div>
				<div className="mt-6">
					<Table columns={columns} data={data} />
				</div>
			</main>
			<Modal title={"THÊM PHIẾU KIỂM HÀNG"} ref={addModal}><AddSISheet hide={() => addModal.current.hide()} /></Modal>
			<Modal title={"XEM CHI TIẾT PHIẾU KIỂM"} ref={viewModal}><ViewDetailSISheet siSheet={siSheetSelected} hide={() => viewModal.current.hide()} /></Modal>
		</div>
	);
}

export default InventorySheet;

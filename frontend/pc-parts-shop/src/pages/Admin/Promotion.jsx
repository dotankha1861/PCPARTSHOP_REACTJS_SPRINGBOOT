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
import {TiCancel} from 'react-icons/ti';
import CancelPromotion from '../../components/admin/promotion/CancelPromotion'
const Promotion = () => {
	const {currentUser} = useSelector(state => state.auth);
	const promotionStatus = React.useMemo(() => {
		return {
			CHUAAPDUNG: "Chưa áp dụng",
			DANGAPDUNG: "Đang áp dụng",
			HETHIEULUC: "Hết hiệu lực"
		}
	}, []);

	const columns = React.useMemo(() => [
		{
			Header: "Id",
			accessor: 'id',
			sortable: true,
			Cell: ({ value }) => {
				return (
					<div className="w-[20px]">
						{value}
					</div>
				)
			}
		},
		{
			Header: "Tên CTKM",
			accessor: 'name',
			sortable: true,
			Cell: ({ value, column, row }) => {
				return (
					<div className="flex items-center text-sm text-body">
						{value}
					</div>
				)
			}
		},
		{
			Header: "giảm giá",
			accessor: 'discount',
			Cell: ({ value, column, row }) => {
				return (
					<div className="flex items-center text-sm text-body justify-center text-center">
						{value}%
					</div>
				)
			}
		},
		{
			Header:  "Thời gian bắt đầu",
			accessor: 'effectiveDate',
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
			Header: "Thời gian kết thúc",
			accessor: 'expirationDate',
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
			Header: "Ngày tạo/Người tạo",
			accessor: 'createdAt',
			Cell: ({ value, column, row }) => {
				return (
					<div className='flex flex-col gap-2'>
						<div className="flex items-center w-fit text-sm text-body justify-center">
							{value}
						</div>
						<div className="flex items-center w-fit text-sm text-body justify-center">
							#{row.original.createdId} - {row.original.createdName}
						</div>
					</div>

				)
			}
		},
		{
			Header: "Trạng thái",
			accessor: "status",
			pairsFilter: promotionStatus,
			Filter: SelectColumnFilter,
			Cell: ({ value }) => {
				return (
					<span
						className={
							classNames(
								"px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
								value === "DANGAPDUNG" ? "bg-green-100 text-green-800" : null,
								value === "CHUAAPDUNG" ? "bg-yellow-100 text-yellow-800" : null,
								value === "HETHIEULUC" ? "bg-red-100 text-red-800" : null,
							)
						}
					>
						{promotionStatus[value]}
					</span>
				)
			}
		},
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
		{
			Header: "Tính năng",
			accessor: "",
			Cell: ({ row }) => {
				return <div className='flex gap-4'>
					<LuView size={24} className='text-blue-600 cursor-pointer'
						onClick={() => {
							setPromotionSelected(row.original);
							updateModal.current.show();
						}} />
					{row.original.status === "CHUAAPDUNG" && row.original.createdId == currentUser.employeeId ? <RiDeleteBin5Line size={24} className='text-red-600 cursor-pointer'
						onClick={() => {
							setPromotionSelected(row.original);
							deleteModal.current.show();
						}} /> : row.original.status === "DANGAPDUNG" && row.original.createdId== currentUser.employeeId && <TiCancel size={24} className='text-red-600 cursor-pointer'
						onClick={() => {
							setPromotionSelected(row.original);
							cancelModal.current.show();
						}} />}
				</div>
			}
		}

	], [])

	const dispatch = useDispatch();
	const { promotions } = useSelector(state => state.promotions);
	const addModal = useRef();
	const deleteModal = useRef();
	const updateModal = useRef();
	const cancelModal = useRef();
	console.log(promotions);

	const [promotionSelected, setPromotionSelected] = useState();
	

	const data = React.useMemo(() => {
		return promotions.map((promotion) => {
			 const status = getStatusDateBetween(promotion.effectiveDate, promotion.expirationDate);
			 return { ...promotion, status: status === 0 ? "DANGAPDUNG" : (status < 0 ? "CHUAAPDUNG" : "HETHIEULUC") }
		})
	}, [promotions]);

	const handleReset = () => {
		dispatch(getAllPromotionStart({ action: "reset" }))
	}

	useEffect(() => {
		dispatch(getAllPromotionStart());
	}, [dispatch])

	return (
		<div className="h-[80%] text-gray-900">
			<main className="sm:px-6 lg:px-8 pt-4">
				<div className="flex justify-start">
					<h1 className="text-xl font-bold">DANH SÁCH CHƯƠNG TRÌNH KHUYẾN MÃI</h1>
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
			<Modal title={"THÊM CHƯƠNG TRÌNH KHUYẾN MÃI"} ref={addModal}><AddPromotion hide={() => addModal.current.hide()} /></Modal>
			<Modal title={"XÓA CHƯƠNG TRÌNH KHUYẾN MÃI"} ref={deleteModal}><DeletePromotion promotion={promotionSelected} hide={() => deleteModal.current.hide()} /></Modal>
			<Modal title={"HỦY CHƯƠNG TRÌNH KHUYẾN MÃI"} ref={cancelModal}><CancelPromotion promotion={promotionSelected} hide={() => cancelModal.current.hide()}/></Modal>
			<Modal ref={updateModal} title={"CHI TIẾT CHƯƠNG TRÌNH KHUYẾN MÃI"}><UpdatePromotion promotion={promotionSelected} hide={() => updateModal.current.hide()} /></Modal>
		</div>
	);
}

export default Promotion;

import { useDispatch, useSelector } from 'react-redux'
import Table, { AvatarCell, SelectColumnFilter, StatusPill } from '../../components/table/Table'  // new
import React, { useEffect, useRef, useState } from 'react'
import { getAllCategoryStart } from '../../redux/slices/categorySlice'
import { classNames } from '../../components/table/shared/Utils'
import {BiSolidEdit} from 'react-icons/bi';
import {RiDeleteBin5Line} from 'react-icons/ri';
import AddCategory from '../../components/admin/category/AddCategory'
import Modal from '../../components/Modal'
import DeleteCategory from '../../components/admin/category/DeleteCategory'
import UpdateCategory from '../../components/admin/category/UpdateCategory'

const Category = () => {

	const categoryStatuses = React.useMemo(() => {
		return {
			true: "Kinh doanh",
			false: "Tạm ngưng"
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
			Header: "Tên danh mục",
			accessor: 'name',
			sortable: true,
			imgAccessor: 'image',
			Cell: ({ value, column, row }) => {
				return (
					<div className="flex items-center w-fit text-sm text-body">
						<div className="flex-shrink-0 h-10 w-10">
							<img className="h-10 w-10 rounded-full" src={row.original[column.imgAccessor] || "http://localhost:8080/images/setting/default-product" } alt="" />
						</div>
						<div className="ml-4">
							<div className="text-sm font-medium text-gray-900">{value}</div>
						</div>
					</div>
				)
			}
		},
		{
			Header: "Trạng thái",
			accessor: "active",
			pairsFilter: categoryStatuses,
			Filter: SelectColumnFilter,
			Cell: ({ value }) => {
				return (
					<div className={
						classNames(
							"px-3 py-1 uppercase leading-wide font-medium text-xs rounded-full shadow-sm w-fit",
							value === "true" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
						)
					}>{categoryStatuses[value]}</div>
				)
			}
		},
		{
			Header: "Tính năng",
			accessor: "",
			Cell: ({row}) => {
				return <div className='flex gap-10'>
					<BiSolidEdit size={24} className='text-blue-600 cursor-pointer'
						onClick={() => {
							setCategorySelected(row.original);
							updateModal.current.show();
						}}/>
					<RiDeleteBin5Line size={24} className='text-red-600 cursor-pointer'
						onClick={() => {
							setCategorySelected(row.original);
							deleteModal.current.show();
						}}/>
				</div>
			}
		}

	], [categoryStatuses])

	const dispatch = useDispatch();
	const { categories } = useSelector(state => state.categories);
	const addModal = useRef();
	const deleteModal = useRef();
	const updateModal = useRef();

	const [categorySelected, setCategorySelected] = useState();

	const data = React.useMemo(() => {
		return categories.map((category) => {
			return { ...category, active: category.active ? "true" : "false" }
		})
	}, [categories]);

	const handleReset = () => {
		dispatch(getAllCategoryStart({action: "reset"}))
	}

	useEffect(() => {
		dispatch(getAllCategoryStart());
	}, [dispatch])

	return (
		<div className="h-[80%] text-gray-900">
			<main className="sm:px-6 lg:px-8 pt-4">
				<div className="flex justify-start">
					<h1 className="text-xl font-bold">DANH SÁCH DANH MỤC</h1>
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
			<Modal ref = {addModal} title={"THÊM DANH MỤC SẢN PHẨM"}><AddCategory hide={() => addModal.current.hide()}/></Modal>
			<Modal ref = {deleteModal} ><DeleteCategory category={categorySelected} hide={() => deleteModal.current.hide()}/></Modal>
			<Modal ref = {updateModal} title={"SỬA DANH MỤC SẢN PHẨM"}><UpdateCategory category={categorySelected} hide={() => updateModal.current.hide()}/></Modal>
		</div>
	);
}

export default Category;

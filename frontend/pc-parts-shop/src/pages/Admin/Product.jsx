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
import { getAllProductStart } from '../../redux/slices/productSlice'
import { formatMoney } from '../../utils/convert_helper'
import AddProduct from '../../components/admin/product/AddProduct'
import DeleteProduct from '../../components/admin/product/DeleteProduct'
import UpdateProduct from '../../components/admin/product/UpdateProduct'
import { LuView } from 'react-icons/lu'
const Product = () => {
	const { products } = useSelector(state => state.products);
	const {categories} = useSelector(state => state.categories);
	const categoryFilter = React.useMemo(() => {
		return categories.reduce((pre, item) => ({...pre, [item.id]: item.name}), {});
	},[categories])

	const productStatuses = React.useMemo(() => {
		return {
			true: "kinh doanh",
			false: "Tạm ngưng"
		}
	}, []);

	const columns = React.useMemo(() => [
		{
			Header: "Mã sku",
			accessor: 'skuCode',
			sortable: true,
			Cell: ({ value, column, row }) => {
				return (
					<div className="flex items-center whitespace-pre-wrap text-sm text-body">
						{value}
					</div>
				)
			}
		},
		{
			Header: "Tên sản phẩm",
			accessor: 'name',
			sortable: true,
			imgAccessor: 'image',
			Cell: ({ value, column, row }) => {
				return (
					<div className="flex items-center max-w-[250px] whitespace-pre-wrap text-sm text-body">
						<div className="flex-shrink-0 h-10 w-10">
							<img className="h-10 w-10 rounded-full" src={row.original[column.imgAccessor] || "http://localhost:8080/images/setting/default-product"} alt="" />
						</div>
						<div className="ml-4">
							<div className="text-sm text-gray-900">{value}</div>
						</div>
					</div>
				)
			}
		},
		{
			Header: "Danh mục",
			accessor: 'categoryId',
			pairsFilter: categoryFilter,
			Filter: SelectColumnFilter,
			Cell: ({ value, column, row }) => {
				return (
					<div className='flex flex-col gap-2 items-start'>
						<div className="flex items-center w-fit text-sm text-body justify-center">
							#{value}
						</div>
						<div className="flex items-center w-fit text-sm text-body justify-center">
							{categoryFilter[value]}
						</div>
					</div>

				)
			}
		},
		{
			Header: "Giá bán",
			accessor: 'price',
			Cell: ({ value, column, row }) => {
				return (
					<div>
						{row.original.discount > 0 ?
							< div className='flex flex-col gap-2 items-start' >
								<div className='flex justify-start items-center gap-3'>
									<div className="flex items-center w-fit text-sm text-body justify-center line-through text-red-500">
										{formatMoney(value)}
									</div>
									<div className="flex items-center w-fit text-sm text-body justify-center">
										-{row.original.discount}%
									</div>
								</div>
								<div className="flex items-center max-w-[200px] whitespace-pre-wrap text-sm text-body">
									{formatMoney(row.original.price *(100 - row.original.discount) / 100)}
								</div>
							</div> :
							<div>
								<div className="flex items-center max-w-[200px] whitespace-pre-wrap text-sm text-body">
									{formatMoney(value)}
								</div>
							</div>
						}
					</div>

				)
			}
		},
		{
			Header: "Số lượng tồn",
			accessor: 'quantity',
			sortable: true,
			Cell: ({ value, column, row }) => {
				return (
					<div className="flex items-center justify-center text-sm text-body">
						{value}
					</div>
				)
			}
		},
		{
			Header: "Trạng thái",
			accessor: "active",
			pairsFilter: productStatuses,
			Filter: SelectColumnFilter,
			Cell: ({ value }) => {
				return (
					<div className={
						classNames(
							"px-3 py-1 uppercase leading-wide font-medium text-xs rounded-full shadow-sm w-fit justify-center",
							value === "true" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
						)
					}>{productStatuses[value]}</div>
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
							setProductSelected(row.original);
							updateModal.current.show();
						}} />
					<RiDeleteBin5Line size={24} className='text-red-600 cursor-pointer'
						onClick={() => {
							setProductSelected(row.original);
							deleteModal.current.show();
						}} />
				</div>
			}
		}

	], [productStatuses])

	const dispatch = useDispatch();
	const addModal = useRef();
	const deleteModal = useRef();
	const updateModal = useRef();

	const [productSelected, setProductSelected] = useState();

	const data = React.useMemo(() => {
		return products.map((product) => {
			return { ...product, active: product.active ? "true" : "false" }
		})
	}, [products]);

	const handleReset = () => {
		dispatch(getAllProductStart({ action: "reset" }))
		dispatch(getAllCategoryStart());
	}

	useEffect(() => {
		dispatch(getAllProductStart());
		dispatch(getAllCategoryStart());
	}, [dispatch])

	return (
		<div className="h-[80%] text-gray-900">
			<main className="sm:px-6 lg:px-8 pt-4">
				<div className="flex justify-start">
					<h1 className="text-xl font-bold">DANH SÁCH SẢN PHẨM</h1>
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
			<Modal ref={addModal} title={"THÊM SẢN PHẨM"}><AddProduct hide={() => addModal.current.hide()} /></Modal>
			<Modal ref={deleteModal} title={"XÓA SẢN PHẨM"}><DeleteProduct product={productSelected} hide={() => deleteModal.current.hide()} /></Modal>
			<Modal ref={updateModal} title={"XEM CHI TIẾT SẢN PHẨM "}><UpdateProduct product={productSelected} hide={() => updateModal.current.hide()} /></Modal>
		</div>
	);
}

export default Product;

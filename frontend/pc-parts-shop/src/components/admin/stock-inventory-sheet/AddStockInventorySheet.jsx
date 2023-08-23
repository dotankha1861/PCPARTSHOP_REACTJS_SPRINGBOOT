import React, { useEffect, useRef, useState } from 'react'
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import 'react-datepicker/dist/react-datepicker.css';
import { getAllCategoryStart } from '../../../redux/slices/categorySlice';
import Table from '../../table/Table';
import Toast from '../../../utils/toast_helper';
import { createPromotionStart } from '../../../redux/slices/promotionSlice';
import { convertDate, formatMoney } from '../../../utils/convert_helper';
import { DatePicker1Presentation } from '../../datetime/DateTimePicker';
import { format } from 'date-fns';
import { getAllProductStart } from '../../../redux/slices/productSlice';
import {CiSquareRemove} from 'react-icons/ci';
import Modal from '../../Modal';
import { createSISheetStart } from '../../../redux/slices/stockInventorySheetSlice';
// const promotionStatus = [
//   {
//     name: "Chưa áp dụng",
//     value: 0
//   },
//   {
//     name: "Đang áp dụng",
//     value: 1
//   },
//   {
//     name: "Hết hiệu lực",
//     value: 2
//   },
// ]

const AddSISheet = ({ hide }) => {
  const [listProduct, setListProduct] = useState([]);
  const columns = React.useMemo(() => [
    {
      Header: "SkuCode",
      accessor: 'skuCode',
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
      Header: "Tên sản phẩm",
      accessor: 'name',
      sortable: true,
      Cell: ({ value, column, row }) => {
        return (
          <div className="flex items-center w-fit text-sm text-body max-w-[200px] whitespace-pre-wrap">
            <div className="text-sm font-medium text-gray-900">{value}</div>
          </div>
        )
      }
    },
    {
      Header: "Chọn",
      accessor: "",
      Cell: ({ row }) => {
        return <div className='flex gap-10 justify-center'>
          <input type='checkbox' checked={listProduct.some(cate => cate.id === row.original.id)} onChange={(e) => {
            setListProduct(e.target.checked ? [...listProduct, row.original] :
              listProduct.filter(product => product.id !== row.original.id))
          }}>

          </input>
        </div>
      }
    }

  ]);
  const dispatch = useDispatch();
  const { products } = useSelector(state => state.products);

  console.log(products);
  const data = React.useMemo(() => {
    return products.map((product) => ({...product, actualQuantity: product.quantity}));
  }, [products]);

  useEffect(() => {
    dispatch(getAllProductStart());
  }, [dispatch])

  // const [selectedDateStart, setSelectedDateStart] = useState(null);
  // const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  // const [selectedImage, setSelectedImage] = useState(null);
  // const [fileChoose, setFileChoose] = useState(null);
  const modalAgreeCreateSISheet = useRef();

  const schema = yup.object().shape({
    name: yup.string().required("* Vui lòng nhập tên sản phẩm"),
  });

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  }, []);


  const onCreateSISheet = async () => {
    if (listProduct.length === 0) Toast.error("Vui lòng chọn ít nhất 1 sản phẩm để kiểm")
    dispatch(createSISheetStart({
      sheetDetails: listProduct.map(product => ({productId: product.id, actualQuantity: product.actualQuantity, initialQuantity: product.quantity}))
      , hide
    }));

  };

  // console.log(listCategory);
  return (
    <div className="flex items-start py-1 pb-5 pl-2 pr-10 gap-5">
      <div className='w-[850px] min-h-screen flex gap-3 mb-10' encType='multipart/form-data'>

        <fieldset className='py-10 flex flex-col items-center px-6 bg-white drop-shadow-md shadow-inner rounded-xl gap-10 text-black w-full h-full'>
          <h1 className="text-xl font-bold">DANH SÁCH SẢN PHẨM KIỂM</h1>
          {
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3 w-[100px]">
                    <span class="sr-only">Image</span>
                  </th>
                  <th scope="col" class="px-6 py-3 w-[350px]">
                    Sản phẩm
                  </th>
                  <th scope="col" class="px-6 py-3 text-center w-[100px]  whitespace-nowrap">
                    Tồn kho
                  </th>
                  <th scope="col" class="px-6 py-3 text-start w-[150px] whitespace-nowrap">
                    Sau điều chỉnh
                  </th>
                  <th scope="col" class="px-6 py-3 text-center w-[100px] whitespace-nowrap">
                    Chênh lệch
                  </th>
                  <th scope="col" class="px-6 py-3 text-center w-[100px]">
                    
                  </th>

                </tr>
              </thead>
              <tbody>
                {
                  listProduct.map((item, index) => <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 h-[80px]">
                    <td class=" p-4 flex flex-col w-[80px] ">
                      <img src={item.image} className="w-16 h-16" alt="Apple Watch" />
                      <div>{item.skuCode}</div>
                    </td>
                    <td class="w-[600px] px-6 py-4 font-semibold text-gray-900 dark:text-white whitespace-pre-wrap">
                      {item.name}
                    </td>
                    <td class="m-auto px-6 py-4 font-semibold text-gray-900 dark:text-white w-[100px]">
                      <input type='number' min={"0"} className='input w-[70px]' onChange={(e) => setListProduct(() => listProduct.map(product => product.id === item.id ? {...product, quantity: Number(e.target.value)} : product))} defaultValue={item.quantity}></input>
                    
                    </td>
                    <td class="m-auto px-6 py-4 font-semibold text-gray-900 dark:text-white w-[100px]">
                     <input type='number' min={"0"} className='input w-[70px]' onChange={(e) => setListProduct(() => listProduct.map(product => product.id === item.id ? {...product, actualQuantity: Number(e.target.value)} : product))} defaultValue={item.actualQuantity}></input>
                    </td>
                    <td className="w-[100px] text-center px-6 py-4 font-semibold text-gray-900 dark:text-white">{item.actualQuantity -item.quantity}</td>
                    <td class="px-6 py-4 cursor-pointer1">
                      <CiSquareRemove size={24} onClick={() => setListProduct(listProduct.filter(product => product.id !== item.id))}/>
                    </td>
                  </tr>
                  )
                }


              </tbody>
              {listProduct.length > 0 && <tfoot class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3 w-[100px]">
                    <span class="sr-only">Image</span>
                  </th>
                  <th scope="col" class="px-6 py-3 w-[350px]">
                    Tổng
                  </th>
                  <th scope="col" class="px-6 py-3 text-center w-[100px]  whitespace-nowrap">
                  {listProduct.reduce((total, product) => total + product.quantity, 0)}
                  </th>
                  <th scope="col" class="px-6 py-3 text-start w-[150px] whitespace-nowrap flex ml-[10px]">
                  {listProduct.reduce((total, product) => total + Number(product.actualQuantity), 0)}
                  </th>
                  <th scope="col" class="px-6 py-3 text-center w-[100px] whitespace-nowrap">
                    {listProduct.reduce((total, product) => total + (product.actualQuantity - product.quantity), 0)}
                  </th>
                  <th scope="col" class="px-6 py-3 text-center w-[100px]">
                    
                  </th>

                </tr>
              </tfoot>}
              {/* {data.length > 0 && <tr>
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
              </tr>} */}

            </table>
          }

        </fieldset>

        <div className='gap-2 fixed bottom-0 w-full bg-slate-700 p-2 right-0 flex justify-end '>
          <button className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
            onClick={() => modalAgreeCreateSISheet.current.show()}>
            Thêm</button>
          <div className=""></div>
        </div>
      </div>
      <div className='sticky top-5 flex gap-3 mb-5 -mr-[30px]'>
        <div className='h-̀[500px]'>
          <div className='ml-auto'>
            <Table columns={columns} data={data} />
          </div>
        </div>
      </div>
      <Modal ref={modalAgreeCreateSISheet}>
        <div className='py-5 px-20 flex flex-col gap-3 justify-start items-center shadow-md overflow-hidden'>
          <div className='font-bold'>Đồng ý tạo phiếu kiểm và cân bằng kho?</div>
          <div className='flex gap-3 my-4'>
          <button className='middle none center mr-4 rounded-lg bg-red-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
              onClick={() => modalAgreeCreateSISheet.current.hide()}
            >&nbsp;&nbsp;Hủy&nbsp;&nbsp;</button>
            <button className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
               onClick={() => {
                onCreateSISheet();
                modalAgreeCreateSISheet.current.hide();
              }}
              >
              Đồng ý</button>
    
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AddSISheet;
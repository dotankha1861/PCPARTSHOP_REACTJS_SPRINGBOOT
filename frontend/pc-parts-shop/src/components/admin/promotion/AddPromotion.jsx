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
import { convertDate } from '../../../utils/convert_helper';
import { DatePicker1Presentation } from '../../datetime/DateTimePicker';
import { format } from 'date-fns';
import Modal from '../../Modal';

const promotionStatus = [
  {
    name: "Chưa áp dụng",
    value: 0
  },
  {
    name: "Đang áp dụng",
    value: 1
  },
  {
    name: "Hết hiệu lực",
    value: 2
  },
]

const AddPromotion = ({ hide }) => {
  const [listCategory, setListCategory] = useState([]);
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
      Cell: ({ value, column, row }) => {
        return (
          <div className="flex items-center w-fit text-sm text-body">
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
          <input type='checkbox' checked={listCategory.some(cate => cate.id === row.original.id)} onChange={(e) => {
            setListCategory(e.target.checked ? [...listCategory, row.original] :
              listCategory.filter(cate => cate.id !== row.original.id))
          }}>

          </input>
        </div>
      }
    }

  ]);
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories);

  console.log(categories);
  const data = React.useMemo(() => {
    return categories.filter((category) => category.active === true);
  }, [categories]);

  useEffect(() => {
    dispatch(getAllCategoryStart());
  }, [dispatch])

  // const [selectedDateStart, setSelectedDateStart] = useState(null);
  // const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  // const [selectedImage, setSelectedImage] = useState(null);
  // const [fileChoose, setFileChoose] = useState(null);
  const modalAgreeCreatePromotion = useRef();

  const schema = yup.object().shape({
    name: yup.string().required("* Vui lòng nhập tên sản phẩm"),
  });

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  }, []);

  const [datas, setData] = useState();
  const onCreatePromotion = async (data) => {
    setData(() => data);
  };
  const onAgreeCreatePromorion = () => {
    if (listCategory.length === 0) Toast.error("Vui lòng chọn ít nhất 1 danh mục")
    dispatch(createPromotionStart({
      data: {
        ...datas,
        effectiveDate: convertDate(datas.effectiveDate),
        expirationDate: convertDate(datas.expirationDate),
        listCategoriesId: listCategory.map(cate => cate.id)
      }, hide
    }));

  }
  console.log(listCategory);
  return (
    <div>
<div className="flex flex-col items-center py-1 pb-5 px-10 gap-5 w-screen">
      <form onSubmit={handleSubmit(onCreatePromotion)} className='flex gap-3 mb-10' encType='multipart/form-data'>

        <fieldset className='py-10 flex flex-col items-center px-6 bg-white drop-shadow-md shadow-inner rounded-xl gap-10 text-black'>

          <div className='w-[100%] flex justify-start gap-2 items-center'>
            <label htmlFor='name' className='whitespace-nowrap'>
              Tên CT khuyến mãi
            </label>
            <input type='text'
              id="name"
              className='input w-full'
              {...register("name")} >
            </input>
          </div>
          <div className='w-[100%] flex justify-start gap-2 items-center'>
            <label htmlFor='name' className='whitespace-nowrap'>
              Phần trăm giảm giá (0 - 100)
            </label>
            <input type='text'
              id="discount"
              className='input w-full'
              {...register("discount")} >
            </input>
          </div>
          <div className='font-semibold self-start my-[-10px] relative z-40'> THỜI GIAN ÁP DỤNG</div>
          <div className='w-[100%] flex justify-start gap-4 items-center'>
            <div className="flex items-center gap-2 w-[50%] justify-start">
              <label htmlFor='effective-date' className='whitespace-nowrap'>
                Thời gian bắt đầu
              </label>
              <Controller
                name={"effectiveDate"}
                control={control}
                defaultValue={new Date()}
                render={({ field: { onChange, value } }) => {
                  return (
                    <DatePicker1Presentation
                      onChange={onChange}
                      selected={value}
                      // placeholderText="Enter your birth date"
                    />
                  );
                }}
              />
            </div>
            <div className='flex items-center gap-2 w-[50%]'>
              <label htmlFor='' className='whitespace-nowrap'>
                Thời gian kết thúc
              </label>
              <Controller
                name={"expirationDate"}
                control={control}
                defaultValue={new Date()}
                render={({ field: { onChange, value } }) => {
                  return (
                    <DatePicker1Presentation
                      onChange={onChange}
                      selected={value}
                      // placeholderText="Enter your birth date"
                    />
                  );
                }}
              />

            </div>
          </div>
          <div className='font-semibold self-start my-[-10px]'> ĐIỀU KIỆN ÁP DỤNG</div>
          <div className="flex gap-7 items-center w-full ">
            <div className='w-[50%] flex justify-start gap-2 items-center self-start'>
              <label htmlFor='phone'
                className='w-fit whitespace-nowrap'>
                Giá thấp nhất
              </label>
              <input type='text'
                id="price-from"
                className='input w-full'
                {...register("priceFrom")}>
              </input>
            </div>

            <div className='w-[50%] flex justify-start gap-2 items-center self-start'>
              <label htmlFor='price-to'
                className='w-fit whitespace-nowrap'>
                Giá cao nhất
              </label>
              <input type='text'
                id="price-to"
                className='input w-full'
                {...register("priceTo")}>
              </input>
            </div>
          </div>
          <div className='font-semibold self-start my-[-10px]'> CÁC DANH MỤC ĐƯỢC ÁP DỤNG
          </div>
          <div className='w-full'>
            <div className='self-start mt-[-10px] flex w-full'>
              <div className='flex flex-col'>
                {
                  listCategory.map((category, index) =>
                    <div className='self-start '>{index + 1}. #{category.id} - {category.name}</div>
                  )
                }
              </div>
              <div className='ml-auto'>
                <Table columns={columns} data={data} />
              </div>
            </div>
          </div>
        </fieldset>
      
        <div className='gap-2 fixed bottom-0 w-full bg-slate-700 p-2 right-0 flex justify-end '>
          <button className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
           onClick={() => modalAgreeCreatePromotion.current.show()}>
            Thêm</button>
          <div className=""></div>
        </div>
        
      </form>
    </div>
    <Modal ref={modalAgreeCreatePromotion} >
        <div className='py-5 px-20 flex flex-col gap-3 justify-start items-center shadow-md overflow-hidden mr-10'>
          <div className='font-bold'>Bạn chắc chắn muốn tạo chương trình khuyến mãi?</div>
          <div className='flex gap-3 my-4'>
          <button className='middle none center mr-4 rounded-lg bg-red-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
              onClick={() => modalAgreeCreatePromotion.current.hide()}
            >&nbsp;&nbsp;Hủy&nbsp;&nbsp;</button>
            <button className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
               onClick={() => {
                onAgreeCreatePromorion();
                modalAgreeCreatePromotion.current.hide();
              }}>
              Đồng ý</button>
    
          </div>
        </div>
      </Modal>
       
    </div>
  )
}

export default AddPromotion;
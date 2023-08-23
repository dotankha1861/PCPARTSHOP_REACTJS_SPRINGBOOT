import React, { useEffect, useState } from 'react'
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { get, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import 'react-datepicker/dist/react-datepicker.css';
import { getAllCategoryStart } from '../../../redux/slices/categorySlice';
import Table from '../../table/Table';
import Toast from '../../../utils/toast_helper';
import { createPromotionStart, updatePromotionStart } from '../../../redux/slices/promotionSlice';
import { convertDate, getStatusDateBetween, parseDate } from '../../../utils/convert_helper';
import { getPromotionById } from '../../../redux/apis/promotionApi';
import { DatePicker1Presentation } from '../../datetime/DateTimePicker';
import { updateProductStart } from '../../../redux/slices/productSlice';


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

const UpdatePromotion = ({ promotion, hide }) => {
  const [currPromotion, setCurrPromotion] = useState(promotion);
  const [readOnlyInput, setReadOnlyInput] = useState(true);
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
      imgAccessor: 'image',
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
    return categories.map((category) => category)
  }, [categories]);

  useEffect(() => {
    const getCategoryOfPromotion = async () => {
      try {
        const { data: resBody } = await getPromotionById(promotion.id);
        setListCategory(resBody.data.listCategories);
      }
      catch (error) {
        /// xử lý sau
      }
    }
    getCategoryOfPromotion();
  }, []);

  useEffect(() => {
    dispatch(getAllCategoryStart());
  }, [dispatch])


  // const [selectedDateStart, setSelectedDateStart] = useState(null);
  // const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  // const [selectedImage, setSelectedImage] = useState(null);
  // const [fileChoose, setFileChoose] = useState(null);


  const schema = yup.object().shape({
    name: yup.string().required("* Vui lòng nhập tên sản phẩm"),
  });

  const { register, setValue, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  }, []);
  // const [isDisable, setDisable] = useState(true);

  const onUpdatePromotion = async (data) => {
    // if(readOnlyInput) setReadOnlyInput(()=> false) 
    // else {
    if (listCategory.length === 0) Toast.error("Vui lòng chọn ít nhất 1 danh mục")
    console.log("oK")
    dispatch(updatePromotionStart({
      id: promotion.id,
      data: {
        ...data,
        effectiveDate: convertDate(data.effectiveDate),
        expirationDate: convertDate(data.expirationDate),
        listCategoriesId: listCategory.map(cate => cate.id)
      },
      hide: () => setReadOnlyInput(true)
    }));
    // }

  };
  const getPromotion = async () => {
    try {
      const { data: resBody } = await getPromotionById(promotion.id);
      setValue("name", resBody.data?.name);
      setValue("discount", resBody.data?.discount);
      setValue("priceFrom", resBody.data?.priceFrom);
      setValue("priceTo", resBody.data?.priceTo);
      setValue("effectiveDate", parseDate(resBody.data?.effectiveDate));
      setValue("expirationDate", parseDate(resBody.data?.expirationDate));
      setListCategory(() => resBody.data?.listCategories);
    }
    catch {

    }
  }


  return (
    <div className="flex flex-col items-center py-1 pb-5 px-2 gap-5 min-h-screen">
      <form onSubmit={handleSubmit(onUpdatePromotion)} className='flex gap-3 mb-10 min-h-screen' encType='multipart/form-data '>

        <fieldset disabled={readOnlyInput} className='py-10 flex flex-col items-center px-6 bg-white drop-shadow-md shadow-inner rounded-xl gap-10 text-black'>

          <div className='w-[100%] flex justify-start gap-2 items-center'>
            <label htmlFor='name' className='whitespace-nowrap'>
              Tên CT khuyến mãi
            </label>
            <input type='text'
              id="name"
              className='input w-full'
              defaultValue={promotion.name}
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
              defaultValue={promotion.discount}
              {...register("discount")} >
            </input>
          </div>
          <div className='font-semibold self-start my-[-10px]'> THỜI GIAN ÁP DỤNG</div>
          <div className='w-[100%] flex justify-start gap-4 items-center'>
            <div className="flex items-center gap-2 w-[50%] justify-start">
              <label htmlFor='name' className='whitespace-nowrap'>
                Thời gian bắt đầu
              </label>
              <Controller
                name={"effectiveDate"}
                control={control}
                defaultValue={parseDate(promotion.effectiveDate)}
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
              <label htmlFor='name' className='whitespace-nowrap'>
                Thời gian kết thúc
              </label>
              <Controller
                name={"expirationDate"}
                control={control}
                defaultValue={parseDate(promotion.expirationDate)}
                render={({ field: { onChange, value } }) => {
                  return (
                    <DatePicker1Presentation
                      disabled={readOnlyInput}
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
                defaultValue={promotion.priceFrom}
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
                defaultValue={promotion.priceTo}
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
              { !readOnlyInput && <div className='ml-auto'>
                <Table columns={columns} data={data} />
              </div>}
            </div>
          </div>
        </fieldset>

        {readOnlyInput && getStatusDateBetween(promotion.effectiveDate, promotion.expirationDate) === -1? <div className='gap-2 fixed bottom-0 w-full bg-slate-700 p-2 right-0 flex justify-end '>
          <div className='cursor-pointer middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
            onClick={() => setReadOnlyInput(() => false)}>
            Sửa</div>
        </div > : getStatusDateBetween(promotion.effectiveDate, promotion.expirationDate) === -1 &&
          <div className='gap-2 fixed bottom-0 w-full bg-slate-700 p-2 right-0 flex justify-end '>
            <div className='cursor-pointer middle none center mr-4 rounded-lg bg-red-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20  hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
              onClick={() => {
                getPromotion();
                setReadOnlyInput(() => true);
              }}>
              Hủy</div>
            <button type="submit" className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'>
              Lưu</button>
          </div>
        }
      </form>

    </div>
  )
}

export default UpdatePromotion;
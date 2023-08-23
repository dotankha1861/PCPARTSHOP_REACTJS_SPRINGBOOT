import React from 'react'
import { useDispatch } from 'react-redux'
import { deletePromotionStart } from '../../../redux/slices/promotionSlice';
// import { deleteCategoryStart } from '../../../redux/slices/categorySlice';

const DeletePromotion = ({promotion, hide}) => {
  const dispatch = useDispatch();
  const handleDeletePromotion = () => {
    dispatch(deletePromotionStart({id: promotion.id, hide}));
  }

  return (
    <div className='py-5 px-20 flex flex-col gap-3 justify-start items-center shadow-md overflow-hidden'>
          <div>Bạn chắc chắn muốn xóa chương trình khuyến mãi <span className='font-semibold'>#{promotion.id} - {promotion.name} ?</span></div>
          <div className='flex gap-5 my-4'>
          <button className='middle none center mr-4 rounded-lg bg-red-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
              onClick={() => hide()}
            >&nbsp;&nbsp;Quay lại&nbsp;&nbsp;</button>
            <button className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                onClick={handleDeletePromotion}
              >
              Đồng ý</button>

          </div>
        </div>
  )
}

export default DeletePromotion;
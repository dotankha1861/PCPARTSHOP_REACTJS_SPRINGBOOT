import React from 'react'
import { useDispatch } from 'react-redux'
import { deleteProductStart } from '../../../redux/slices/productSlice';
import { activeEmployeeStart } from '../../../redux/slices/employeeSlice';

const ActiveEmployee = ({employee, hide}) => {
  const dispatch = useDispatch();

  const handleActiveEmployee= () => {
    dispatch(activeEmployeeStart({employeeId: employee.employeeId, active: !employee.active, hide}));
  }

  return (
    <div className='py-5 px-20 flex flex-col gap-3 justify-center items-center shadow-md overflow-hidden w-[600px]'>
          <div className='text-center'>Bạn chắc chắn muốn {employee.active ? "khóa" : "mở khóa"} tài khoản nhân viên <span className='font-semibold '>#{employee.employeeId} - {employee.lastName + " " + employee.firstName} ?</span></div>
          {/* <img src={product.image || "http://localhost:8080/images/setting/default-product" } alt="" 
            className='w-16 h-16 rounded-md'></img> */}
              <div className='flex gap-3 my-4 mt-10'>
            <button className='middle none center mr-4 rounded-lg bg-red-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
              onClick={() => hide()}
            >&nbsp;&nbsp;Quay lại&nbsp;&nbsp;</button>
            <button className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                onClick={handleActiveEmployee}
              >
              Đồng ý</button>

          </div>
        </div>
  )
}

export default ActiveEmployee;
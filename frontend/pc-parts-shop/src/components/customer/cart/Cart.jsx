import React, { forwardRef, useRef, useState } from 'react'
import Modal from '../../Modal'
import CartDetail from './CartDetail';
import { useNavigate } from 'react-router-dom'
import { FaShoppingCart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Toast from '../../../utils/toast_helper';

const Cart = ({showLog}, ref) => {
  const [isShowSubmit, setShowSubmit] = useState(false);
  const {currentCart} = useSelector(state => state.cart);
  const {currentUser} = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleClickOrder = () => {
    if(currentUser?.role === "CUSTOMER") {
      ref.current.hide();
      navigate("/order");
    }
    else{
      ref.current.hide();
      Toast.info("Vui lòng đăng nhập để đặt hàng");
      showLog();
    }
  }

  return (
    <Modal ref={ref} title={"GIỎ HÀNG"}>
      <div className='h-screen'>
        <div className="flex flex-col items-center pb-1">
          <CartDetail showSubmit = {setShowSubmit}/>
          {isShowSubmit && <div className='flex flex-col items-center pb-1 w-full'>
            {currentCart.length > 0 ? <div className='button bg-green-600 hover:bg-green-500 border-none text-white p-2 mr-2 shadow self-end'
            onClick={handleClickOrder}>Tiến hành đặt hàng</div> :
            <div>Không có sản phẩm nào</div>}
          </div>}
         
        </div>
        {/* <div className='w-full flex justify-end bg-slate-200 fixed bottom-0'>
        <div className='button my-2 mx-5'
            onClick={handleClickOrder}>Tiến hành đặt hàng</div>
      </div> */}
      </div>

    </Modal>
  )
}

export default forwardRef(Cart);
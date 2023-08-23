import React, { useEffect, useRef, useState } from 'react'
import CartDetail from '../../components/customer/cart/CartDetail';
import { Card } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { createOrder } from '../../redux/apis/orderApi';
import Toast from '../../utils/toast_helper';
import { refreshCartStart } from '../../redux/slices/cartSlice';
import ViewDetail from '../../components/customer/order/ViewDetail';
import Modal from '../../components/Modal';

const Order = () => {
  const dispatch = useDispatch();
  const [isShowSubmit, setShowSubmit] = useState(false);
  const { currentUser } = useSelector(state => state.auth);
  const { currentCart } = useSelector(state => state.cart);
  const [order, setOrder] = useState();
  const cartDetail = useRef();
  const [isSuccess, setSuccess] = useState(false);
  const [data, setData] = useState();
  const confirmModal = useRef();
  const schema = yup.object().shape({
    // : yup.string().required("* Vui lòng nhập tài khoản"),
    // password: yup.string().required("* Vui lòng nhập mật khẩu"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  // const handleClickShowPassword = () => {
  //   setShowPassWord(() => !isShowPassword);
  // };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };
  
  const onCreateOrder = async () => {
    const detailCartItems = cartDetail.current.getDetailCart();
    const requestBody = {
      ...data,
      orderDetails: detailCartItems.map(item => ({
        skuCode: item.skuCode,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount,
      }))
    }
    try {
      const {data: resBody} = await createOrder(requestBody);
      setOrder(resBody.data);
      setSuccess(() => true);
      dispatch(refreshCartStart());
      scrollToTop();
      confirmModal.current.hide();
      Toast.success("Tạo đơn hàng thành công");
      
    }
    catch (error) {
      confirmModal.current.hide();
    }
  };

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
      });
    };
    scrollToTop();
  }, []);
  console.log(currentCart);
  return (
    <div>
      {isSuccess ? <div className='flex flex-col items-center justify-center pt-10'>
        <ViewDetail order={order}/>
      </div>: 
      <div className='text-black w-full ml-5 h-screen text-center align-middle fixed top-20 overflow-auto flex items-center flex-col' >
        {currentCart.length === 0 ? <div>Không có sản phẩm để đặt hàng</div> :
          <div className=' w-fit'>
            <Card>
              <div className='w-full flex-col items-center '>
                <form className='flex flex-col gap-9 px-7 mb-[90px] ml-auto'
                  onSubmit={handleSubmit((dt) => {
                    setData(() => dt);
                    confirmModal.current.show();
                  })}>
                  <div className=' font-bold text-xl'>ĐẶT HÀNG</div>
                  <div className="self-start font-semibold ml-5">THÔNG TIN NGƯỜI NHẬN</div>
                  <div className='w-[90%] flex flex-col gap-9 m-auto'>
                    <div className='flex items-center gap-5'>
                      <div className='w-[100%] flex justify-start gap-2 items-center'>
                        <label htmlFor='full-name' className='whitespace-nowrap'>
                          Họ và tên
                        </label>
                        <input type='text'
                          id="full-name"
                          // defaultValue={currentUser?.address}
                          className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'
                          defaultValue={currentUser?.lastName + " " + currentUser?.firstName}
                          {...register("fullName")}>
                        </input>
                      </div>
                      <div className='w-[100%] flex justify-start gap-2 items-center'>
                        <label htmlFor='phone' className='whitespace-nowrap'>
                          Số điện thoại
                        </label>
                        <input type='text'
                          id="phone"
                          // defaultValue={currentUser?.address}
                          className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'
                          defaultValue={currentUser?.phone}
                          {...register("phone")}>
                        </input>
                      </div>
                    </div>
                    <div className='w-[100%] flex justify-start gap-2 items-center'>
                      <label htmlFor='email' className='whitespace-nowrap'>
                        Email
                      </label>
                      <input type='text'
                        id="email"
                        // defaultValue={currentUser?.address}
                        className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'
                        defaultValue={currentUser?.email}
                        {...register("email")}>
                      </input>
                    </div>

                    <div className='w-[100%] flex justify-start gap-2 items-center'>
                      <label htmlFor='address' className='whitespace-nowrap'>
                        Địa chỉ

                      </label>
                      <input type='text'
                        id="address"
                        // defaultValue={currentUser?.address}
                        className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'
                        {...register("address")}
                        defaultValue={currentUser?.address}>
                      </input>
                    </div>
                    <div className='w-[100%] flex justify-start gap-2 items-center'>
                      <label htmlFor='note' className='whitespace-nowrap'>
                        Ghi chú
                      </label>
                      <input type='text'
                        id="note"
                        // defaultValue={currentUser?.address}
                        className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-full'
                        {...register("note")}>
                      </input>
                    </div>
                  </div>
                  <div className="self-start font-semibold ml-5">CHI TIẾT ĐƠN HÀNG</div>
                  <CartDetail ref={cartDetail} showSubmit={setShowSubmit} />
                  <button className='w-full button mt-4 bg-green-600 hover:bg-green-500 border-none text-white p-2'
                  >ĐẶT HÀNG
                  </button>
                </form>
              </div>
            </Card>

          </div>}


      </div>}
      <Modal ref={confirmModal}>
        <div className='py-5 px-20 flex flex-col gap-3 justify-start items-center shadow-md overflow-hidden'>
          <div className='font-bold'>Bạn chắc chắn muốn đặt đơn hàng này?</div>
          <div className='flex gap-3 my-4'>
          <button className='middle none center mr-4 rounded-lg bg-red-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
              onClick={() => confirmModal.current.hide()}
            >Quay lại</button>
            <button className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
              onClick={onCreateOrder}>
              Đồng ý</button>
          </div>
        </div>
      </Modal>
    </div>

  )
}

export default Order;
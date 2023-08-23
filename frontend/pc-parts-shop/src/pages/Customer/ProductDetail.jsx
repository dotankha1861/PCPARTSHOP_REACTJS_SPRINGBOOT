import React, { useEffect, useState } from 'react'
import { getProductBySkuCode } from '../../redux/apis/productApi';
import { formatMoney, getPathAndFragmentFromURL } from '../../utils/convert_helper';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategorySuccess } from '../../redux/slices/categorySlice';
import { addToCartStart, addToCartSuccess, updateCartStart, updateCartSuccess } from '../../redux/slices/cartSlice';
import Toast from '../../utils/toast_helper';


const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState();
  const {currentCart} = useSelector(state => state.cart);
  const {currentUser} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
      });
    };
    scrollToTop();
  },[]);

  useEffect(() => {
    const getProduct = async () => {
      const {path: urlCurrent} = getPathAndFragmentFromURL(window.location.href);
      const hyphenSIndex = urlCurrent.lastIndexOf('-s');
      const skuCode = urlCurrent.substring(hyphenSIndex + 2);
      try {
        const { data: resBody } = await getProductBySkuCode(skuCode);
        setProduct(resBody.data);
      }
      catch (error) {

      }
    }
    getProduct();
  }, []);
  console.log(product);
  const handleClickAddToCart= (quantity) => {
    const item = currentCart.find((item) => item.skuCode === product.skuCode);
    if(currentUser) {
      if(item){
        dispatch(updateCartStart({skuCode: product.skuCode, quantity: item.quantity + quantity, isAdd: true}));
        setQuantity(1);
      }
      else {
        dispatch(addToCartStart({skuCode: product.skuCode, quantity}));
      }
    }
    else {
      if(item){
        dispatch(updateCartSuccess({skuCode: product.skuCode, quantity: item.quantity + quantity, isAdd: true}));
        Toast.success("Đã thêm sản phẩm vào giỏ hàng");
        setQuantity(1);
      }
      else {
        dispatch(addToCartSuccess({skuCode: product.skuCode, quantity}));
        Toast.success("Đã thêm sản phẩm vào giỏ hàng");
      }
    }
  }
  return (
    <div>
      <section class="py-5 font-poppins dark:bg-gray-800 -mt-5">
        <div class="max-w-6xl mx-auto">
          <div class="flex flex-wrap mb-24 -mx-4">
            <div class="w-full px-4 mb-8 md:w-1/2 md:mb-0">
              <div class="top-0 overflow-hidden ">
                <div class="mb-6 lg:mb-10 lg:h-96 flex justify-center items-center">

                  <img class="w-[400px] lg:h-[400px] " src={product?.image} alt="" />

                </div>
              </div>
            </div>
            <div class="w-full px-4 md:w-1/2">
              <div class="lg:pl-20">
                <div class="mb-6 ">
                  <div className='flex flex-col gap-1 mb-6'>
                  <h2 class="max-w-xl mt-6 text-xl font-semibold leading-loose tracking-wide text-gray-700 md:text-2xl dark:text-gray-300">
                    {product?.name}
                  </h2>
                  <div className="text-gray-500">SKU: {product?.skuCode}</div>
                  </div>
                

                  <p class="text-2xl font-semibold text-gray-700 dark:text-gray-400 flex items-center ">
                    <span>{formatMoney((100 - product?.discount) * product?.price / 100)} </span>
                      {product?.discount > 0 && <div className='flex gap-4 w-full items-center'>
                        <span class="ml-3 text-base font-normal text-red-500 line-through dark:text-gray-400">
                          
                          {product?.price && formatMoney(product?.price)} 
                        </span>
  
                        <div className='text-red-600 ml-4 text-lg'>{product?.discount > 0 && "-" + product?.discount + "%"}</div>
                      </div>
                      }
            

                  </p>
                </div>
                <div class="mb-6">
                  {/* <h2 class="mb-2 text-lg font-bold text-gray-700 dark:text-gray-400">Mô tả :</h2> */}
                  <div class="bg-gray-100 dark:bg-gray-700 rounded-xl">
                    <div class="p-3 lg:p-5 ">
                      <div class="p-2 rounded-xl lg:p-6 dark:bg-gray-800 bg-gray-50">
                        <div class="flex flex-wrap justify-center gap-x-10 gap-y-4">



                          <div>
                            <p class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
                              {product?.shortDesc}</p>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-6 "></div>
                <div class="flex flex-wrap items-center mb-6">
                  <div class="mb-4 mr-4 lg:mb-0">
                    <div class="w-28">
                      <div class="relative flex flex-row w-full h-10 bg-transparent rounded-lg">
                        <button onClick={() => setQuantity(quantity > 1 ? quantity - 1: 1)} 
                          class="w-20 h-full text-gray-600 bg-gray-100 border-r rounded-l outline-none cursor-pointer dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 hover:text-gray-700 dark:bg-gray-900 hover:bg-gray-300">
                          <span class="m-auto text-2xl font-thin">-</span>
                        </button>
                        <div class="flex justify-center items-center w-full font-semibold text-center text-gray-700 placeholder-gray-700 bg-gray-100 outline-none dark:text-gray-400 dark:placeholder-gray-400 dark:bg-gray-900 focus:outline-none text-md hover:text-black" >{quantity} </div>
                        <button onClick={() => setQuantity(quantity + 1)}
                            class="w-20 h-full text-gray-600 bg-gray-100 border-l rounded-r outline-none cursor-pointer dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 dark:bg-gray-900 hover:text-gray-700 hover:bg-gray-300"> 
                          <span class="m-auto text-2xl font-thin">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="mb-4 lg:mb-0">
                  </div>
                  <div  onClick={() =>handleClickAddToCart(quantity)}
                    className="px-4 py-3 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-[1px] border-gray-900 focus:outline-none text-md text-green-700">
                    Thêm vào giỏ hàng
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
            <div className='font-bold text-2xl'>
              Mô tả chi tiết
            </div>
            <p className='text-md font-normal whitespace-pre-wrap mt-2'  dangerouslySetInnerHTML={{ __html: product?.detailDesc }}>
            </p>
            </div>
           
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductDetail
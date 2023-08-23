import React, { useEffect, useRef } from 'react'
import SideBar from '../../components/customer/product/SideBar'
import ListProduct from '../../components/customer/product/ListProduct'

const Product = (props) => {
  // const listProductItems = useRef();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
      });
    };
    scrollToTop();
  },[]);

  return (
    <div>
        <SideBar />
        <ListProduct/>
    </div>
  )
}

export default Product
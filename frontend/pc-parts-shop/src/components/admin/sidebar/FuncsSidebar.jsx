import { Collapse } from '@mui/material';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { TbPointFilled } from 'react-icons/tb'
import { useSelector } from 'react-redux';
const config = {
  functionalities: [
    {
      key: 1,
      name: "TRANG CHỦ",
      uri: "/admin"
    },
    {
      key: 2,
      name: "NGƯỜI DÙNG",
      childs: [
        {
          key: 1,
          name: "Nhân viên",
          uri: "/admin/employees"
        },
        {
          key: 2,
          name: "Khách hàng",
          uri: "/admin/customers"
        }
      ]
    },
    {
      key: 3,
      name: "DANH MỤC",
      uri: "/admin/categories"
    },
    {
      key: 4,
      name: "SẢN PHẨM",
      uri: "/admin/products"
    },
    {
      key: 5,
      name: "ĐƠN HÀNG",
      uri: "/admin/orders"
    },
    {
      key: 6,
      name: "KHUYẾN MÃI",
      uri: "/admin/promotions"
    },

    {
      key: 7,
      name: "KIỂM HÀNG",
      uri: "/admin/inventory-sheets"
    },
    {
      key: 8,
      name: "THỐNG KÊ",
      uri: "/admin/statistics"
    }
  ],
}

const offset = 1000;

const FuncsSidebarAdmin = (props, ref) => {
  const {currentUser} = useSelector(state => state.auth);
  const [funcs, setFuncs] = useState();

  const [activeLink, setActiveLink] = useState(config.functionalities[0].key);
  const navigate = useNavigate();
  const [showChild, setShowChild] = useState(
    config.functionalities.filter(func => func.childs).reduce((acc, func) => {
      return {
        ...acc,
        [func.key]: false
      };
    }, {})
  );
    useEffect(() => {
      if(currentUser?.role === "ADMIN") setFuncs(() => config.functionalities)
      else setFuncs(() => config.functionalities.filter(item => item.key !==2 && item.key!==8))
    }, [currentUser]);

  const handleClickLink = (key, keyChild) => {
    setActiveLink(() => key);
    if (keyChild) {
      setActiveLink(key * offset + keyChild);
      navigate(config.functionalities[key-1].childs[keyChild-1].uri);
    }
    else if (config.functionalities[key-1].childs) setShowChild({ [key]: true })
    else {
      setShowChild(Object.keys(showChild).reduce((acc, func) => {
        return {
          ...acc,
          [func]: false,
        };
      }, {}))
      navigate(config.functionalities[key-1].uri);
    }
  };

  useEffect(() => {
    if(window.location.href === "http://localhost:3000/admin") setActiveLink(config.functionalities[0].key);
  },[window.location.href]);

  console.log(showChild)

  useImperativeHandle(ref, () => ({
    clearActiveLinkSideBar: () => setActiveLink(() => -1)
  }))

  return (
    <div className='mt-3 w-full p-1'>
      <ul className='flex flex-col justify-start items-center gap-1 transition-[display] duration-1000'>
        {funcs?.map((func) => 
          <div className='w-full'>
            {activeLink === func.key || Math.floor(activeLink / offset) === func.key ?
              <li key={func.key} className='rounded-md text-gray-200 text-sm text-center font-semibold font-serif p-2 w-full gradient-to-r'>
                {func.name}
              </li> :
              <li key={func.key} className='rounded-md text-gray-200 text-sm text-center hover:gradient-to-center font-semibold font-serif p-2 w-full gradient-to-br'
                onClick={() => handleClickLink(func.key)}>
                {func.name}
              </li>
            }
            {func.childs &&
              <Collapse in={showChild[func.key] && activeLink != -1}
                timeout={500}>
                {func.childs.map(child =>
                  <div className='flex items-center'>
                    <div className='w-full text-left text-gray-200 text-sm hover:gradient-to-center font-semibold font-serif p-2 mt-1'
                      onClick={() => handleClickLink(func.key, child.key)}>
                      {child.name}
                    </div>
                    {activeLink === func.key * offset + child.key &&
                      <TbPointFilled size={24} />
                    }
                  </div>
                )}
              </Collapse>
            }
          </div>
        )}
      </ul>
    </div>
  )
}

export default forwardRef(FuncsSidebarAdmin);
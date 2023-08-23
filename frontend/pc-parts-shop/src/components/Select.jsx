import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { classNames } from './table/shared/Utils';

const Select = ({options, setOnSelected, position}, ref) => {
  const refSelected = useRef();
  const [showOptions, setShowOption] = useState(false);
  const [select, setSelect] = useState(0);

  useImperativeHandle(ref, () => ({
    getSelect: () => {return {select, name: options[select].name, value: options[select].value}}
  }));
  
  const handleToggle = (e) => {
    if (showOptions) setShowOption(()=> !showOptions);
    else if (refSelected.current?.contains(e?.target)) {
      setShowOption(()=> !showOptions);
    }
  }

  useEffect(() => {
    const handleToggle = (e) => {
      if (showOptions) setShowOption(()=> !showOptions);
      else if (refSelected.current?.contains(e?.target)) {
        setShowOption(()=> !showOptions);
      }
    }
    document.addEventListener('click', handleToggle);
    return () => document.removeEventListener('click', handleToggle);
  },[showOptions]);

  return (
    <div>
      <div className='relative w-full min-w-200px'>
        <button id="dropdownActionButton"   data-dropdown-toggle="dropdownAction" class="w-full inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100  focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
          <div  ref= {refSelected} className='flex items-center gap-2 w-full whitespace-nowrap font-semibold text-gray-800'>
            <span class="sr-only" ></span>
            {options[select].name}
            <svg class="w-2.5 h-2.5 ml-auto " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
            </svg>
          </div>
        </button>
        {
          showOptions && <div id="dropdownAction" className= {
            classNames(
              "w-full z-10 absolute right-0 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ",
              position === "TOP" ? "bottom-full" : null
            )  
          }>
            <ul class="text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">
              {
                options.map((option, index) => {
                  return option.value !== options[select].value && 
                  <li key={option.value} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white font-semibold"
                    onClick={() => {
                      setSelect(index);
                      setOnSelected(option);}}>
                        {option.name}
                  </li>
                })
            }
            </ul>
          </div>
        }
      </div>
    </div>
  )
}

export default forwardRef(Select);
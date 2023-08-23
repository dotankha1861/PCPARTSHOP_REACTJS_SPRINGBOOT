import React, { useLayoutEffect, useMemo, useRef } from 'react'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy, usePagination } from 'react-table'
// import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid'
import { LuChevronsLeft, LuChevronsRight } from 'react-icons/lu';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { Button, PageButton } from './shared/Button'
import { classNames } from './shared/Utils'
import { SortIcon, SortUpIcon, SortDownIcon } from './shared/Icons'
import Select from '../Select';

// Define a default UI for filtering
// function GlobalFilter({
//   preGlobalFilteredRows,
//   globalFilter,
//   setGlobalFilter,
// }) {
//   const count = preGlobalFilteredRows.length
//   const [value, setValue] = React.useState(globalFilter)
//   const onChange = useAsyncDebounce(value => {
//     setGlobalFilter(value || undefined)
//   }, 200)

//   return (
//     <label className="flex gap-x-2 items-center mr-2">
//       <span className="text-gray-700 whitespace-nowrap">Tìm kiếm: </span>
//       {/* <input
//         type="text"
//         className="input"
//         value={value || ""}
//         onChange={e => {
//           setValue(e.target.value);
//           onChange(e.target.value);
//         }}
//         placeholder={`Nhập từ khóa`}
//       /> */}
//       <div class="  w-full">
//         <input type="search" x-model="input2"
//           class="w-full inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100  focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
//           value={value || ""}
//           onChange={e => {
//             setValue(e.target.value);
//             onChange(e.target.value);
//           }}
//           placeholder={`Nhập từ khóa`} />
//       </div>
//     </label>
//   )
// }

// // This is a custom filter UI for selecting
// // a unique option from a list
// export function SelectColumnFilter({
//   column: { filterValue, setFilter, preFilteredRows, id, render, pairsFilter},}) {
//   // Calculate the options for filtering
//   // using the preFilteredRows
//   const options = React.useMemo(() => {
//     const options = new Set();
//     preFilteredRows.forEach(row => {
//         options.add(row.values[id])
//     });
//     return [...options.values()]
//   }, [id, preFilteredRows])
//   console.log(options)
//   // Render a multi-select box
//   return (
//     <label className="flex gap-x-2 items-baseline">
//       <span className="text-gray-700">{render("Header")}: </span>
//       <div className='w-[170px]'>
//         <Select options ={[{ name: "Tất cả", value: "" }, ...options.map((option) => {
//           return { name: pairsFilter[option], value: option };
//         })]}
//           setOnSelected={(option) => setFilter(option.value || undefined)}></Select>
//       </div>
//       {/* <select
//         className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         name={id}
//         id={id}
//         value={filterValue}
//         onChange={e => {
//           setFilter(e.target.value || undefined)
//         }}
//       >
//         <option value="">Tất cả</option>
//         {options.map((option, i) => (
//           <option key={i} value={option}>
//             {option}
//           </option>
//         ))}
//       </select> */}
//     </label>
//   )
// }

// export function StatusPill({ value }) {
//   const status = value ? value.toLowerCase() : "unknown";

//   return (
//     <span
//       className={
//         classNames(
//           "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
//           status.startsWith("active") ? "bg-green-100 text-green-800" : null,
//           status.startsWith("inactive") ? "bg-yellow-100 text-yellow-800" : null,
//           status.startsWith("offline") ? "bg-red-100 text-red-800" : null,
//         )
//       }
//     >
//       {status}
//     </span>
//   );
// };

// export function AvatarCell({ value, column, row }) {
//   return (
//     <div className="flex items-center">
//       <div className="flex-shrink-0 h-14 w-14">
//         <img className="h-14 w-14 rounded-full" src={row.original[column.imgAccessor]} alt="" />
//       </div>
//       <div className="ml-4">
//         <div className="text-sm font-medium text-gray-900">{value}</div>
//         <div className="text-sm text-gray-500">{row.original[column.emailAccessor]}</div>
//       </div>
//     </div>
//   )
// }

function Table2({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable({
    columns,
    data,
  },
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
    usePagination,  // new
  )

  const pageRows = useMemo(() => 50);

  useLayoutEffect(() => {
    setPageSize(pageRows);
  }, [])
  // const selectPage = useRef();

  // Render the UI for your table
  return (
    <>
      {/* <div className="sm:flex sm:gap-x-2 items-center">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <div className="mt-2 sm:mt-0" key={column.id}>
                {column.render("Filter")}
              </div>
            ) : null
          )
        )}
      </div> */}
      {/* table */}
      <div className='shadow drop-shadow'>
        <div className="mt-4 flex flex-col shadow drop-shadow-md rounded-s-md">
          <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="border-b border-gray-200  h-[375px] overflow-auto">
                <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                  <thead className="sticky top-0 z-40">
                    {headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => {
                          // Add the sorting props to control sorting. For this example
                          // we can add them into the header props
                          {
                            return column.sortable ? <th
                              scope="col"
                              className="group px-3 py-3 text-xs font-medium uppercase tracking-wider"
                            >
                              <div className="flex items-center bg-gray-100 ">
                                {column.render('Header')}
                                {/* Add a sort direction indicator */}
                                <span {...column.getHeaderProps(column.getSortByToggleProps())}>
                                  {column.isSorted
                                    ? column.isSortedDesc
                                      ? <SortDownIcon className="w-5 h-5 " />
                                      : <SortUpIcon className="w-5 h-5 " />
                                    : (
                                      <SortIcon className="w-5 h-5  group-hover:opacity-100" />
                                    )}
                                </span>
                              </div>
                            </th> :
                              <th
                                scope="col"
                                className="group px-3 py-3 text-xs font-medium uppercase tracking-wider bg-gray-100"
                              >
                                {<div className="flex items-center ">
                                  {column.render('Header')}
                                </div>}
                              </th>
                          }
                        })}
                      </tr>
                    ))}
                     {headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => {
                          // Add the sorting props to control sorting. For this example
                          // we can add them into the header props
                          {
                            return <th
                                scope="col"
                                className="bg-gray-100 group px-3 py-3 border-y-[1.1px] border-gray-400 text-sm font-medium tracking-wider"
                              >
                                <div className="flex items-center ">
                                  {column.render('Footer')}
                                </div>
                              </th>
                          }
                        })}
                      </tr>
                    ))}
                  </thead>
                  <tbody
                    {...getTableBodyProps()}
                    className="bg-white divide-y divide-gray-200 "
                  >
                    {page.map((row, i) => {  // new
                      prepareRow(row)
                      return (
                        <tr {...row.getRowProps()} >
                          {row.cells.map(cell => {
                            return (
                              <td
                                {...cell.getCellProps()}
                                className="px-3 py-2 whitespace-nowrap"
                                role="cell"
                              >
                                {cell.column.Cell.name === "defaultRenderer"
                                  ? <div className="text-sm text-gray-500">{cell.render('Cell')}</div>
                                  : cell.render('Cell')
                                }
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="sticky top-0 bg-gray-100 z-40">
                    {headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => {
                          <th
                            scope="col"
                            className="group px-3 py-3 text-xs font-medium uppercase tracking-wider"
                          >
                            <div className="flex items-center ">
                              {column.render('Footer')}
                            </div>
                          </th>
                        })}
                      </tr>
                    ))}
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Table2;
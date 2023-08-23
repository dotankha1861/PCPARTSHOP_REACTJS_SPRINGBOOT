
import React from 'react' 
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'fullName', headerName: 'First name', width: 130 },
  { field: 'email', headerName: 'Last name', width: 300 },
  { field: 'phone', headerName: 'Last name', width: 130 },

  {
    field: 'age',
    headerName: 'Age',
    // type: 'number',
    width: 100,
    renderCell: (params) => {
      <button className='bg-black w-full h-full'
        // onClick={() => null}
      // disabled={params.row.disabled} // Thêm điều kiện tùy chỉnh cho nút (nếu cần)
      >
      Click Me
    </button>
    }
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    filterable:false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const User = () => {
  return (
    <div>
      <div className='p-5 flex flex-col gap-4'>
        <h1 className='font-bold text-2xl'>Danh sách người dùng</h1>
        <div className='flex items-start gap-3'>
        <DataGrid
            rows={rows}
            columns={columns}
            // initialState={{
            //   pagination: {
            //     paginationModel: { page: 0, pageSize: 6 },
            //   },
            // }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableColumnMenu
          />
        </div>
      </div>
    </div>
  )
}

export default User;

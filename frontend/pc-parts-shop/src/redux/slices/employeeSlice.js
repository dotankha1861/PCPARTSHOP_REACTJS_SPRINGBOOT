import { createSlice } from "@reduxjs/toolkit";

const emloyeeSlice = createSlice({
    name: "employees",
    initialState: {
        employees: [],
        isFetching: false,
        error: false
    },
    reducers: {
        getAllEmployeeStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getAllEmployeeSuccess: (state, action) => {
            state.isFetching = false;
            state.error = false;
            state.employees = action.payload;
        },
        getAllEmployeeFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        createEmployeeStart: (state) => {
            state.isFetching = true;
        },
        createEmployeeSuccess: (state, action) => {
            state.isFetching = false;
            state.employees = [action.payload.data,...state.employees];
        },
        activeEmployeeStart: (state) => {
            state.isFetching = true;
        },
        activeEmployeeSuccess: (state, action) => {
            const {employeeId, active} = action.payload;
            state.isFetching = false;
            state.employees = state.employees.map(employee => employee.employeeId === employeeId ? {...employee, active} : employee);
        },
        deleteEmployeeStart: (state) => {
            state.isFetching = true;
        },
        deleteEmployeeSuccess: (state, action )=> {
            const {employeeId} = action.payload;
            state.employees =state.employees.filter(employee => employee.employeeId !== employeeId);
            state.isFetching = false;
        },
        updateRoleStart: (state) => {
            state.isFetching = true;
        },
        updateRoleSuccess: (state, action) => {
            const {employeeId, role} = action.payload;
            state.employees = state.employees.map(employee => employee.employeeId === employeeId ? {...employee, role} : employee);
            state.isFetching = false;
        }
    }
});

export const {
    getAllEmployeeStart,
    getAllEmployeeSuccess,
    getAllEmployeeFailed,
    createEmployeeStart,
    createEmployeeSuccess,
    activeEmployeeStart,
    activeEmployeeSuccess,
    deleteEmployeeStart,
    deleteEmployeeSuccess,
    updateRoleStart,
    updateRoleSuccess
    
} = emloyeeSlice.actions;
export default emloyeeSlice.reducer;
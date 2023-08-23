import { GridCsvExportMenuItem } from "@mui/x-data-grid";
import { put, takeEvery, call } from "redux-saga/effects";
import { activeEmployeeStart, activeEmployeeSuccess, createEmployeeStart, createEmployeeSuccess, deleteEmployeeStart, deleteEmployeeSuccess, getAllEmployeeFailed, getAllEmployeeStart, getAllEmployeeSuccess, updateRoleStart, updateRoleSuccess } from "../slices/employeeSlice";
import { loginStart } from "../slices/authSlice";
import { activeEmployee, createEmployee, deleteEmployee, getAllEmployee, updateRole } from "../apis/employeeApi";
import Toast from "../../utils/toast_helper";
import { act } from "react-dom/test-utils";

function* getAllEmployeeFetch(action){
    try {
        const {data: resBody} = yield call(getAllEmployee);
        console.log(resBody.data);
        yield put(getAllEmployeeSuccess(resBody.data));
        if(action.payload.action === "reset") Toast.success("Làm mới dữ liệu thành công");
    }
    catch(error){
        yield put(getAllEmployeeFailed());
    }
}

function* createEmployeeFetch(action) {
    const {data, hide} = action.payload;
    try {
        const {data: resBody} = yield call(createEmployee, data);
        yield put(createEmployeeSuccess(resBody));
        hide();
        Toast.success("Tạo nhân viên thành công");
    }   
    catch(error){
        const {data: resBody} = error.response;
        Toast.error(resBody.message);
    }
}

function* activeEmployeeFetch(action)  {
    try{
        const {employeeId, active, hide} = action.payload;
        yield call(activeEmployee, {employeeId, active});
        yield put(activeEmployeeSuccess({employeeId, active}));
        hide();
        if(active) Toast.success("Mở lại tài khoản cho nhân viên thành công");
        else Toast.success("Khóa tài khoản nhân viên thành công");

    }
    catch (error) {
        const {data: resBody} = error.response;
        Toast.error(resBody.message);
    }
}
function* deleteEmployeeFetch(action) {
    const {employeeId, hide} = action.payload;
    try {
        yield call(deleteEmployee, {employeeId});
        yield put(deleteEmployeeSuccess({employeeId}));
        hide();
        Toast.success("Xóa nhân viên thành công");
    }
    catch (error){
        const {data: resBody} = error.response;
        hide();
        Toast.error("Nhân viên đã có hoạt động không thể xóa");
    }
}
function* updateRoleFetch(action) {
    const {employeeId, role} = action.payload;
    try {
        yield call(updateRole, {employeeId, role});
        yield put(updateRoleSuccess({employeeId, role}));
        Toast.success("Cập nhật thành công vai trò nhân viên #" + employeeId);
    }
    catch (error) {
        const {data: resBody} = error.response;
        Toast.error(resBody.message);
    }
}

function* employeeSaga () {
    yield takeEvery(getAllEmployeeStart.toString(), getAllEmployeeFetch);
    yield takeEvery(createEmployeeStart.toString(), createEmployeeFetch);
    yield takeEvery(activeEmployeeStart.toString(), activeEmployeeFetch);
    yield takeEvery(deleteEmployeeStart.toString(), deleteEmployeeFetch);
    yield takeEvery(updateRoleStart.toString(), updateRoleFetch);

}

export default employeeSaga;
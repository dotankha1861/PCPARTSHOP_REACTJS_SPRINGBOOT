import { call, put, takeEvery } from "redux-saga/effects";
import { activeCustomerStart, activeCustomerSuccess, deleteCustomerStart, deleteCustomerSuccess, getAllCustomerStart, getAllCustomerSuccess } from "../slices/customerSlice";
import { activeCustomer, deleteCustomer, getAllCustomer } from "../apis/customerApi";
import { updateProfileCustomer } from "../apis/authApi";
import Toast from "../../utils/toast_helper";
import { updateProfileCustomerStart, updateProfileCustomerSuccess } from "../slices/authSlice";
import { act } from "react-dom/test-utils";
import { deleteEmployeeStart } from "../slices/employeeSlice";


function* getAllCustomerFetch(){
    try {
        const {data: resBody} = yield call(getAllCustomer);
        yield put(getAllCustomerSuccess(resBody.data));
    }
    catch(error){
        // yield put(getAllEmployeeFailed());
        //Xử lý sau
    }
}

function* updateProfileCustomerFetch (action){
    try {
        const {updateData, onSuccess} = action.payload;
        const {data: resBody} = yield call(updateProfileCustomer, updateData);
        yield put(updateProfileCustomerSuccess(resBody));
        Toast.success("Cập nhật thông tin khách hàng thành công");
        onSuccess();
    }
    catch(error){
        Toast.error("Cập nhật thông tin khách hàng không thành công" + error)
    }
}

function* activeCustomerFetch(action) {
    try {
        const {customerId, active, hide} = action.payload;
        yield call(activeCustomer, {customerId, active});
        yield put(activeCustomerSuccess({customerId, active}));
        hide();
        if(active) Toast.success("Mở lại thành công tài khoản khách hàng #" + customerId);
        else Toast.success("Khóa thành công tài khoản khách hàng #" + customerId);
    }
    catch (error) {
        const {data: resBody} = error.response;
        Toast.error(resBody.message);
    }
}
function* deleteCustomerFetch(action) {
    const {customerId, hide} = action.payload;
    try {
        yield call(deleteCustomer, {customerId});
        yield put(deleteCustomerSuccess({customerId}));
        hide();
        Toast.success("Xóa khách hàng thành công");
    }
    catch (error) {
        const {data: resBody} = error.response;
        hide();
        Toast.error(resBody.message);
    }
}
function* customerSaga () {
    yield takeEvery(getAllCustomerStart.toString(), getAllCustomerFetch);
    yield takeEvery(updateProfileCustomerStart.toString(), updateProfileCustomerFetch)
    yield takeEvery(activeCustomerStart.toString(), activeCustomerFetch);
    yield takeEvery(deleteCustomerStart.toString(), deleteCustomerFetch);
}

export default customerSaga;
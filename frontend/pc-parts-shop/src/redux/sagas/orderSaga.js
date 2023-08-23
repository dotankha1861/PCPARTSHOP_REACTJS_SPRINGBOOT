import { call, put, takeEvery } from "redux-saga/effects";
import { approveOrderStart, approveOrderSuccess, cancelOrderStart, cancelOrderSuccess, getAllOrderCustomerStart, getAllOrderCustomerSuccess, getAllOrderStart, getAllOrderSuccess, updateStatusOrderStart, updateStatusOrderSuccess } from "../slices/orderSlice";
import { approveOrder, cancelOrder, getAllOrder, getAllOrderByCustomerId, updateStatusOrder } from "../apis/orderApi";
import Toast from "../../utils/toast_helper";



function* getAllOrderFetch(action) {
    try {
        const { data: resBody } = yield call(getAllOrder);
        console.log(resBody);
        yield put(getAllOrderSuccess(resBody));
        if (action.payload.action === "reset") Toast.success("Dữ liệu đã được cập nhật mới")
    }
    catch (error) {
        // Toast.error("Lỗi lấy dữ liệu không thành công")
    }
}

function* getAllOrderCustomerFetch(){
    try {
        const {data: resBody} = yield call(getAllOrderByCustomerId);
        yield put(getAllOrderCustomerSuccess(resBody));
    }
    catch (error) {

    }
}

function* approveOrderFetch(action){
    try {
        const {orderId} = action.payload;
        yield call(approveOrder, orderId);
        yield put(approveOrderSuccess(action.payload));
        Toast.success("Duyệt đơn hàng thành công");
    }
    catch (error){
        Toast.error("không thể duyệt đơn hàng");
    }
}
function* cancelOrderFetch (action)  {
    try{
        const {id, employeeId, employeeName, hide} = action.payload;
        yield call(cancelOrder, id);
        yield put(cancelOrderSuccess({id, employeeId, employeeName}));
        hide();
        Toast.success("Hủy đơn hàng thành công");
    }
    catch(error){
        const {data: resBody} = error.response;
        Toast.error(resBody.message);
    }
}

function* updateStatusOrderFetch(action) {
    try{
        const {orderId, status, hide} = action.payload;
        yield call(updateStatusOrder, {orderId, status});
        yield put(updateStatusOrderSuccess({orderId, status}));
        if(hide) hide();
        Toast.success("Cập nhật thành công trạng thái đơn hàng #" + orderId);
    }
    catch (error){
        const {data: resBody} = error.response;
        Toast.error(resBody.message);
    }
}

function* orderSaga() {
    yield takeEvery(getAllOrderStart.toString(), getAllOrderFetch);
    yield takeEvery(getAllOrderCustomerStart.toString(), getAllOrderCustomerFetch);
    yield takeEvery(approveOrderStart.toString(), approveOrderFetch);
    yield takeEvery(cancelOrderStart.toString(), cancelOrderFetch);
    yield takeEvery(updateStatusOrderStart.toString(), updateStatusOrderFetch);
}

export default orderSaga;
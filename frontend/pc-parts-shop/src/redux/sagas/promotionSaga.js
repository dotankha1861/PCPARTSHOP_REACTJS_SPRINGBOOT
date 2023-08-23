import { call, put, takeEvery } from "redux-saga/effects";
import { cancelPromotionStart, cancelPromotionSuccess, createPromotionStart, createPromotionSuccess, deletePromotionStart, deletePromotionSuccess, getAllPromotionStart, getAllPromotionSuccess, updatePromotionStart, updatePromotionSuccess } from "../slices/promotionSlice";
import { cancelPromotion, createPromotion, deletePromotion, getAllPromotion, updatePromotion } from "../apis/promotionApi";
import { pureFinalPropsSelectorFactory } from "react-redux/es/connect/selectorFactory";
import Toast from "../../utils/toast_helper";

function* createPromotionFetch(action){
    try {
        const {data, hide} = action.payload;
        const {data: resBody} = yield call(createPromotion, data);
        yield put(createPromotionSuccess(resBody));
        hide();
        Toast.success("Tạo chương trình khuyến mãi thành công");
    }
    catch (error) {
        const {data: resBody} = error.response;
        Toast.error(resBody.data);
    }
}

function* getAllPromotionFetch(action) {
    try {
        console.log("oooo");
        const { data: resBody } = yield call(getAllPromotion);
        yield put(getAllPromotionSuccess(resBody));
        if (action.payload.action === "reset") Toast.success("Dữ liệu đã được cập nhật mới")
    }
    catch (error) {
        // Toast.error("Lỗi lấy dữ liệu không thành công")
    }
}

function* deletePromotionFetch(action) {
    try {
        const {id, hide} = action.payload;
        yield call(deletePromotion, id);
        yield put(deletePromotionSuccess(id));
        hide();
        Toast.success("Xóa chương trình khuyến mãi thành công");
    }
    catch (error){
        const {data: resBody} = error.response;
        const {id, hide} = action.payload;
        hide();
        Toast.error(resBody.message);
    }
}
function* cancelPromotionFetch(action) {
    const {id, hide} = action.payload; 
    try {
        const {data: resBody} = yield call(cancelPromotion, id);
        yield put(cancelPromotionSuccess(resBody.data));
        hide();
        Toast.success("Hủy chương trình khuyến mãi thành công")
    }
    catch (error) { 
        const {data: resBody} = error.response;
        Toast.error(resBody.message);
    }   
}

function* updatePromotionFetch(action){
    const {id, data, hide} = action.payload;
    try {
        const {data: resBody} = yield call(updatePromotion, {id, data});
        yield put(updatePromotionSuccess(resBody));
        Toast.success("Cập nhật chương trình khuyến mãi thành công");
        hide()
    }
    catch (error) {
        const {data: resBody} = error.response;
        Toast.error(resBody.message);
    }
}

function* promotionSaga() {
    yield takeEvery(createPromotionStart.toString(), createPromotionFetch);
    yield takeEvery(getAllPromotionStart.toString(), getAllPromotionFetch);
    yield takeEvery(deletePromotionStart.toString(), deletePromotionFetch);
    yield takeEvery(cancelPromotionStart.toString(), cancelPromotionFetch);
    yield takeEvery(updatePromotionStart.toString(), updatePromotionFetch);
}

export default promotionSaga;
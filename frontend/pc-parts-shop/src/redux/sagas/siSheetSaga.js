import { call, put, takeEvery } from "redux-saga/effects";
import { createSISheetStart, createSISheetSuccess, getAllSISheetStart, getAllSISheetSuccess} from "../slices/stockInventorySheetSlice";
import { createSISheet, getAllSISheet } from "../apis/siSheetApi";
import Toast from "../../utils/toast_helper";
import { act } from "react-dom/test-utils";

function* getAllSISheetFetch(action) {
    try{
        const {data: resBody} = yield call(getAllSISheet);
        yield put(getAllSISheetSuccess(resBody));
        if (action.payload.action === "reset") Toast.success("Dữ liệu đã được cập nhật mới")
    }
    catch (error) {
        //
    }
}

function* createSISheetFetch(action) {
    const {sheetDetails, hide} = action.payload;
    try {
        const {data: resBody} = yield call(createSISheet, {sheetDetails}) ;
        yield put(createSISheetSuccess(resBody));
        console.log("11", resBody);
        Toast.success("Tạo phiếu kiểm và cân bằng kho thành công");
        hide();
    }
    catch(error) {
        const {data: resBody} = error.response;
        Toast.error(resBody.message);
    }
}

function* siSheetSaga () {
    yield takeEvery(getAllSISheetStart.toString(), getAllSISheetFetch);
    yield takeEvery(createSISheetStart.toString(), createSISheetFetch);
}

export default siSheetSaga;
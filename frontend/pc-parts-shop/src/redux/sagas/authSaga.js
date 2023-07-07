import {call, put, takeEvery} from "redux-saga/effects";
import { loginFailed, loginStart, loginSuccess } from "../slices/authSlice";
import { login } from "../../apis/authApi";
import { setAuthHeader } from "../../utils/axios_helper";

function* workGetAuthFetch(action){
    try {
        const {data: resBody} = yield call(login, action.payload);
        setAuthHeader(resBody.data.token);
        yield put(loginSuccess(resBody.data));
    }
    catch(error){
        yield put(loginFailed());
    }
}

function* authSaga() {
    yield takeEvery(loginStart.toString(), workGetAuthFetch);
}

export default authSaga;
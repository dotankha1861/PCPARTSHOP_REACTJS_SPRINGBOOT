import {call, put, takeEvery} from "redux-saga/effects";
import { 
    loginFailed, 
    loginStart, 
    loginSuccess, 
    logoutFailed, 
    logoutStart,
    logoutSuccess, 
    registerFailed, 
    registerStart,
    registerSuccess,
    updateProfileEmployeeSuccess,
    updateProfileEmplyeeStart
} from "../slices/authSlice";
import { login, logout, register, updateProfileEmployee } from "../apis/authApi";
import toast_helper from "../../utils/toast_helper";
import Toast from "../../utils/toast_helper";

function* loginFetch(action){
    try {
        const {data, navigate, page, getCart} = action.payload;
        const {data: resBody} = yield call(login, data);
        if(resBody.data.userDetail.role !== "CUSTOMER" && page === "ADMIN"){
            navigate("/admin");
            // toast_helper.success("Đăng nhập thành công!");
            yield put(loginSuccess(resBody));
        } 
        else if(resBody.data.userDetail.role === "CUSTOMER" && page === "ADMIN") {
            toast_helper.error("Vui lòng đăng nhập tại website cửa hàng");
            yield put(loginFailed());
        }
        else if(resBody.data.userDetail.role === "CUSTOMER" && page === "CUSTOMER") {
            // toast_helper.success("Đăng nhập thành công!" );
            yield put(loginSuccess(resBody));
            getCart();
        }
        else {
            toast_helper.error("Vui lòng đăng nhập tại website quản trị");
            yield put(loginFailed());
        }
    }
    catch(error){
        const {data: resBody} = error.response;
        yield put(loginFailed(resBody.message));
        toast_helper.error(resBody.message);
    }
}

function* logoutFetch(action){
    try {
        yield call(logout);
        yield put(logoutSuccess());
        const {navigate, page, hide, deleteCart} = action.payload;
        console.log(hide)
        if(page === "ADMIN") navigate("/admin/login");
        else {
            navigate("/")
            deleteCart();
        };
        hide()
    }
    catch(error){
        const {data: resBody} = error.response;
        yield put(logoutFailed(resBody.message));
    }
}

function* registerFetch(action){
    try {
        const {registerData, setPageLogIn} = action.payload;
        yield call(register,registerData);
        yield put(registerSuccess());
        setPageLogIn();
        toast_helper.success("Đăng ký thành công!");
    }
    catch(error){
        yield put(registerFailed());
        toast_helper.error("Đăng ký không thành công vui lòng thử lại sau!");
    }

}

function* updateProfileEmployeeFetch(action) {
    try{
        const {formData, onSuccess} = action.payload;
        const {data: resBody} = yield call(updateProfileEmployee, formData);
        yield put(updateProfileEmployeeSuccess(resBody));
        Toast.success("Cập nhật thông tin cá nhân thành công");
        onSuccess();
    }
    catch(error){
        Toast.error("Cập nhật thông tin cá nhân không thành công");
    }
}

function* authSaga() {
    yield takeEvery(loginStart.toString(), loginFetch);
    yield takeEvery(logoutStart.toString(), logoutFetch);
    yield takeEvery(registerStart.toString(), registerFetch);
    yield takeEvery(updateProfileEmplyeeStart.toString(), updateProfileEmployeeFetch);
}

export default authSaga;
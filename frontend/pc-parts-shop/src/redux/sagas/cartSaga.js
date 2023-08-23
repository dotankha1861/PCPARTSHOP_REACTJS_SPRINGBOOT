import { call, put, take, takeEvery, takeLatest } from "redux-saga/effects";
import { addToCartStart, addToCartSuccess, deleteCartStart, deleteCartSuccess, getAllCartItemStart, getAllCartItemSuccess, refreshCartStart, resetCart, updateCartStart, updateCartSuccess } from "../slices/cartSlice";
import { addToCart, deleteFromCart, getAllCartItem, refreshCart, updateCartItem } from "../apis/cartApi";
import Toast from "../../utils/toast_helper";


function* addToCartFetch(action){
    try{
        const {data: resBody} = yield call(addToCart, action.payload);
        yield put(addToCartSuccess(resBody.data));
        Toast.success("Đã thêm sản phẩm vào giỏ hàng");
    }
    catch(error){
        Toast.error("Không thể thêm sản phẩm vào giỏ hàng")
    }
}

function* deleteFromCartFetch(action){
    try{
        const {skuCode, setData} = action.payload;
        yield call(deleteFromCart, skuCode);
        yield put(deleteCartSuccess({skuCode}));
        setData();
        // Toast.success("Xóa sản phẩm khỏi giỏ hàng thành công");
    }
    catch(error){
        Toast.error("Xóa sản phẩm khỏi giỏ hàng thất bại");
    }
}

function* getAllCartItemFetch() {
    try{
        const {data: resBody} = yield call(getAllCartItem);
        console.log("cartsitem : " + resBody.data);
        yield put(getAllCartItemSuccess(resBody));
    }
    catch(error){
        Toast.error("Lỗi không thể tải giỏ hàng");
    }
}

function* updateCartFetch(action){
    const {skuCode, quantity, isAdd} = action.payload;
    try{
        const {data: resBody} = yield call(updateCartItem,{skuCode, quantity});
        yield put(updateCartSuccess(resBody.data));
        if(isAdd) Toast.success("Đã thêm sản phẩm vào giỏ hàng");
    }
    catch(error){
        Toast.error("Không thể cập nhật giỏ hàng" + error)
    }
}

function* refreshCartFetch(action) {
    try {
        yield call(refreshCart);
        yield put(resetCart());
    }
    catch (error){
        ///
    }
}
function* cartSaga(){
    yield takeEvery(addToCartStart.toString(), addToCartFetch);
    yield takeEvery(deleteCartStart.toString(), deleteFromCartFetch);
    yield takeEvery(getAllCartItemStart.toString(), getAllCartItemFetch);
    yield takeEvery(updateCartStart.toString(), updateCartFetch);
    yield takeEvery(refreshCartStart.toString(), refreshCartFetch);
}

export default cartSaga;
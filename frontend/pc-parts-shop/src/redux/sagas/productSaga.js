import { call, put, takeEvery } from "redux-saga/effects";
import { createCategoryStart, createCategorySuccess, deleteCategoryStart, deleteCategorySuccess, getAllCategoryStart, getAllCategorySuccess, updateCategoryStart, updateCategorySuccess } from "../slices/categorySlice";
import { createCategory, deleteCategory, getAllCategory, updateCategory } from "../apis/categoryApi";
import Toast from "../../utils/toast_helper";
import { createProduct, deleteProduct, getAllProduct, updateProduct } from "../apis/productApi";
import { createProductStart, createProductSuccess, deleteProductStart, deleteProductSuccess, getAllProductStart, getAllProductSuccess, updateProductStart, updateProductSuccess } from "../slices/productSlice";

function* getAllProductFetch(action) {
    try {
        const { data: resBody } = yield call(getAllProduct);
        yield put(getAllProductSuccess(resBody));
        if (action.payload.action === "reset") Toast.success("Dữ liệu đã được cập nhật mới")
    }
    catch (error) {
        // Toast.error("Lỗi lấy dữ liệu không thành công")
    }
}

function* createCategoryFetch(action) {
    try {
        const { data, hide } = action.payload;
        console.log("test" + data);
        const { data: resBody } = yield call(createCategory, data);
        yield put(createCategorySuccess(resBody));
        hide();
        Toast.success("Tạo thành công danh mục #" + resBody.data.id);
    }
    catch (error) {
        console.log(error);
        const { data: resBody } = error.response;

        Toast.error(error);
    }
}

function* deleteCategoryFetch(action) {
    try {
        const { category, hide } = action.payload;
        yield call(deleteCategory, category.id);
        yield put(deleteCategorySuccess(category.id));
        hide();
        Toast.success("Xóa thành công danh mục #" + category.id + " - " + category.name)
    }
    catch (error) {
        Toast.error("Lỗi không thể xóa danh mục");
    }
}

function* updateFetch(action) {
    try {
        const { id, data, hide } = action.payload;
        const { data: resBody } = yield call(updateCategory, {id, data});
        yield put(updateCategorySuccess(resBody));
        hide();
        Toast.success("Cập nhật thành công danh mục #" + resBody.data.id);
    }
    catch (error) {
        console.log(error);
        const { data: resBody } = error.response;
        Toast.error(error);
    }

}

function* createProductFetch(action){
            const {formData, hide } = action.payload;
    try {
        const {data: resBody} = yield call(createProduct, formData);
        yield put(createProductSuccess(resBody));
        hide();
        Toast.success("Tạo thành công sản phẩm #" + resBody.data.skuCode);
    }
    catch (error){
        const {data: resBody} = error.response;
        hide();
        Toast.error(resBody.message);
    }
}

function* deleteProductFetch(action) {
    const {product, hide} = action.payload;
    try {
        yield call(deleteProduct, product.id);
        yield put(deleteProductSuccess(product.id));
        hide();
        Toast.success("Xóa thành công sản phẩm #" + product.skuCode)
    }
    catch (error){
        const {data: resBody} = error.response;
        hide();
        Toast.error("Sản phẩm đã đưa vào kinh doanh không thể xóa");
    }
}
function* updateProductFetch(action) {
    try {
        const {productId, data, hide} = action.payload;
        const {data: resBody} = yield call(updateProduct, {productId, data})
        yield put(updateProductSuccess(resBody));
        hide();
        Toast.success("Cập nhật thông tin sản phẩm thành công");
    }
    catch (error){
        const {data: resBody} = error.response;
        Toast.error(resBody.message);
    }
}
function* productSaga() {
    yield takeEvery(getAllProductStart.toString(), getAllProductFetch);
    yield takeEvery(createProductStart.toString(), createProductFetch);
    yield takeEvery(deleteProductStart.toString(), deleteProductFetch);
    yield takeEvery(updateProductStart.toString(), updateProductFetch);
}
export default productSaga;
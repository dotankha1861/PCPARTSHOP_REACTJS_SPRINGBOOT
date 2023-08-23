import { call, put, takeEvery } from "redux-saga/effects";
import { createCategoryStart, createCategorySuccess, deleteCategoryStart, deleteCategorySuccess, getAllCategoryStart, getAllCategorySuccess, updateCategoryStart, updateCategorySuccess } from "../slices/categorySlice";
import { createCategory, deleteCategory, getAllCategory, updateCategory } from "../apis/categoryApi";
import Toast from "../../utils/toast_helper";

function* getAllCategoryFetch(action) {
    try {
        const { data: resBody } = yield call(getAllCategory);
        yield put(getAllCategorySuccess(resBody));
        if (action.payload.action === "reset") Toast.success("Dữ liệu đã được cập nhật mới")
    }
    catch (error) {
        // Toast.error("Lỗi lấy dữ liệu không thành công")
    }
}

function* createCategoryFetch(action) {
    const { data, hide } = action.payload;
    try {
        console.log("test" + data);
        const { data: resBody } = yield call(createCategory, data);
        yield put(createCategorySuccess(resBody));
        hide();
        Toast.success("Tạo thành công danh mục #" + resBody.data.id);
    }
    catch (error) {
        const {data: resBody} = error.response;
        hide();
        Toast.error(resBody.message);
    }
}

function* deleteCategoryFetch(action) {
    const { category, hide } = action.payload;
    try {
        yield call(deleteCategory, category.id);
        yield put(deleteCategorySuccess(category.id));
        hide();
        Toast.success("Xóa thành công danh mục #" + category.id + " - " + category.name)
    }
    catch (error) {
        const {data: resBody} = error.response;
        hide();
        Toast.error("Danh mục đã đưa vào kinh doanh không thể xóa");
    }
}

function* updateCategoryFetch(action) {
    try {
        const { id, data, hide } = action.payload;
        const { data: resBody } = yield call(updateCategory, {id, data});
        yield put(updateCategorySuccess(resBody));
        hide();
        Toast.success("Cập nhật thành công danh mục #" + resBody.data.id);
    }
    catch (error) {
        const { data: resBody } = error.response;
        Toast.error(resBody.message);
    }

}

function* categorySaga() {
    yield takeEvery(getAllCategoryStart.toString(), getAllCategoryFetch);
    yield takeEvery(createCategoryStart.toString(), createCategoryFetch);
    yield takeEvery(deleteCategoryStart.toString(), deleteCategoryFetch);
    yield takeEvery(updateCategoryStart.toString(), updateCategoryFetch);
}
export default categorySaga;
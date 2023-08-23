import authSaga from "./authSaga";
import {all} from "redux-saga/effects"
import employeeSaga from "./employeeSaga";
import categorySaga from "./categorySaga";
import promotionSaga from "./promotionSaga";
import customerSaga from "./customerSaga";
import productSaga from "./productSaga";
import orderSaga from "./orderSaga";
import cartSaga from "./cartSaga";
import siSheetSaga from "./siSheetSaga";

export function* rootSaga() {
    yield all([
        authSaga(),
        employeeSaga(),
        categorySaga(),
        promotionSaga(),
        customerSaga(),
        productSaga(),
        orderSaga(),
        cartSaga(),
        siSheetSaga(),
    ])
}
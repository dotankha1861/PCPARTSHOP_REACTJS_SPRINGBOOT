import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from "./sagas";
import {persistStore,persistReducer} from 'redux-persist';
import storage from "redux-persist/lib/storage";
import employeeReducer from "./slices/employeeSlice";
import categoryReducer from "./slices/categorySlice"
import promotionReduder from "./slices/promotionSlice";
import customerReducer from "./slices/customerSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import siSheetReducer from "./slices/stockInventorySheetSlice";

const persistConfigAuth = {
    key: "auth",
    version: 1,
    storage,
}
const persistConfigCart = {
    key: "cart",
    version: 1,
    storage,
}

const persistAuthReducer = persistReducer(persistConfigAuth, authReducer);
const persistCartReducer = persistReducer(persistConfigCart, cartReducer);

const saga = createSagaMiddleware();
const store = configureStore({
    reducer: {
        auth: persistAuthReducer,
        employees: employeeReducer,
        categories: categoryReducer,
        promotions: promotionReduder,
        customers: customerReducer,
        products: productReducer,
        cart: persistCartReducer,
        orders: orderReducer,
        siSheets: siSheetReducer,
    },
    middleware: [saga]
});

saga.run(rootSaga);

const persistor = persistStore(store);

export {store, persistor};
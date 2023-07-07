import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import createSagaMiddleware from 'redux-saga';
import authSaga from "./sagas/authSaga";

const saga = createSagaMiddleware();
export default configureStore({
    reducer:{
        auth: authReducer,
    },
    middleware: [saga]
});
saga.run(authSaga);
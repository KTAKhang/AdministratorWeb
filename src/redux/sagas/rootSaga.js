import { all } from "redux-saga/effects";
import authSaga from "./authSaga";
import categorySaga from "./categorySaga";
import orderSaga from "./orderSaga";
import profileSaga from "./profileSaga";
import productSaga from "./productSaga";
import reviewSaga from "./reviewSaga";
import userSaga from "./userSaga";
import dashboardSaga from "./dashboardSaga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    categorySaga(),
    orderSaga(),
    profileSaga(),
    productSaga(),
    reviewSaga(),
    userSaga(),
    dashboardSaga(),
  ]);
}

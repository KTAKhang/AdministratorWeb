import { all } from "redux-saga/effects";
import authSaga from "./authSaga";
import categorySaga from "./categorySaga";
import productSaga from "./productSaga";
import reviewSaga from "./reviewSaga";
import userSaga from "./userSaga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    categorySaga(),
    productSaga(),
    reviewSaga(),
    userSaga(),
  ]);
}

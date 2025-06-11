import { all } from "redux-saga/effects";
import authSaga from "./authSaga";
import categorySaga from "./categorySaga";
import orderSaga from "./orderSaga";
import profileSaga from "./profileSaga";
export default function* rootSaga() {
  yield all([
    authSaga(),
    categorySaga(),
    orderSaga(),
    profileSaga()
  ]);
}

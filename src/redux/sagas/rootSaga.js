import { all } from "redux-saga/effects";
import authSaga from "./authSaga";
import categorySaga from "./categorySaga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    categorySaga(),
  ]);
}

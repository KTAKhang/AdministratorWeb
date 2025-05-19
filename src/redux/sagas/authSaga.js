// import { all, call, put, takeLatest } from "redux-saga/effects";
// import { toast } from "react-toastify";
// import {
//   LOGIN_REQUEST,
//   loginSuccess,
//   loginFailure,
//   LOGOUT,
// } from "../actions/authActions";
// import axios from "axios";

// const apiLogin = async (credentials) => {
//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_API_URL}user/sign-in`,
//       credentials
//     );
//     return response;
//   } catch (error) {
//     return Promise.reject(error.response?.data?.message || "Failed to login");
//   }
// };

// function* handleLogin(action) {
//   try {
//     const { email, password } = action.payload;
//     const { data } = yield call(apiLogin, { email, password });
//     const token = data.token.access_token;
//     const role = data.data.isAdmin;
//     localStorage.setItem("token", token);
//     localStorage.setItem("role", role);
//     yield put(loginSuccess(data));
//     toast.success("Login successful");
//   } catch (error) {
//     yield put(loginFailure(error));
//     toast.error(error);
//   }
// }

// function* handleLogout() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("role");
//   yield put(loginSuccess(null));
// }

// export default function* authSaga() {
//   yield all([takeLatest(LOGIN_REQUEST, handleLogin)]);
//   yield all([takeLatest(LOGOUT, handleLogout)]);
// }

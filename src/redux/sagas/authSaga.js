// sagas/authSaga.js
import { all, call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import {
    LOGIN_REQUEST,
    loginSuccess,
    loginFailure,
    LOGOUT,
} from "../actions/authActions";
import axios from "axios";

const apiLogin = async (credentials) => {
    try {
        const response = await axios.post(
            `https://youtube-fullstack-nodejs-forbeginer.onrender.com/api/user/sign-in`,
            credentials,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to login");
    }
};

function* handleLogin(action) {
    try {
        const { email, password } = action.payload;
        const data = yield call(apiLogin, { email, password });

        // Store in localStorage
        localStorage.setItem("token", data.token.access_token);
        localStorage.setItem("role", data.data.role_name);
        localStorage.setItem("user", JSON.stringify(data.data));

        yield put(loginSuccess(data));
        toast.success(data.message || "Login successful");
    } catch (error) {
        yield put(loginFailure(error.message));
        toast.error(error.message);
    }
}

function* handleLogout() {
    try {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        toast.success("Logged out successfully");
    } catch (error) {
        console.error("Logout error:", error);
    }
}

export default function* authSaga() {
    yield all([
        takeLatest(LOGIN_REQUEST, handleLogin),
        takeLatest(LOGOUT, handleLogout),
    ]);
}

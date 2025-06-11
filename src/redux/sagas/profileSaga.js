// sagas/userSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
    FETCH_USER_REQUEST,
    fetchUserSuccess,
    fetchUserFailure,
    UPDATE_USER_REQUEST,
    updateUserSuccess,
    updateUserFailure,
} from "../actions/profileActions";

const API_BASE_URL = "https://youtube-fullstack-nodejs-forbeginer.onrender.com/api";

// API function for fetching user profile
const fetchUser = async ({ userId }) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
        `${API_BASE_URL}/user/${userId}`,
        {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    console.log("Fetched user data saga:", response.data);
    return response.data;
};

// API function for updating user profile
const updateUser = async ({ userId, user_name, avatar }) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    // Only append fields that are provided and not empty
    if (user_name !== undefined && user_name !== '') {
        formData.append('user_name', user_name);
    }
    if (avatar !== undefined && avatar !== '') {
        formData.append('avatar', avatar);
    }

    const response = await axios.put(
        `${API_BASE_URL}/user/update-user/${userId}`,
        formData,
        {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
};

function* handleFetchUser(action) {
    try {
        const { userId } = action.payload;
        console.log("Fetching user with ID:", userId);
        const data = yield call(fetchUser, { userId });
        yield put(fetchUserSuccess(data));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(fetchUserFailure(errorMessage));
    }
}

function* handleUpdateUser(action) {
    try {
        const { userId, user_name, avatar } = action.payload;
        const data = yield call(updateUser, {
            userId,
            user_name,
            avatar
        });
        yield put(updateUserSuccess(data));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(updateUserFailure(errorMessage));
    }
}

export default function* userSaga() {
    yield takeLatest(FETCH_USER_REQUEST, handleFetchUser);
    yield takeLatest(UPDATE_USER_REQUEST, handleUpdateUser);
}
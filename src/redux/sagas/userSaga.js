// sagas/userSaga.js
import { all, call, put, takeLatest, select } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import {
    GET_ALL_USERS_REQUEST,
    GET_USER_BY_ID_REQUEST,
    UPDATE_USER_REQUEST,
    getAllUsersSuccess,
    getAllUsersFailure,
    getUserByIdSuccess,
    getUserByIdFailure,
    updateUserSuccess,
    updateUserFailure,
} from "../actions/userActions";

const API_BASE_URL = 'https://youtube-fullstack-nodejs-forbeginer.onrender.com/api';

// Helper function to get auth token
const getAuthToken = () => {
    // Sử dụng token mới từ CURL example
    return localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI3MjA5ODhhNjc5ZmM2YTkyYjAwNjgiLCJpc0FkbWluIjp0cnVlLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDk2NTA0MTYsImV4cCI6MTc1MjI0MjQxNn0.-CMYI5E9HUjKrjTRtd34eBldb_TXYLQVCMvAb7RkT8o';
};

// Helper function to create headers
const createHeaders = (isFormData = false) => {
    const headers = {
        'accept': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
    };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
};

// API call to get all users with search support
const apiGetAllUsers = async (page = 1, limit = 10, search = "") => {
    try {
        // Build URL với search parameter
        let url = `${API_BASE_URL}/user/get-all?page=${page}&limit=${limit}`;

        // Thêm search parameter nếu có
        if (search && search.trim() !== "") {
            url += `&search=${encodeURIComponent(search.trim())}`;
        }

        console.log('🔍 API URL:', url); // Debug log

        const response = await axios.get(url, {
            headers: createHeaders()
        });

        console.log('✅ API Response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('❌ API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
};

// API call to get user by ID
const apiGetUserById = async (userId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/user/${userId}`,
            {
                headers: createHeaders()
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch user details");
    }
};

// API call to update user
const apiUpdateUser = async (userId, userData) => {
    try {
        console.log('🔍 Original userData:', userData); // Debug log

        // Create FormData for multipart/form-data
        const formData = new FormData();

        // Append all fields to FormData - xử lý giống categorySaga
        Object.keys(userData).forEach(key => {
            if (key === 'avatar' && userData[key] instanceof File) {
                formData.append(key, userData[key]);
            } else if (key === 'password') {
                // Password luôn được gửi, có thể rỗng như trong CURL example
                const passwordValue = userData[key] || '';
                formData.append(key, passwordValue);
                console.log(`🔍 Password processing: "${userData[key]}" -> "${passwordValue}"`); // Debug log
            } else if (userData[key] !== undefined && userData[key] !== null) {
                // Gửi trực tiếp như categorySaga, không convert string
                formData.append(key, userData[key]);
                console.log(`🔍 Added to FormData: ${key} = ${userData[key]} (type: ${typeof userData[key]})`); // Debug log
            }
        });

        // Debug: Log FormData contents
        console.log('🔍 FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}: ${value} (type: ${typeof value})`);
        }

        const response = await axios.put(
            `${API_BASE_URL}/user/update-user/${userId}`,
            formData,
            {
                headers: createHeaders(true) // Use FormData headers
            }
        );

        console.log('✅ API Response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('❌ API Update User Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update user");
    }
};

// Helper function to format user data
const formatUserForDisplay = (user) => ({
    _id: user._id,
    user_name: user.user_name,
    email: user.email,
    avatar: user.avatar,
    role_name: user.role_name,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
});

// Saga to handle get all users with search support
function* handleGetAllUsers(action) {
    try {
        const { page = 1, limit = 10, search = "" } = action.payload;
        console.log('🔍 Saga params:', { page, limit, search }); // Debug log

        const response = yield call(apiGetAllUsers, page, limit, search);

        if (response.status === 'OK') {
            // Format users data from new API structure
            const formattedUsers = response.data.user.map(user => formatUserForDisplay(user));

            // Handle new API response structure
            const processedData = {
                status: response.status,
                message: response.message,
                data: {
                    users: formattedUsers,
                    total: {
                        currentPage: response.data.total?.currentPage || page,
                        totalUser: response.data.total?.totalUser || 0,
                        totalPage: response.data.total?.totalPage || 1,
                        totalActive: response.data.total?.totalActive || 0,
                        totalInactive: response.data.total?.totalInactive || 0,
                    }
                },
                pagination: {
                    page: response.pagination?.page || page,
                    limit: response.pagination?.limit || limit,
                    totalPages: response.data.total?.totalPage || response.pagination?.totalPages || 1,
                }
            };

            yield put(getAllUsersSuccess(processedData));

            // Log success cho search
            if (search && search.trim() !== "") {
                console.log(`✅ Search completed for: "${search}" - Found ${formattedUsers.length} results`);
            }
        } else {
            throw new Error(response.message || 'Failed to fetch users');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        const errorMessage = error.response?.data?.message || error.message;
        yield put(getAllUsersFailure(errorMessage));
        toast.error('Có lỗi xảy ra khi tải dữ liệu: ' + errorMessage);
    }
}

// Saga to handle get user by ID
function* handleGetUserById(action) {
    try {
        const userId = action.payload;
        const data = yield call(apiGetUserById, userId);

        if (data.status === 'OK') {
            const formattedUser = formatUserForDisplay(data.data);
            yield put(getUserByIdSuccess(formattedUser));
        } else {
            throw new Error(data.message || 'Failed to fetch user details');
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        yield put(getUserByIdFailure(error.message));
        toast.error('Có lỗi xảy ra khi tải thông tin chi tiết: ' + error.message);
    }
}

// Saga to handle update user
function* handleUpdateUser(action) {
    try {
        const { userId, userData } = action.payload;
        const data = yield call(apiUpdateUser, userId, userData);

        if (data.status === 'OK') {
            const formattedUser = formatUserForDisplay(data.data);
            yield put(updateUserSuccess(formattedUser));
            // Toast success handled in component to avoid duplicates
        } else {
            throw new Error(data.message || 'Failed to update user');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        // yield put(updateUserFailure(error.message));
        // toast.error('Có lỗi xảy ra khi cập nhật: ' + error.message);
    }
}

// Root saga for user
export default function* userSaga() {
    yield all([
        takeLatest(GET_ALL_USERS_REQUEST, handleGetAllUsers),
        takeLatest(GET_USER_BY_ID_REQUEST, handleGetUserById),
        takeLatest(UPDATE_USER_REQUEST, handleUpdateUser),
    ]);
} 
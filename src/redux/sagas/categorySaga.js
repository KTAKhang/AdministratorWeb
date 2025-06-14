// sagas/categorySaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
    FETCH_CATEGORY_REQUEST,
    fetchCategorySuccess,
    fetchCategoryFailure,
    CREATE_CATEGORY_REQUEST,
    createCategorySuccess,
    createCategoryFailure,
    UPDATE_CATEGORY_REQUEST,
    updateCategorySuccess,
    updateCategoryFailure,
    DELETE_CATEGORY_REQUEST,
    deleteCategorySuccess,
    deleteCategoryFailure,
} from "../actions/categoryActions";

const API_BASE_URL = "https://youtube-fullstack-nodejs-forbeginer.onrender.com/api";

// API function for fetching categories with new response structure
const fetchCategories = async ({ page, limit }) => {
    const response = await axios.get(
        `${API_BASE_URL}/category?page=${page}&limit=${limit}`,
        {
            headers: {
                accept: "*/*",
            },
        }
    );
    return response.data;
};

// API function for creating category
const createCategory = async ({ name, image, token, status }) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    if (status !== undefined) {
        formData.append('status', status);
    }

    const response = await axios.post(
        `${API_BASE_URL}/category/create`,
        formData,
        {
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
};

// API function for updating category
const updateCategory = async ({ id, name, image, status, token }) => {
    const formData = new FormData();

    // Only append fields that are provided
    if (name !== undefined && name !== '') {
        formData.append('name', name);
    }
    if (image !== undefined && image !== '') {
        formData.append('image', image);
    }
    if (status !== undefined) {
        formData.append('status', status);
    }

    const response = await axios.put(
        `${API_BASE_URL}/category/update/${id}`,
        formData,
        {
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
};

// API function for deleting category
const deleteCategory = async ({ id, token }) => {
    const response = await axios.delete(
        `${API_BASE_URL}/category/delete/${id}`,
        {
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

function* handleFetchCategories(action) {
    try {
        const { page = 1, limit = 12 } = action.payload;
        const response = yield call(fetchCategories, { page, limit });

        // Handle new API response structure
        const processedData = {
            status: response.status,
            message: response.message,
            data: {
                categories: response.data.categories || [],
                total: {
                    currentPage: response.data.total?.currentPage || page,
                    totalCategory: response.data.total?.totalCategory || 0,
                    totalPage: response.data.total?.totalPage || 1,
                    totalActive: response.data.total?.totalActive || 0,
                    totalInactive: response.data.total?.totalInactive || 0,
                }
            },
            pagination: {
                page: response.pagination?.page || page,
                limit: response.pagination?.limit || limit,
                totalPages: response.data.total?.totalPage || 1,
            }
        };

        yield put(fetchCategorySuccess(processedData));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(fetchCategoryFailure(errorMessage));
    }
}

function* handleCreateCategory(action) {
    try {
        const { name, image, token, status } = action.payload;
        const data = yield call(createCategory, { name, image, token, status });
        yield put(createCategorySuccess(data));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(createCategoryFailure(errorMessage));
    }
}

function* handleUpdateCategory(action) {
    try {
        const { id, name, image, status, token } = action.payload;
        const data = yield call(updateCategory, { id, name, image, status, token });
        yield put(updateCategorySuccess(data));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(updateCategoryFailure(errorMessage));
    }
}

function* handleDeleteCategory(action) {
    try {
        const { id, token } = action.payload;
        yield call(deleteCategory, { id, token });
        yield put(deleteCategorySuccess(id));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(deleteCategoryFailure(errorMessage));
    }
}

export default function* categorySaga() {
    yield takeLatest(FETCH_CATEGORY_REQUEST, handleFetchCategories);
    yield takeLatest(CREATE_CATEGORY_REQUEST, handleCreateCategory);
    yield takeLatest(UPDATE_CATEGORY_REQUEST, handleUpdateCategory);
    yield takeLatest(DELETE_CATEGORY_REQUEST, handleDeleteCategory);
}

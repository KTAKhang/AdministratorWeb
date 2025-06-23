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
const fetchCategories = async ({ page, limit, search }) => {
    let url = `${API_BASE_URL}/category?page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await axios.get(url, {
        headers: {
            accept: "*/*",
        },
    });
    return response.data;
};

// API function for creating category
const createCategory = async ({ name, image, token }) => {
    console.log('🚀 Creating category with API call:', {
        name,
        imageName: image?.name,
        imageSize: image?.size,
        imageType: image?.type,
        hasToken: !!token
    });

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    // Log FormData contents
    console.log('📦 FormData contents:');
    for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
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

    console.log('✅ API Response:', response.data);
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
        const { page = 1, limit = 12, search } = action.payload;
        const response = yield call(fetchCategories, { page, limit, search });

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
        const { name, image, token } = action.payload;

        // Add validation logging
        console.log('🔧 Category creation payload:', {
            name,
            hasImage: !!image,
            imageName: image?.name,
            imageSize: image?.size,
            imageType: image?.type,
            hasToken: !!token
        });

        if (!name || !image || !token) {
            throw new Error('Missing required fields: name, image, or token');
        }

        const data = yield call(createCategory, { name, image, token });
        console.log('✅ Category created successfully:', data);
        yield put(createCategorySuccess(data));
    } catch (error) {
        console.error('❌ Category creation failed:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        // Extract meaningful error message
        let errorMessage = 'Có lỗi xảy ra khi tạo category';

        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.data.error) {
                errorMessage = error.response.data.error;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }

        // Handle specific error cases
        if (errorMessage.toLowerCase().includes('already exists')) {
            errorMessage = 'Tên category này đã tồn tại. Vui lòng chọn tên khác.';
        } else if (errorMessage.toLowerCase().includes('required')) {
            errorMessage = 'Thiếu thông tin bắt buộc. Vui lòng kiểm tra lại.';
        } else if (errorMessage.toLowerCase().includes('invalid')) {
            errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
        }

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

// sagas/productSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
    FETCH_PRODUCT_REQUEST,
    FETCH_PRODUCT_SUCCESS,
    FETCH_PRODUCT_FAILURE,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,
    CREATE_PRODUCT_FAILURE,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAILURE,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAILURE,
} from "../actions/productActions";

const API_BASE_URL = "https://youtube-fullstack-nodejs-forbeginer.onrender.com/api";

// Helper function to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    };
};

// Fetch products
const fetchProducts = async (params) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/product`, {
        params,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// Create product
const createProduct = async (formData) => {
    const token = localStorage.getItem('token');

    // Debug: Log status value trong formData
    console.log('Status trong formData (create):', formData.get('status'));

    // Ensure all required fields are present
    const requiredFields = ['name', 'category_id', 'price', 'short_desc', 'detail_desc', 'quantity', 'factory', 'target', 'status'];
    for (const field of requiredFields) {
        if (!formData.get(field) && formData.get(field) !== 'false') {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    // Add default value for sold if not present
    if (!formData.get('sold')) {
        formData.append('sold', '0');
    }

    // Status sẽ được xử lý từ form, không cần default value ở đây

    // Debug: Log tất cả formData trước khi gửi
    console.log('All formData before sending (create):');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await axios.post(`${API_BASE_URL}/product/create`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Update product
const updateProduct = async (id, formData) => {
    const token = localStorage.getItem('token');

    // Debug: Log status value trong formData
    console.log('Status trong formData (update):', formData.get('status'));

    // Ensure all required fields are present
    const requiredFields = ['name', 'category_id', 'price', 'short_desc', 'detail_desc', 'quantity', 'factory', 'target', 'status'];
    for (const field of requiredFields) {
        if (!formData.get(field) && formData.get(field) !== 'false') {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    // Add default value for sold if not present
    if (!formData.get('sold')) {
        formData.append('sold', '0');
    }

    // Debug: Log tất cả formData trước khi gửi
    console.log('All formData before sending (update):');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await axios.put(`${API_BASE_URL}/product/update/${id}`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Delete product
const deleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/product/delete/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// Saga handlers
function* handleFetchProducts(action) {
    try {
        const response = yield call(fetchProducts, action.payload);
        yield put({ type: FETCH_PRODUCT_SUCCESS, payload: response });
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put({ type: FETCH_PRODUCT_FAILURE, payload: errorMessage });
    }
}

function* handleCreateProduct(action) {
    try {
        const { formData, onSuccess } = action.payload;
        const response = yield call(createProduct, formData);
        yield put({ type: CREATE_PRODUCT_SUCCESS, payload: response });
        if (onSuccess) {
            onSuccess();
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put({ type: CREATE_PRODUCT_FAILURE, payload: errorMessage });
    }
}

function* handleUpdateProduct(action) {
    try {
        const { id, formData, onSuccess } = action.payload;
        const response = yield call(updateProduct, id, formData);
        yield put({ type: UPDATE_PRODUCT_SUCCESS, payload: response });
        if (onSuccess) {
            onSuccess();
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put({ type: UPDATE_PRODUCT_FAILURE, payload: errorMessage });
    }
}

function* handleDeleteProduct(action) {
    try {
        const { id, onSuccess } = action.payload;
        const response = yield call(deleteProduct, id);
        yield put({ type: DELETE_PRODUCT_SUCCESS, payload: id });
        if (onSuccess) {
            onSuccess();
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put({ type: DELETE_PRODUCT_FAILURE, payload: errorMessage });
    }
}

// Root saga
export default function* productSaga() {
    yield takeLatest(FETCH_PRODUCT_REQUEST, handleFetchProducts);
    yield takeLatest(CREATE_PRODUCT_REQUEST, handleCreateProduct);
    yield takeLatest(UPDATE_PRODUCT_REQUEST, handleUpdateProduct);
    yield takeLatest(DELETE_PRODUCT_REQUEST, handleDeleteProduct);
} 
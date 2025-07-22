// sagas/orderSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
    FETCH_ORDER_REQUEST,
    fetchOrderSuccess,
    fetchOrderFailure,
    UPDATE_ORDER_REQUEST,
    updateOrderSuccess,
    updateOrderFailure,
    FETCH_ORDER_BY_STATUS_REQUEST,
    fetchOrderByStatusSuccess,
    fetchOrderByStatusFailure,
} from "../actions/orderActions";

const API_BASE_URL = "https://youtube-fullstack-nodejs-forbeginer.onrender.com/api";

// API function for fetching orders with search support
const fetchOrders = async ({ page, limit, search }) => {
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI3MjA5ODhhNjc5ZmM2YTkyYjAwNjgiLCJpc0FkbWluIjp0cnVlLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDk5NzM1MTYsImV4cCI6MTc1MjU2NTUxNn0.Bra4_sSiYgGgz4KPvEAcrUlYoWKqZwxNtXRjokKP4ak';

    let url = `${API_BASE_URL}/order?page=${page}&limit=${limit}`;
    if (search && search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
    }

    const response = await axios.get(url, {
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
};

// API function for fetching orders by status
const fetchOrdersByStatus = async ({ status, page, limit, search }) => {
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI3MjA5ODhhNjc5ZmM2YTkyYjAwNjgiLCJpc0FkbWluIjp0cnVlLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDk5NzM1MTYsImV4cCI6MTc1MjU2NTUxNn0.Bra4_sSiYgGgz4KPvEAcrUlYoWKqZwxNtXRjokKP4ak';

    let url = `${API_BASE_URL}/order/status?page=${page}&limit=${limit}`;
    if (status && status.trim()) {
        url += `&status=${status.trim()}`;
    }
    if (search && search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
    }

    const response = await axios.get(url, {
        headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
};

// API function for updating order
const updateOrder = async ({ id, orderData }) => {
    const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI3MjA5ODhhNjc5ZmM2YTkyYjAwNjgiLCJpc0FkbWluIjp0cnVlLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDk5NzM1MTYsImV4cCI6MTc1MjU2NTUxNn0.Bra4_sSiYgGgz4KPvEAcrUlYoWKqZwxNtXRjokKP4ak';

    // Try different request body formats for testing
    const requestBodyVariations = [
        orderData, // Original format: { order_status_id: "id" }
        { status: orderData.order_status_id }, // Alternative: { status: "id" }
        { order_status: orderData.order_status_id }, // Alternative: { order_status: "id" }
        { order_status_id: orderData.order_status_id }, // Explicit format
    ];

    // Debug: Log API request details
    console.log('=== API Update Order Debug ===');
    console.log('URL:', `${API_BASE_URL}/order/update/${id}`);
    console.log('Original Request Body:', orderData);
    console.log('Body Variations to try:', requestBodyVariations);
    console.log('Headers:', {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    });
    console.log('=== End API Debug ===');

    // Use original format first - we can test variations later if needed
    const response = await axios.put(
        `${API_BASE_URL}/order/update/${id}`,
        orderData,
        {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    console.log('=== API Response Debug ===');
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
    console.log('=== End Response Debug ===');

    return response.data;
};

function* handleFetchOrders(action) {
    try {
        const { page, limit, search } = action.payload;
        const data = yield call(fetchOrders, { page, limit, search });
        yield put(fetchOrderSuccess(data));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(fetchOrderFailure(errorMessage));
    }
}

function* handleFetchOrdersByStatus(action) {
    try {
        const { status, page, limit, search } = action.payload;
        const data = yield call(fetchOrdersByStatus, { status, page, limit, search });
        yield put(fetchOrderByStatusSuccess(data));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put(fetchOrderByStatusFailure(errorMessage));
    }
}

function* handleUpdateOrder(action) {
    try {
        const { id, orderData } = action.payload;

        // Debug: Log request data
        console.log('=== Saga Update Order Debug ===');
        console.log('Order ID:', id);
        console.log('Order Data:', orderData);
        console.log('=== End Saga Debug ===');

        const data = yield call(updateOrder, { id, orderData });

        // Check if the response has the expected structure
        if (!data) {
            yield put(updateOrderFailure("Empty response from server"));
            return;
        }

        // If response doesn't have order_id, try to construct it
        let processedData = data;
        if (data.data && !data.data.order_id) {
            // If response.data exists but doesn't have order_id, add it
            processedData = {
                ...data,
                data: {
                    ...data.data,
                    order_id: id, // Use the ID from the request
                    ...orderData // Include the updated data
                }
            };
        } else if (!data.order_id && !data.data) {
            // If response doesn't have order_id at root level or data property
            processedData = {
                data: {
                    order_id: id,
                    ...orderData,
                    ...data // Include any data from response
                }
            };
        }

        yield put(updateOrderSuccess(processedData));

        // Thông báo cho các tab khác về việc cập nhật order
        try {
            localStorage.setItem('orderUpdated', Date.now().toString());
        } catch (error) {
            console.warn("⚠️ Could not notify other tabs:", error);
        }

    } catch (error) {
        // Enhanced error logging
        console.error('=== Update Order Error ===');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Response Data:', error.response?.data);
        console.error('Request Config:', error.config);
        console.error('Full Error:', error);
        console.error('=== End Error Debug ===');

        const errorMessage = error.response?.data?.message || error.response?.statusText || error.message;
        yield put(updateOrderFailure(errorMessage));
    }
}

export default function* orderSaga() {
    yield takeLatest(FETCH_ORDER_REQUEST, handleFetchOrders);
    yield takeLatest(UPDATE_ORDER_REQUEST, handleUpdateOrder);
    yield takeLatest(FETCH_ORDER_BY_STATUS_REQUEST, handleFetchOrdersByStatus);
}
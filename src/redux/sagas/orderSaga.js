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
} from "../actions/orderActions";

const API_BASE_URL = "https://youtube-fullstack-nodejs-forbeginer.onrender.com/api";

// API function for fetching orders
const fetchOrders = async ({ page, limit }) => {
    const token = localStorage.getItem('token');

    console.log("Fetching orders with token:", token);
    const response = await axios.get(
        `${API_BASE_URL}/order?page=${page}&limit=${limit}`,
        {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

// API function for updating order
const updateOrder = async ({ id, orderData }) => {
    const token = localStorage.getItem('token');

    console.log("🚀 Sending update request:", { id, orderData });
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

    console.log("📥 Update API Response:", response.data);
    return response.data;
};

function* handleFetchOrders(action) {
    try {
        const { page, limit } = action.payload;
        const data = yield call(fetchOrders, { page, limit });
        yield put(fetchOrderSuccess(data));
    } catch (error) {
        console.error("❌ Fetch orders error:", error);
        const errorMessage = error.response?.data?.message || error.message;
        yield put(fetchOrderFailure(errorMessage));
    }
}

function* handleUpdateOrder(action) {
    try {
        const { id, orderData } = action.payload;
        console.log("🔄 Handling update order:", { id, orderData });

        const data = yield call(updateOrder, { id, orderData });

        console.log("✅ Update successful, response data:", data);

        // Check if the response has the expected structure
        if (!data) {
            console.warn("⚠️ Empty response from update API");
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

        console.log("📦 Processed data for reducer:", processedData);
        yield put(updateOrderSuccess(processedData));

    } catch (error) {
        console.error("❌ Update order error:", error);
        const errorMessage = error.response?.data?.message || error.message;
        yield put(updateOrderFailure(errorMessage));
    }
}

export default function* orderSaga() {
    yield takeLatest(FETCH_ORDER_REQUEST, handleFetchOrders);
    yield takeLatest(UPDATE_ORDER_REQUEST, handleUpdateOrder);
}
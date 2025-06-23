// sagas/dashboardSaga.js
import { all, call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import axios from "axios";
import {
    GET_DASHBOARD_OVERVIEW_REQUEST,
    GET_REVENUE_BY_MONTH_REQUEST,
    GET_REVENUE_BY_DATE_REQUEST,
    GET_NEW_CUSTOMERS_REQUEST,
    GET_SALES_BY_DATE_REQUEST,
    GET_TOP_PRODUCTS_REQUEST,
    GET_COMPLETE_DASHBOARD_REQUEST,
    GET_TOP_PRODUCTS_BY_CATEGORY_REQUEST,
    getDashboardOverviewSuccess,
    getDashboardOverviewFailure,
    getRevenueByMonthSuccess,
    getRevenueByMonthFailure,
    getRevenueByDateSuccess,
    getRevenueByDateFailure,
    getNewCustomersSuccess,
    getNewCustomersFailure,
    getSalesByDateSuccess,
    getSalesByDateFailure,
    getTopProductsSuccess,
    getTopProductsFailure,
    getCompleteDashboardSuccess,
    getCompleteDashboardFailure,
    getTopProductsByCategorySuccess,
    getTopProductsByCategoryFailure,
} from "../actions/dashboardActions";

const API_BASE_URL = 'https://youtube-fullstack-nodejs-forbeginer.onrender.com/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI3MjA5ODhhNjc5ZmM2YTkyYjAwNjgiLCJpc0FkbWluIjp0cnVlLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDk5NjQ5MjksImV4cCI6MTc1MjU1NjkyOX0.U_20zXFaHFgtugesegWzAWT2s_bmdPKGzHmmjDCURIs';
};

// Helper function to create headers
const createHeaders = () => ({
    'accept': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json',
});

// API Functions
const apiGetDashboardOverview = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/dashboard/overview`,
            { headers: createHeaders() }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch dashboard overview");
    }
};

const apiGetRevenueByMonth = async (year) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/dashboard/revenue-by-month?year=${year}`,
            { headers: createHeaders() }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch revenue by month");
    }
};

const apiGetRevenueByDate = async (startDate, endDate) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/dashboard/revenue-by-date?startDate=${startDate}&endDate=${endDate}`,
            { headers: createHeaders() }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch revenue by date");
    }
};

const apiGetNewCustomers = async (startDate, endDate) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/dashboard/new-customers-by-date?startDate=${startDate}&endDate=${endDate}`,
            { headers: createHeaders() }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch new customers");
    }
};

const apiGetSalesByDate = async (startDate, endDate) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/dashboard/sales-by-date?startDate=${startDate}&endDate=${endDate}`,
            { headers: createHeaders() }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch sales by date");
    }
};

const apiGetTopProducts = async (limit = 3) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/dashboard/top-selling-products?limit=${limit}`,
            { headers: createHeaders() }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch top products");
    }
};

const apiGetCompleteDashboard = async (startDate, endDate) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/dashboard/complete-dashboard?startDate=${startDate}&endDate=${endDate}`,
            { headers: createHeaders() }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch complete dashboard");
    }
};

const apiGetTopProductsByCategory = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/dashboard/top-products-by-category`,
            { headers: createHeaders() }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch top products by category");
    }
};

// Saga Functions
function* handleGetDashboardOverview() {
    try {
        const response = yield call(apiGetDashboardOverview);

        if (response.status === 'OK') {
            yield put(getDashboardOverviewSuccess(response.data));
        } else {
            throw new Error(response.message || 'Failed to fetch dashboard overview');
        }
    } catch (error) {
        console.error('Error fetching dashboard overview:', error);
        yield put(getDashboardOverviewFailure(error.message));
        toast.error('Có lỗi xảy ra khi tải dữ liệu tổng quan: ' + error.message);
    }
}

function* handleGetRevenueByMonth(action) {
    try {
        const { year } = action.payload;
        const response = yield call(apiGetRevenueByMonth, year);

        if (response.status === 'OK') {
            yield put(getRevenueByMonthSuccess(response.data));
        } else {
            throw new Error(response.message || 'Failed to fetch revenue by month');
        }
    } catch (error) {
        console.error('Error fetching revenue by month:', error);
        yield put(getRevenueByMonthFailure(error.message));
        toast.error('Có lỗi xảy ra khi tải doanh thu theo tháng: ' + error.message);
    }
}

function* handleGetRevenueByDate(action) {
    try {
        const { startDate, endDate } = action.payload;
        const response = yield call(apiGetRevenueByDate, startDate, endDate);

        if (response.status === 'OK') {
            yield put(getRevenueByDateSuccess(response.data));
        } else {
            throw new Error(response.message || 'Failed to fetch revenue by date');
        }
    } catch (error) {
        console.error('Error fetching revenue by date:', error);
        yield put(getRevenueByDateFailure(error.message));
        toast.error('Có lỗi xảy ra khi tải doanh thu theo ngày: ' + error.message);
    }
}

function* handleGetNewCustomers(action) {
    try {
        const { startDate, endDate } = action.payload;
        const response = yield call(apiGetNewCustomers, startDate, endDate);

        if (response.status === 'OK') {
            console.log('🔍 New Customers API Response:', response.data);
            yield put(getNewCustomersSuccess(response.data));
        } else {
            throw new Error(response.message || 'Failed to fetch new customers');
        }
    } catch (error) {
        console.error('Error fetching new customers:', error);
        yield put(getNewCustomersFailure(error.message));
        toast.error('Có lỗi xảy ra khi tải khách hàng mới: ' + error.message);
    }
}

function* handleGetSalesByDate(action) {
    try {
        const { startDate, endDate } = action.payload;
        const response = yield call(apiGetSalesByDate, startDate, endDate);

        if (response.status === 'OK') {
            console.log('🔍 Sales By Date API Response:', response.data);
            yield put(getSalesByDateSuccess(response.data));
        } else {
            throw new Error(response.message || 'Failed to fetch sales by date');
        }
    } catch (error) {
        console.error('Error fetching sales by date:', error);
        yield put(getSalesByDateFailure(error.message));
        toast.error('Có lỗi xảy ra khi tải doanh số theo ngày: ' + error.message);
    }
}

function* handleGetTopProducts(action) {
    try {
        const { limit } = action.payload;
        const response = yield call(apiGetTopProducts, limit);

        if (response.status === 'OK') {
            yield put(getTopProductsSuccess(response.data));
        } else {
            throw new Error(response.message || 'Failed to fetch top products');
        }
    } catch (error) {
        console.error('Error fetching top products:', error);
        yield put(getTopProductsFailure(error.message));
        toast.error('Có lỗi xảy ra khi tải sản phẩm bán chạy: ' + error.message);
    }
}

function* handleGetCompleteDashboard(action) {
    try {
        const { startDate, endDate } = action.payload;
        const response = yield call(apiGetCompleteDashboard, startDate, endDate);

        if (response.status === 'OK') {
            console.log('🔍 Complete Dashboard API Response:', JSON.stringify(response.data, null, 2));
            console.log('📊 Sales By Date:', response.data?.salesByDate);
            console.log('👥 New Customers By Date:', response.data?.newCustomersByDate);
            console.log('💰 Revenue By Date:', response.data?.revenueByDate);
            yield put(getCompleteDashboardSuccess(response.data));
        } else {
            throw new Error(response.message || 'Failed to fetch complete dashboard');
        }
    } catch (error) {
        console.error('Error fetching complete dashboard:', error);
        yield put(getCompleteDashboardFailure(error.message));
        toast.error('Có lỗi xảy ra khi tải dữ liệu dashboard: ' + error.message);
    }
}

function* handleGetTopProductsByCategory() {
    try {
        const response = yield call(apiGetTopProductsByCategory);

        if (response.status === 'OK') {
            yield put(getTopProductsByCategorySuccess(response.data));
        } else {
            throw new Error(response.message || 'Failed to fetch top products by category');
        }
    } catch (error) {
        console.error('Error fetching top products by category:', error);
        yield put(getTopProductsByCategoryFailure(error.message));
        toast.error('Có lỗi xảy ra khi tải sản phẩm theo danh mục: ' + error.message);
    }
}

// Root Dashboard Saga
export default function* dashboardSaga() {
    yield all([
        takeLatest(GET_DASHBOARD_OVERVIEW_REQUEST, handleGetDashboardOverview),
        takeLatest(GET_REVENUE_BY_MONTH_REQUEST, handleGetRevenueByMonth),
        takeLatest(GET_REVENUE_BY_DATE_REQUEST, handleGetRevenueByDate),
        takeLatest(GET_NEW_CUSTOMERS_REQUEST, handleGetNewCustomers),
        takeLatest(GET_SALES_BY_DATE_REQUEST, handleGetSalesByDate),
        takeLatest(GET_TOP_PRODUCTS_REQUEST, handleGetTopProducts),
        takeLatest(GET_COMPLETE_DASHBOARD_REQUEST, handleGetCompleteDashboard),
        takeLatest(GET_TOP_PRODUCTS_BY_CATEGORY_REQUEST, handleGetTopProductsByCategory),
    ]);
} 
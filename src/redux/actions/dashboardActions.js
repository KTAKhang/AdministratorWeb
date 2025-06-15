// actions/dashboardActions.js

// Action Types cho Dashboard Overview
export const GET_DASHBOARD_OVERVIEW_REQUEST = "GET_DASHBOARD_OVERVIEW_REQUEST";
export const GET_DASHBOARD_OVERVIEW_SUCCESS = "GET_DASHBOARD_OVERVIEW_SUCCESS";
export const GET_DASHBOARD_OVERVIEW_FAILURE = "GET_DASHBOARD_OVERVIEW_FAILURE";

// Action Types cho Revenue by Month
export const GET_REVENUE_BY_MONTH_REQUEST = "GET_REVENUE_BY_MONTH_REQUEST";
export const GET_REVENUE_BY_MONTH_SUCCESS = "GET_REVENUE_BY_MONTH_SUCCESS";
export const GET_REVENUE_BY_MONTH_FAILURE = "GET_REVENUE_BY_MONTH_FAILURE";

// Action Types cho Revenue by Date
export const GET_REVENUE_BY_DATE_REQUEST = "GET_REVENUE_BY_DATE_REQUEST";
export const GET_REVENUE_BY_DATE_SUCCESS = "GET_REVENUE_BY_DATE_SUCCESS";
export const GET_REVENUE_BY_DATE_FAILURE = "GET_REVENUE_BY_DATE_FAILURE";

// Action Types cho New Customers
export const GET_NEW_CUSTOMERS_REQUEST = "GET_NEW_CUSTOMERS_REQUEST";
export const GET_NEW_CUSTOMERS_SUCCESS = "GET_NEW_CUSTOMERS_SUCCESS";
export const GET_NEW_CUSTOMERS_FAILURE = "GET_NEW_CUSTOMERS_FAILURE";

// Action Types cho Sales by Date
export const GET_SALES_BY_DATE_REQUEST = "GET_SALES_BY_DATE_REQUEST";
export const GET_SALES_BY_DATE_SUCCESS = "GET_SALES_BY_DATE_SUCCESS";
export const GET_SALES_BY_DATE_FAILURE = "GET_SALES_BY_DATE_FAILURE";

// Action Types cho Top Selling Products
export const GET_TOP_PRODUCTS_REQUEST = "GET_TOP_PRODUCTS_REQUEST";
export const GET_TOP_PRODUCTS_SUCCESS = "GET_TOP_PRODUCTS_SUCCESS";
export const GET_TOP_PRODUCTS_FAILURE = "GET_TOP_PRODUCTS_FAILURE";

// Action Types cho Complete Dashboard
export const GET_COMPLETE_DASHBOARD_REQUEST = "GET_COMPLETE_DASHBOARD_REQUEST";
export const GET_COMPLETE_DASHBOARD_SUCCESS = "GET_COMPLETE_DASHBOARD_SUCCESS";
export const GET_COMPLETE_DASHBOARD_FAILURE = "GET_COMPLETE_DASHBOARD_FAILURE";

// Action Types cho Top Products by Category
export const GET_TOP_PRODUCTS_BY_CATEGORY_REQUEST = "GET_TOP_PRODUCTS_BY_CATEGORY_REQUEST";
export const GET_TOP_PRODUCTS_BY_CATEGORY_SUCCESS = "GET_TOP_PRODUCTS_BY_CATEGORY_SUCCESS";
export const GET_TOP_PRODUCTS_BY_CATEGORY_FAILURE = "GET_TOP_PRODUCTS_BY_CATEGORY_FAILURE";

// Action Creators cho Dashboard Overview
export const getDashboardOverviewRequest = () => ({
    type: GET_DASHBOARD_OVERVIEW_REQUEST,
});

export const getDashboardOverviewSuccess = (data) => ({
    type: GET_DASHBOARD_OVERVIEW_SUCCESS,
    payload: data,
});

export const getDashboardOverviewFailure = (error) => ({
    type: GET_DASHBOARD_OVERVIEW_FAILURE,
    payload: error,
});

// Action Creators cho Revenue by Month
export const getRevenueByMonthRequest = (year) => ({
    type: GET_REVENUE_BY_MONTH_REQUEST,
    payload: { year },
});

export const getRevenueByMonthSuccess = (data) => ({
    type: GET_REVENUE_BY_MONTH_SUCCESS,
    payload: data,
});

export const getRevenueByMonthFailure = (error) => ({
    type: GET_REVENUE_BY_MONTH_FAILURE,
    payload: error,
});

// Action Creators cho Revenue by Date
export const getRevenueByDateRequest = (startDate, endDate) => ({
    type: GET_REVENUE_BY_DATE_REQUEST,
    payload: { startDate, endDate },
});

export const getRevenueByDateSuccess = (data) => ({
    type: GET_REVENUE_BY_DATE_SUCCESS,
    payload: data,
});

export const getRevenueByDateFailure = (error) => ({
    type: GET_REVENUE_BY_DATE_FAILURE,
    payload: error,
});

// Action Creators cho New Customers
export const getNewCustomersRequest = (startDate, endDate) => ({
    type: GET_NEW_CUSTOMERS_REQUEST,
    payload: { startDate, endDate },
});

export const getNewCustomersSuccess = (data) => ({
    type: GET_NEW_CUSTOMERS_SUCCESS,
    payload: data,
});

export const getNewCustomersFailure = (error) => ({
    type: GET_NEW_CUSTOMERS_FAILURE,
    payload: error,
});

// Action Creators cho Sales by Date
export const getSalesByDateRequest = (startDate, endDate) => ({
    type: GET_SALES_BY_DATE_REQUEST,
    payload: { startDate, endDate },
});

export const getSalesByDateSuccess = (data) => ({
    type: GET_SALES_BY_DATE_SUCCESS,
    payload: data,
});

export const getSalesByDateFailure = (error) => ({
    type: GET_SALES_BY_DATE_FAILURE,
    payload: error,
});

// Action Creators cho Top Selling Products
export const getTopProductsRequest = (limit = 3) => ({
    type: GET_TOP_PRODUCTS_REQUEST,
    payload: { limit },
});

export const getTopProductsSuccess = (data) => ({
    type: GET_TOP_PRODUCTS_SUCCESS,
    payload: data,
});

export const getTopProductsFailure = (error) => ({
    type: GET_TOP_PRODUCTS_FAILURE,
    payload: error,
});

// Action Creators cho Complete Dashboard
export const getCompleteDashboardRequest = (startDate, endDate) => ({
    type: GET_COMPLETE_DASHBOARD_REQUEST,
    payload: { startDate, endDate },
});

export const getCompleteDashboardSuccess = (data) => ({
    type: GET_COMPLETE_DASHBOARD_SUCCESS,
    payload: data,
});

export const getCompleteDashboardFailure = (error) => ({
    type: GET_COMPLETE_DASHBOARD_FAILURE,
    payload: error,
});

// Action Creators cho Top Products by Category
export const getTopProductsByCategoryRequest = () => ({
    type: GET_TOP_PRODUCTS_BY_CATEGORY_REQUEST,
});

export const getTopProductsByCategorySuccess = (data) => ({
    type: GET_TOP_PRODUCTS_BY_CATEGORY_SUCCESS,
    payload: data,
});

export const getTopProductsByCategoryFailure = (error) => ({
    type: GET_TOP_PRODUCTS_BY_CATEGORY_FAILURE,
    payload: error,
}); 
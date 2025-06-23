// reducers/dashboardReducer.js
import {
    GET_DASHBOARD_OVERVIEW_REQUEST,
    GET_DASHBOARD_OVERVIEW_SUCCESS,
    GET_DASHBOARD_OVERVIEW_FAILURE,
    GET_REVENUE_BY_MONTH_REQUEST,
    GET_REVENUE_BY_MONTH_SUCCESS,
    GET_REVENUE_BY_MONTH_FAILURE,
    GET_REVENUE_BY_DATE_REQUEST,
    GET_REVENUE_BY_DATE_SUCCESS,
    GET_REVENUE_BY_DATE_FAILURE,
    GET_NEW_CUSTOMERS_REQUEST,
    GET_NEW_CUSTOMERS_SUCCESS,
    GET_NEW_CUSTOMERS_FAILURE,
    GET_SALES_BY_DATE_REQUEST,
    GET_SALES_BY_DATE_SUCCESS,
    GET_SALES_BY_DATE_FAILURE,
    GET_TOP_PRODUCTS_REQUEST,
    GET_TOP_PRODUCTS_SUCCESS,
    GET_TOP_PRODUCTS_FAILURE,
    GET_COMPLETE_DASHBOARD_REQUEST,
    GET_COMPLETE_DASHBOARD_SUCCESS,
    GET_COMPLETE_DASHBOARD_FAILURE,
    GET_TOP_PRODUCTS_BY_CATEGORY_REQUEST,
    GET_TOP_PRODUCTS_BY_CATEGORY_SUCCESS,
    GET_TOP_PRODUCTS_BY_CATEGORY_FAILURE,
} from "../actions/dashboardActions";

const initialState = {
    // Overview data
    overview: {
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
    },
    overviewLoading: false,
    overviewError: null,

    // Revenue by month data
    revenueByMonth: [],
    revenueByMonthLoading: false,
    revenueByMonthError: null,

    // Revenue by date data
    revenueByDate: [],
    revenueByDateLoading: false,
    revenueByDateError: null,

    // New customers data
    newCustomers: [],
    newCustomersLoading: false,
    newCustomersError: null,

    // Sales by date data
    salesByDate: [],
    salesByDateLoading: false,
    salesByDateError: null,

    // Top products data
    topProducts: [],
    topProductsLoading: false,
    topProductsError: null,

    // Complete dashboard data
    completeDashboard: {},
    completeDashboardLoading: false,
    completeDashboardError: null,

    // Top products by category data
    topProductsByCategory: [],
    topProductsByCategoryLoading: false,
    topProductsByCategoryError: null,

    // General loading state for initial dashboard load
    dashboardLoading: false,
    dashboardError: null,

    // Computed values for display
    todayStats: {
        revenue: 0,
        newCustomers: 0,
        sales: 0,
        revenueChange: '+0%',
        customersChange: '+0%',
        salesChange: '+0%',
    },
};

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        // Dashboard Overview
        case GET_DASHBOARD_OVERVIEW_REQUEST:
            return {
                ...state,
                overviewLoading: true,
                overviewError: null,
                dashboardLoading: true,
            };

        case GET_DASHBOARD_OVERVIEW_SUCCESS:
            return {
                ...state,
                overview: action.payload,
                overviewLoading: false,
                overviewError: null,
                dashboardLoading: false,
            };

        case GET_DASHBOARD_OVERVIEW_FAILURE:
            return {
                ...state,
                overview: initialState.overview,
                overviewLoading: false,
                overviewError: action.payload,
                dashboardLoading: false,
            };

        // Revenue by Month
        case GET_REVENUE_BY_MONTH_REQUEST:
            return {
                ...state,
                revenueByMonthLoading: true,
                revenueByMonthError: null,
            };

        case GET_REVENUE_BY_MONTH_SUCCESS:
            return {
                ...state,
                revenueByMonth: action.payload,
                revenueByMonthLoading: false,
                revenueByMonthError: null,
            };

        case GET_REVENUE_BY_MONTH_FAILURE:
            return {
                ...state,
                revenueByMonth: [],
                revenueByMonthLoading: false,
                revenueByMonthError: action.payload,
            };

        // Revenue by Date
        case GET_REVENUE_BY_DATE_REQUEST:
            return {
                ...state,
                revenueByDateLoading: true,
                revenueByDateError: null,
            };

        case GET_REVENUE_BY_DATE_SUCCESS:
            return {
                ...state,
                revenueByDate: action.payload,
                revenueByDateLoading: false,
                revenueByDateError: null,
            };

        case GET_REVENUE_BY_DATE_FAILURE:
            return {
                ...state,
                revenueByDate: [],
                revenueByDateLoading: false,
                revenueByDateError: action.payload,
            };

        // New Customers
        case GET_NEW_CUSTOMERS_REQUEST:
            return {
                ...state,
                newCustomersLoading: true,
                newCustomersError: null,
            };

        case GET_NEW_CUSTOMERS_SUCCESS:
            return {
                ...state,
                newCustomers: action.payload,
                newCustomersLoading: false,
                newCustomersError: null,
            };

        case GET_NEW_CUSTOMERS_FAILURE:
            return {
                ...state,
                newCustomers: [],
                newCustomersLoading: false,
                newCustomersError: action.payload,
            };

        // Sales by Date
        case GET_SALES_BY_DATE_REQUEST:
            return {
                ...state,
                salesByDateLoading: true,
                salesByDateError: null,
            };

        case GET_SALES_BY_DATE_SUCCESS:
            return {
                ...state,
                salesByDate: action.payload,
                salesByDateLoading: false,
                salesByDateError: null,
            };

        case GET_SALES_BY_DATE_FAILURE:
            return {
                ...state,
                salesByDate: [],
                salesByDateLoading: false,
                salesByDateError: action.payload,
            };

        // Top Products
        case GET_TOP_PRODUCTS_REQUEST:
            return {
                ...state,
                topProductsLoading: true,
                topProductsError: null,
            };

        case GET_TOP_PRODUCTS_SUCCESS:
            return {
                ...state,
                topProducts: action.payload,
                topProductsLoading: false,
                topProductsError: null,
            };

        case GET_TOP_PRODUCTS_FAILURE:
            return {
                ...state,
                topProducts: [],
                topProductsLoading: false,
                topProductsError: action.payload,
            };

        // Complete Dashboard
        case GET_COMPLETE_DASHBOARD_REQUEST:
            return {
                ...state,
                completeDashboardLoading: true,
                completeDashboardError: null,
                dashboardLoading: true,
            };

        case GET_COMPLETE_DASHBOARD_SUCCESS:
            const completeData = action.payload;
            return {
                ...state,
                // Update individual data sections from complete dashboard
                overview: completeData.overview || state.overview,
                revenueByDate: completeData.revenueByDate || [],
                newCustomers: completeData.newCustomersByDate || [],
                salesByDate: completeData.salesByDate || [],
                topProducts: completeData.topSellingProducts || [],
                // Also store the complete data
                completeDashboard: completeData,
                completeDashboardLoading: false,
                completeDashboardError: null,
                dashboardLoading: false,
                // Update individual loading states
                overviewLoading: false,
                revenueByDateLoading: false,
                newCustomersLoading: false,
                salesByDateLoading: false,
                topProductsLoading: false,
            };

        case GET_COMPLETE_DASHBOARD_FAILURE:
            return {
                ...state,
                completeDashboard: {},
                completeDashboardLoading: false,
                completeDashboardError: action.payload,
                dashboardLoading: false,
            };

        // Top Products by Category
        case GET_TOP_PRODUCTS_BY_CATEGORY_REQUEST:
            return {
                ...state,
                topProductsByCategoryLoading: true,
                topProductsByCategoryError: null,
            };

        case GET_TOP_PRODUCTS_BY_CATEGORY_SUCCESS:
            return {
                ...state,
                topProductsByCategory: action.payload,
                topProductsByCategoryLoading: false,
                topProductsByCategoryError: null,
            };

        case GET_TOP_PRODUCTS_BY_CATEGORY_FAILURE:
            return {
                ...state,
                topProductsByCategory: [],
                topProductsByCategoryLoading: false,
                topProductsByCategoryError: action.payload,
            };

        default:
            return state;
    }
};

export default dashboardReducer; 
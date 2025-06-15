// reducers/orderReducer.js
import {
    FETCH_ORDER_REQUEST,
    FETCH_ORDER_SUCCESS,
    FETCH_ORDER_FAILURE,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_FAILURE,
    FETCH_ORDER_BY_STATUS_REQUEST,
    FETCH_ORDER_BY_STATUS_SUCCESS,
    FETCH_ORDER_BY_STATUS_FAILURE,
} from "../actions/orderActions";

const initialState = {
    orders: [],
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
    pagination: {
        page: 1,
        limit: 5,
        totalPages: 1,
        total: 0,
    },
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload.data.orders,
                pagination: {
                    page: parseInt(action.payload.data.page),
                    limit: parseInt(action.payload.data.limit),
                    totalPages: action.payload.data.totalPages,
                    total: action.payload.data.total,
                },
            };
        case FETCH_ORDER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        // Update Order Cases
        case UPDATE_ORDER_REQUEST:
            return {
                ...state,
                updateLoading: true,
                updateError: null,
            };
        case UPDATE_ORDER_SUCCESS:
            return {
                ...state,
                updateLoading: false,
                orders: state.orders.map(order =>
                    order.order_id === action.payload.data.order_id
                        ? action.payload.data
                        : order
                ),
            };
        case UPDATE_ORDER_FAILURE:
            return {
                ...state,
                updateLoading: false,
                updateError: action.payload,
            };

        // Fetch Order By Status Cases
        case FETCH_ORDER_BY_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_ORDER_BY_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload.data.orders,
                pagination: {
                    page: parseInt(action.payload.data.page),
                    limit: parseInt(action.payload.data.limit),
                    totalPages: action.payload.data.totalPages || Math.ceil(action.payload.data.total / action.payload.data.limit),
                    total: action.payload.data.total,
                },
            };
        case FETCH_ORDER_BY_STATUS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default orderReducer;
// actions/orderActions.js
export const FETCH_ORDER_REQUEST = "FETCH_ORDER_REQUEST";
export const FETCH_ORDER_SUCCESS = "FETCH_ORDER_SUCCESS";
export const FETCH_ORDER_FAILURE = "FETCH_ORDER_FAILURE";

export const UPDATE_ORDER_REQUEST = "UPDATE_ORDER_REQUEST";
export const UPDATE_ORDER_SUCCESS = "UPDATE_ORDER_SUCCESS";
export const UPDATE_ORDER_FAILURE = "UPDATE_ORDER_FAILURE";

export const FETCH_ORDER_BY_STATUS_REQUEST = "FETCH_ORDER_BY_STATUS_REQUEST";
export const FETCH_ORDER_BY_STATUS_SUCCESS = "FETCH_ORDER_BY_STATUS_SUCCESS";
export const FETCH_ORDER_BY_STATUS_FAILURE = "FETCH_ORDER_BY_STATUS_FAILURE";



// Fetch orders actions
export const fetchOrderRequest = ({ page, limit, search }) => ({
    type: FETCH_ORDER_REQUEST,
    payload: { page, limit, search },
});

export const fetchOrderSuccess = (data) => ({
    type: FETCH_ORDER_SUCCESS,
    payload: data,
});

export const fetchOrderFailure = (error) => ({
    type: FETCH_ORDER_FAILURE,
    payload: error,
});



// Update order actions - FIXED: Now includes id and token
export const updateOrderRequest = (id, orderData) => ({
    type: UPDATE_ORDER_REQUEST,
    payload: { id, orderData },
});
export const updateOrderSuccess = (data) => ({
    type: UPDATE_ORDER_SUCCESS,
    payload: data,
});

export const updateOrderFailure = (error) => ({
    type: UPDATE_ORDER_FAILURE,
    payload: error,
});

// Fetch orders by status actions
export const fetchOrderByStatusRequest = ({ status, page, limit, search }) => ({
    type: FETCH_ORDER_BY_STATUS_REQUEST,
    payload: { status, page, limit, search },
});

export const fetchOrderByStatusSuccess = (data) => ({
    type: FETCH_ORDER_BY_STATUS_SUCCESS,
    payload: data,
});

export const fetchOrderByStatusFailure = (error) => ({
    type: FETCH_ORDER_BY_STATUS_FAILURE,
    payload: error,
});


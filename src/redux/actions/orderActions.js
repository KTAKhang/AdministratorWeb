// actions/orderActions.js
export const FETCH_ORDER_REQUEST = "FETCH_ORDER_REQUEST";
export const FETCH_ORDER_SUCCESS = "FETCH_ORDER_SUCCESS";
export const FETCH_ORDER_FAILURE = "FETCH_ORDER_FAILURE";

export const UPDATE_ORDER_REQUEST = "UPDATE_ORDER_REQUEST";
export const UPDATE_ORDER_SUCCESS = "UPDATE_ORDER_SUCCESS";
export const UPDATE_ORDER_FAILURE = "UPDATE_ORDER_FAILURE";



// Fetch orders actions
export const fetchOrderRequest = ({ page, limit }) => ({
    type: FETCH_ORDER_REQUEST,
    payload: { page, limit },
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


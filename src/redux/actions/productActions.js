// actions/productActions.js
export const FETCH_PRODUCT_REQUEST = "FETCH_PRODUCT_REQUEST";
export const FETCH_PRODUCT_SUCCESS = "FETCH_PRODUCT_SUCCESS";
export const FETCH_PRODUCT_FAILURE = "FETCH_PRODUCT_FAILURE";

export const CREATE_PRODUCT_REQUEST = "CREATE_PRODUCT_REQUEST";
export const CREATE_PRODUCT_SUCCESS = "CREATE_PRODUCT_SUCCESS";
export const CREATE_PRODUCT_FAILURE = "CREATE_PRODUCT_FAILURE";

export const UPDATE_PRODUCT_REQUEST = "UPDATE_PRODUCT_REQUEST";
export const UPDATE_PRODUCT_SUCCESS = "UPDATE_PRODUCT_SUCCESS";
export const UPDATE_PRODUCT_FAILURE = "UPDATE_PRODUCT_FAILURE";

export const DELETE_PRODUCT_REQUEST = "DELETE_PRODUCT_REQUEST";
export const DELETE_PRODUCT_SUCCESS = "DELETE_PRODUCT_SUCCESS";
export const DELETE_PRODUCT_FAILURE = "DELETE_PRODUCT_FAILURE";

export const fetchProductRequest = ({ page, limit, search }) => ({
    type: FETCH_PRODUCT_REQUEST,
    payload: { page, limit, search },
});

export const fetchProductSuccess = (data) => ({
    type: FETCH_PRODUCT_SUCCESS,
    payload: data,
});

export const fetchProductFailure = (error) => ({
    type: FETCH_PRODUCT_FAILURE,
    payload: error,
});

export const createProductRequest = (payload) => ({
    type: CREATE_PRODUCT_REQUEST,
    payload,
});

export const createProductSuccess = (data) => ({
    type: CREATE_PRODUCT_SUCCESS,
    payload: data,
});

export const createProductFailure = (error) => ({
    type: CREATE_PRODUCT_FAILURE,
    payload: error,
});

// FIX: Sửa để nhận đúng tham số như saga mong đợi
export const updateProductRequest = (id, formData, onSuccess) => ({
    type: UPDATE_PRODUCT_REQUEST,
    payload: { id, formData, onSuccess },
});

export const updateProductSuccess = (data) => ({
    type: UPDATE_PRODUCT_SUCCESS,
    payload: data,
});

export const updateProductFailure = (error) => ({
    type: UPDATE_PRODUCT_FAILURE,
    payload: error,
});

// FIX: Sửa để nhận đúng tham số như saga mong đợi
export const deleteProductRequest = (id, onSuccess) => ({
    type: DELETE_PRODUCT_REQUEST,
    payload: { id, onSuccess },
});

export const deleteProductSuccess = (id) => ({
    type: DELETE_PRODUCT_SUCCESS,
    payload: id,
});

export const deleteProductFailure = (error) => ({
    type: DELETE_PRODUCT_FAILURE,
    payload: error,
});
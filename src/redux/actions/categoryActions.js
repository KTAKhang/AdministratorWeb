// actions/authActions.js
export const FETCH_CATEGORY_REQUEST = "FETCH_CATEGORY_REQUEST";
export const FETCH_CATEGORY_SUCCESS = "FETCH_CATEGORY_REQUEST";
export const FETCH_CATEGORY_FAILURE = "FETCH_CATEGORY_REQUEST";


export const fetchCategoryRequest = ({ page, limit }) => ({
    type: FETCH_CATEGORY_REQUEST,
    payload: { page, limit },
});

export const fetchCategorySuccess = (data) => ({
    type: FETCH_CATEGORY_SUCCESS,
    payload: data,
});

export const fetchCategoryFailure = (error) => ({
    type: FETCH_CATEGORY_FAILURE,
    payload: error,
});



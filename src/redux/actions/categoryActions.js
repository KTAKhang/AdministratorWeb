// actions/categoryActions.js
export const FETCH_CATEGORY_REQUEST = "FETCH_CATEGORY_REQUEST";
export const FETCH_CATEGORY_SUCCESS = "FETCH_CATEGORY_SUCCESS";
export const FETCH_CATEGORY_FAILURE = "FETCH_CATEGORY_FAILURE";

export const CREATE_CATEGORY_REQUEST = "CREATE_CATEGORY_REQUEST";
export const CREATE_CATEGORY_SUCCESS = "CREATE_CATEGORY_SUCCESS";
export const CREATE_CATEGORY_FAILURE = "CREATE_CATEGORY_FAILURE";

// Add UPDATE actions
export const UPDATE_CATEGORY_REQUEST = "UPDATE_CATEGORY_REQUEST";
export const UPDATE_CATEGORY_SUCCESS = "UPDATE_CATEGORY_SUCCESS";
export const UPDATE_CATEGORY_FAILURE = "UPDATE_CATEGORY_FAILURE";

// Add DELETE actions
export const DELETE_CATEGORY_REQUEST = "DELETE_CATEGORY_REQUEST";
export const DELETE_CATEGORY_SUCCESS = "DELETE_CATEGORY_SUCCESS";
export const DELETE_CATEGORY_FAILURE = "DELETE_CATEGORY_FAILURE";

export const fetchCategoryRequest = ({ page, limit, search }) => ({
    type: FETCH_CATEGORY_REQUEST,
    payload: { page, limit, search },
});

export const fetchCategorySuccess = (data) => ({
    type: FETCH_CATEGORY_SUCCESS,
    payload: data,
});

export const fetchCategoryFailure = (error) => ({
    type: FETCH_CATEGORY_FAILURE,
    payload: error,
});

export const createCategoryRequest = (categoryData) => ({
    type: CREATE_CATEGORY_REQUEST,
    payload: categoryData,
});

export const createCategorySuccess = (data) => ({
    type: CREATE_CATEGORY_SUCCESS,
    payload: data,
});

export const createCategoryFailure = (error) => ({
    type: CREATE_CATEGORY_FAILURE,
    payload: error,
});

// Update actions
export const updateCategoryRequest = (categoryData) => ({
    type: UPDATE_CATEGORY_REQUEST,
    payload: categoryData,
});

export const updateCategorySuccess = (data) => ({
    type: UPDATE_CATEGORY_SUCCESS,
    payload: data,
});

export const updateCategoryFailure = (error) => ({
    type: UPDATE_CATEGORY_FAILURE,
    payload: error,
});

// Delete actions
export const deleteCategoryRequest = (id, token) => ({
    type: DELETE_CATEGORY_REQUEST,
    payload: { id, token },
});

export const deleteCategorySuccess = (id) => ({
    type: DELETE_CATEGORY_SUCCESS,
    payload: id,
});

export const deleteCategoryFailure = (error) => ({
    type: DELETE_CATEGORY_FAILURE,
    payload: error,
});
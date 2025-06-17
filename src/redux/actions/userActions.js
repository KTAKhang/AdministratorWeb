// actions/userActions.js

// Get all users actions
export const GET_ALL_USERS_REQUEST = "GET_ALL_USERS_REQUEST";
export const GET_ALL_USERS_SUCCESS = "GET_ALL_USERS_SUCCESS";
export const GET_ALL_USERS_FAILURE = "GET_ALL_USERS_FAILURE";

// Get user by ID actions
export const GET_USER_BY_ID_REQUEST = "GET_USER_BY_ID_REQUEST";
export const GET_USER_BY_ID_SUCCESS = "GET_USER_BY_ID_SUCCESS";
export const GET_USER_BY_ID_FAILURE = "GET_USER_BY_ID_FAILURE";

// Update user actions
export const UPDATE_USER_REQUEST = "UPDATE_USER_REQUEST";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
export const UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";

// Clear user detail
export const CLEAR_USER_DETAIL = "CLEAR_USER_DETAIL";

// Set search text
export const SET_USER_SEARCH_TEXT = "SET_USER_SEARCH_TEXT";

// Set pagination
export const SET_USER_PAGINATION = "SET_USER_PAGINATION";

// Action creators
export const getAllUsersRequest = (page = 1, limit = 10, search = "") => ({
    type: GET_ALL_USERS_REQUEST,
    payload: { page, limit, search },
});

export const getAllUsersSuccess = (data) => ({
    type: GET_ALL_USERS_SUCCESS,
    payload: data,
});

export const getAllUsersFailure = (error) => ({
    type: GET_ALL_USERS_FAILURE,
    payload: error,
});

export const getUserByIdRequest = (userId) => ({
    type: GET_USER_BY_ID_REQUEST,
    payload: userId,
});

export const getUserByIdSuccess = (data) => ({
    type: GET_USER_BY_ID_SUCCESS,
    payload: data,
});

export const getUserByIdFailure = (error) => ({
    type: GET_USER_BY_ID_FAILURE,
    payload: error,
});

export const updateUserRequest = (userId, userData) => ({
    type: UPDATE_USER_REQUEST,
    payload: { userId, userData },
});

export const updateUserSuccess = (data) => ({
    type: UPDATE_USER_SUCCESS,
    payload: data,
});

export const updateUserFailure = (error) => ({
    type: UPDATE_USER_FAILURE,
    payload: error,
});

export const clearUserDetail = () => ({
    type: CLEAR_USER_DETAIL,
});

export const setUserSearchText = (searchText) => ({
    type: SET_USER_SEARCH_TEXT,
    payload: searchText,
});

export const setUserPagination = (pagination) => ({
    type: SET_USER_PAGINATION,
    payload: pagination,
}); 
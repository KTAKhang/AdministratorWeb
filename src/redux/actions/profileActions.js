// actions/userActions.js

// Fetch user actions
export const FETCH_USER_REQUEST = "FETCH_USER_REQUEST";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";

// Update user profile actions
export const UPDATE_USER_REQUEST = "UPDATE_USER_REQUEST";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
export const UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";

// Change password actions
export const CHANGE_PASSWORD_REQUEST = "CHANGE_PASSWORD_REQUEST";
export const CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS";
export const CHANGE_PASSWORD_FAILURE = "CHANGE_PASSWORD_FAILURE";

// Fetch user actions
export const fetchUserRequest = (userId) => ({
    type: FETCH_USER_REQUEST,
    payload: { userId },
});

export const fetchUserSuccess = (data) => ({
    type: FETCH_USER_SUCCESS,
    payload: data,
});

export const fetchUserFailure = (error) => ({
    type: FETCH_USER_FAILURE,
    payload: error,
});

// Update user profile actions
export const updateUserRequest = (userData) => ({
    type: UPDATE_USER_REQUEST,
    payload: userData,
});

export const updateUserSuccess = (data) => ({
    type: UPDATE_USER_SUCCESS,
    payload: data,
});

export const updateUserFailure = (error) => ({
    type: UPDATE_USER_FAILURE,
    payload: error,
});

// Change password actions
export const changePasswordRequest = (passwordData) => ({
    type: CHANGE_PASSWORD_REQUEST,
    payload: passwordData,
});

export const changePasswordSuccess = (data) => ({
    type: CHANGE_PASSWORD_SUCCESS,
    payload: data,
});

export const changePasswordFailure = (error) => ({
    type: CHANGE_PASSWORD_FAILURE,
    payload: error,
});
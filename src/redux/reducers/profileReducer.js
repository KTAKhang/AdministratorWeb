// reducers/userReducer.js
import {
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
} from "../actions/profileActions";

const initialState = {
    user: null,
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
    updateSuccess: false,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        // Fetch user cases
        case FETCH_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload.data,
                error: null,
            };
        case FETCH_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Update user profile cases
        case UPDATE_USER_REQUEST:
            return {
                ...state,
                updateLoading: true,
                updateError: null,
                updateSuccess: false,
            };
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                updateLoading: false,
                user: action.payload.data,
                updateError: null,
                updateSuccess: true,
            };
        case UPDATE_USER_FAILURE:
            return {
                ...state,
                updateLoading: false,
                updateError: action.payload,
                updateSuccess: false,
            };

        default:
            return state;
    }
};

export default userReducer;
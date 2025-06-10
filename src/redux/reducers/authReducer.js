// reducers/authReducer.js
import {
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT,
    SET_USER,
} from "../actions/authActions";

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    error: null,
    loading: false,
    isAuthenticated: !!localStorage.getItem("token"),
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.data,
                token: action.payload.token.access_token,
                role: action.payload.data.role_name,
                error: null,
                loading: false,
                isAuthenticated: true,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                token: null,
                role: null,
                error: action.payload,
                loading: false,
                isAuthenticated: false,
            };
        case LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                role: null,
                error: null,
                loading: false,
                isAuthenticated: false,
            };
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;
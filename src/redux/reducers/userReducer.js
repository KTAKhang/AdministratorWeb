// reducers/userReducer.js
import {
    GET_ALL_USERS_REQUEST,
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_FAILURE,
    GET_USER_BY_ID_REQUEST,
    GET_USER_BY_ID_SUCCESS,
    GET_USER_BY_ID_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
    CLEAR_USER_DETAIL,
    SET_USER_SEARCH_TEXT,
    SET_USER_PAGINATION,
} from "../actions/userActions";

const initialState = {
    // Users list
    users: [],
    allUsers: [],
    filteredUsers: [],
    loading: false,
    error: null,

    // User detail
    selectedUser: null,
    userDetail: null,
    detailLoading: false,
    detailError: null,

    // Update user
    updateLoading: false,
    updateError: null,

    // Search and pagination
    searchText: "",
    pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
    },

    // Statistics
    stats: {
        total: 0,
        active: 0,
        inactive: 0,
    },
};

// Helper function to calculate stats
const calculateStats = (users) => ({
    total: users.length,
    active: users.filter(user => user.status).length,
    inactive: users.filter(user => !user.status).length,
});

// Helper function to filter users
const filterUsers = (users, searchText) => {
    if (!searchText) return users;

    const lowercaseSearch = searchText.toLowerCase();
    return users.filter(user =>
        user.user_name?.toLowerCase().includes(lowercaseSearch) ||
        user.email?.toLowerCase().includes(lowercaseSearch) ||
        user.role_name?.toLowerCase().includes(lowercaseSearch)
    );
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_USERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_ALL_USERS_SUCCESS:
            const { users, pagination } = action.payload;
            const filteredUsers = filterUsers(users, state.searchText);

            return {
                ...state,
                users: filteredUsers,
                allUsers: users,
                filteredUsers,
                loading: false,
                error: null,
                pagination: {
                    current: pagination.currentPage || state.pagination.current,
                    pageSize: pagination.limit || state.pagination.pageSize,
                    total: pagination.totalUsers || 0,
                    totalPages: pagination.totalPages || 0,
                },
                stats: calculateStats(users),
            };

        case GET_ALL_USERS_FAILURE:
            return {
                ...state,
                users: [],
                allUsers: [],
                filteredUsers: [],
                loading: false,
                error: action.payload,
                stats: calculateStats([]),
            };

        case GET_USER_BY_ID_REQUEST:
            return {
                ...state,
                detailLoading: true,
                detailError: null,
            };

        case GET_USER_BY_ID_SUCCESS:
            return {
                ...state,
                userDetail: action.payload,
                detailLoading: false,
                detailError: null,
            };

        case GET_USER_BY_ID_FAILURE:
            return {
                ...state,
                userDetail: null,
                detailLoading: false,
                detailError: action.payload,
            };

        case UPDATE_USER_REQUEST:
            return {
                ...state,
                updateLoading: true,
                updateError: null,
            };

        case UPDATE_USER_SUCCESS:
            const updatedUser = action.payload;
            const updatedUsers = state.allUsers.map(user =>
                user._id === updatedUser._id ? updatedUser : user
            );
            const updatedFilteredUsers = filterUsers(updatedUsers, state.searchText);

            return {
                ...state,
                allUsers: updatedUsers,
                users: updatedFilteredUsers,
                filteredUsers: updatedFilteredUsers,
                userDetail: updatedUser, // Update detail if viewing the same user
                updateLoading: false,
                updateError: null,
                stats: calculateStats(updatedUsers),
            };

        case UPDATE_USER_FAILURE:
            return {
                ...state,
                updateLoading: false,
                updateError: action.payload,
            };

        case CLEAR_USER_DETAIL:
            return {
                ...state,
                userDetail: null,
                selectedUser: null,
                detailError: null,
            };

        case SET_USER_SEARCH_TEXT:
            const searchText = action.payload;
            const newFilteredUsers = filterUsers(state.allUsers, searchText);

            return {
                ...state,
                searchText,
                users: newFilteredUsers,
                filteredUsers: newFilteredUsers,
                pagination: {
                    ...state.pagination,
                    current: 1, // Reset to first page when searching
                },
            };

        case SET_USER_PAGINATION:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    ...action.payload,
                },
            };

        default:
            return state;
    }
};

export default userReducer; 
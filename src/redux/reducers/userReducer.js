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

    // Statistics - use API statistics when available, fallback to client-side calculation
    stats: {
        total: 0,
        active: 0,
        inactive: 0,
    },

    // API statistics from server
    apiStatistics: {
        totalActive: 0,
        totalInactive: 0,
        currentPage: 1,
    },
};

// Helper function to calculate stats from client data (fallback)
const calculateStats = (users) => ({
    total: users.length,
    active: users.filter(user => user.status).length,
    inactive: users.filter(user => !user.status).length,
});

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_USERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_ALL_USERS_SUCCESS:
            const { data, pagination } = action.payload;
            const users = data.users || [];

            // Khi sử dụng server-side search, không cần filter client-side nữa
            // Server đã trả về kết quả đã được filter

            // Use API statistics when available, fallback to client-side calculation
            const apiStats = data.total || {};
            const clientStats = calculateStats(users);
            const finalStats = {
                total: apiStats.totalUser || clientStats.total,
                active: apiStats.totalActive || clientStats.active,
                inactive: apiStats.totalInactive || clientStats.inactive,
            };

            return {
                ...state,
                users: users, // Server đã filter, dùng trực tiếp
                allUsers: users, // Cập nhật allUsers với kết quả từ server
                filteredUsers: users, // Giống users vì đã được filter từ server
                loading: false,
                error: null,
                pagination: {
                    current: pagination?.page || apiStats.currentPage || state.pagination.current,
                    pageSize: pagination?.limit || state.pagination.pageSize,
                    total: apiStats.totalUser || 0,
                    totalPages: pagination?.totalPages || apiStats.totalPage || 0,
                },
                stats: finalStats,
                apiStatistics: {
                    totalActive: apiStats.totalActive || 0,
                    totalInactive: apiStats.totalInactive || 0,
                    currentPage: apiStats.currentPage || 1,
                },
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
                apiStatistics: {
                    totalActive: 0,
                    totalInactive: 0,
                    currentPage: 1,
                },
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

            // Update statistics when user is updated
            const oldUser = state.allUsers.find(user => user._id === updatedUser._id);
            let newApiStats = { ...state.apiStatistics };

            if (oldUser && oldUser.status !== updatedUser.status) {
                if (updatedUser.status) {
                    // User was activated
                    newApiStats.totalActive = state.apiStatistics.totalActive + 1;
                    newApiStats.totalInactive = state.apiStatistics.totalInactive - 1;
                } else {
                    // User was deactivated
                    newApiStats.totalActive = state.apiStatistics.totalActive - 1;
                    newApiStats.totalInactive = state.apiStatistics.totalInactive + 1;
                }
            }

            return {
                ...state,
                allUsers: updatedUsers,
                users: updatedUsers, // Cập nhật luôn users vì không cần filter client-side
                filteredUsers: updatedUsers,
                userDetail: updatedUser, // Update detail if viewing the same user
                updateLoading: false,
                updateError: null,
                stats: {
                    total: newApiStats.totalActive + newApiStats.totalInactive,
                    active: newApiStats.totalActive,
                    inactive: newApiStats.totalInactive,
                },
                apiStatistics: newApiStats,
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
            // Chỉ cập nhật searchText, không filter client-side nữa
            // Việc search sẽ được handle bởi API call mới
            return {
                ...state,
                searchText,
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
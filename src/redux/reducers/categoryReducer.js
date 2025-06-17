// reducers/categoryReducer.js
import {
    FETCH_CATEGORY_REQUEST,
    FETCH_CATEGORY_SUCCESS,
    FETCH_CATEGORY_FAILURE,
    CREATE_CATEGORY_REQUEST,
    CREATE_CATEGORY_SUCCESS,
    CREATE_CATEGORY_FAILURE,
    UPDATE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAILURE,
    DELETE_CATEGORY_REQUEST,
    DELETE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_FAILURE,
} from "../actions/categoryActions";

const initialState = {
    categories: [],
    loading: false,
    error: null,
    createLoading: false,
    createError: null,
    updateLoading: false,
    updateError: null,
    deleteLoading: false,
    deleteError: null,
    pagination: {
        page: 1,
        limit: 12,
        totalPages: 1,
        totalCategory: 0,
    },
    statistics: {
        totalActive: 0,
        totalInactive: 0,
        currentPage: 1,
    },
};

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_CATEGORY_SUCCESS: {
            const payload = action.payload;
            const categories = payload?.data?.categories || [];
            const total = payload?.data?.total || {};
            const pagination = payload?.pagination || {};

            return {
                ...state,
                loading: false,
                error: null,
                categories,
                pagination: {
                    page: pagination.page || total.currentPage || 1,
                    limit: pagination.limit || 12,
                    totalPages: pagination.totalPages || total.totalPage || 1,
                    totalCategory: total.totalCategory || 0,
                },
                statistics: {
                    totalActive: total.totalActive || 0,
                    totalInactive: total.totalInactive || 0,
                    currentPage: total.currentPage || 1,
                },
            };
        }

        case FETCH_CATEGORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                categories: [], // Reset categories on error
            };

        // Create Category Cases
        case CREATE_CATEGORY_REQUEST:
            return {
                ...state,
                createLoading: true,
                createError: null,
            };

        case CREATE_CATEGORY_SUCCESS: {
            const newCategory = action.payload?.data;
            if (!newCategory) {
                return {
                    ...state,
                    createLoading: false,
                };
            }

            const isNewCategoryActive = Boolean(newCategory.status);

            // FIX: Không thêm category vào danh sách hiện tại nữa
            // Vì component sẽ gọi lại API để fetch data mới
            // Điều này tránh việc mismatch giữa local state và server state
            return {
                ...state,
                createLoading: false,
                createError: null,
                // Không update categories array ở đây
                // Component sẽ tự động fetch lại data từ server
                pagination: {
                    ...state.pagination,
                    // Tăng total count để phản ánh có thêm category mới
                    totalCategory: state.pagination.totalCategory + 1,
                },
                statistics: {
                    ...state.statistics,
                    totalActive: isNewCategoryActive
                        ? state.statistics.totalActive + 1
                        : state.statistics.totalActive,
                    totalInactive: !isNewCategoryActive
                        ? state.statistics.totalInactive + 1
                        : state.statistics.totalInactive,
                },
            };
        }

        case CREATE_CATEGORY_FAILURE:
            return {
                ...state,
                createLoading: false,
                createError: action.payload,
            };

        // Update Category Cases
        case UPDATE_CATEGORY_REQUEST:
            return {
                ...state,
                updateLoading: true,
                updateError: null,
            };

        case UPDATE_CATEGORY_SUCCESS: {
            const updatedCategory = action.payload?.data;
            if (!updatedCategory || !updatedCategory._id) {
                return {
                    ...state,
                    updateLoading: false,
                };
            }

            const oldCategory = state.categories.find(cat => cat._id === updatedCategory._id);
            const updatedCategories = state.categories.map(category =>
                category._id === updatedCategory._id ? { ...category, ...updatedCategory } : category
            );

            // Tính toán thống kê mới
            let newStatistics = { ...state.statistics };
            if (oldCategory && oldCategory.status !== updatedCategory.status) {
                if (updatedCategory.status) {
                    // Chuyển từ inactive sang active
                    newStatistics.totalActive = state.statistics.totalActive + 1;
                    newStatistics.totalInactive = Math.max(0, state.statistics.totalInactive - 1);
                } else {
                    // Chuyển từ active sang inactive
                    newStatistics.totalActive = Math.max(0, state.statistics.totalActive - 1);
                    newStatistics.totalInactive = state.statistics.totalInactive + 1;
                }
            }

            return {
                ...state,
                updateLoading: false,
                updateError: null,
                categories: updatedCategories,
                statistics: newStatistics,
            };
        }

        case UPDATE_CATEGORY_FAILURE:
            return {
                ...state,
                updateLoading: false,
                updateError: action.payload,
            };

        // Delete Category Cases
        case DELETE_CATEGORY_REQUEST:
            return {
                ...state,
                deleteLoading: true,
                deleteError: null,
            };

        case DELETE_CATEGORY_SUCCESS: {
            const deletedId = action.payload;
            const deletedCategory = state.categories.find(cat => cat._id === deletedId);
            const filteredCategories = state.categories.filter(category => category._id !== deletedId);

            let newStatistics = { ...state.statistics };
            if (deletedCategory) {
                if (deletedCategory.status) {
                    newStatistics.totalActive = Math.max(0, state.statistics.totalActive - 1);
                } else {
                    newStatistics.totalInactive = Math.max(0, state.statistics.totalInactive - 1);
                }
            }

            return {
                ...state,
                deleteLoading: false,
                deleteError: null,
                categories: filteredCategories,
                pagination: {
                    ...state.pagination,
                    totalCategory: Math.max(0, state.pagination.totalCategory - 1),
                },
                statistics: newStatistics,
            };
        }

        case DELETE_CATEGORY_FAILURE:
            return {
                ...state,
                deleteLoading: false,
                deleteError: action.payload,
            };

        default:
            return state;
    }
};

export default categoryReducer;
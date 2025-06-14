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
        case FETCH_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: action.payload.data.categories || [],
                pagination: {
                    page: action.payload.pagination?.page || action.payload.data.total?.currentPage || 1,
                    limit: action.payload.pagination?.limit || 12,
                    totalPages: action.payload.pagination?.totalPages || action.payload.data.total?.totalPage || 1,
                    totalCategory: action.payload.data.total?.totalCategory || 0,
                },
                statistics: {
                    totalActive: action.payload.data.total?.totalActive || 0,
                    totalInactive: action.payload.data.total?.totalInactive || 0,
                    currentPage: action.payload.data.total?.currentPage || 1,
                },
            };
        case FETCH_CATEGORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Create Category Cases
        case CREATE_CATEGORY_REQUEST:
            return {
                ...state,
                createLoading: true,
                createError: null,
            };
        case CREATE_CATEGORY_SUCCESS:
            const newCategory = action.payload.data;
            return {
                ...state,
                createLoading: false,
                categories: [newCategory, ...state.categories],
                pagination: {
                    ...state.pagination,
                    totalCategory: state.pagination.totalCategory + 1,
                },
                statistics: {
                    ...state.statistics,
                    totalActive: newCategory.status ? state.statistics.totalActive + 1 : state.statistics.totalActive,
                    totalInactive: !newCategory.status ? state.statistics.totalInactive + 1 : state.statistics.totalInactive,
                },
            };
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
        case UPDATE_CATEGORY_SUCCESS:
            const updatedCategory = action.payload.data;
            const oldCategory = state.categories.find(cat => cat._id === updatedCategory._id);

            return {
                ...state,
                updateLoading: false,
                categories: state.categories.map(category =>
                    category._id === updatedCategory._id ? updatedCategory : category
                ),
                statistics: {
                    ...state.statistics,
                    totalActive: oldCategory && oldCategory.status !== updatedCategory.status
                        ? (updatedCategory.status ? state.statistics.totalActive + 1 : state.statistics.totalActive - 1)
                        : state.statistics.totalActive,
                    totalInactive: oldCategory && oldCategory.status !== updatedCategory.status
                        ? (!updatedCategory.status ? state.statistics.totalInactive + 1 : state.statistics.totalInactive - 1)
                        : state.statistics.totalInactive,
                },
            };
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
        case DELETE_CATEGORY_SUCCESS:
            const deletedCategory = state.categories.find(cat => cat._id === action.payload);
            return {
                ...state,
                deleteLoading: false,
                categories: state.categories.filter(category => category._id !== action.payload),
                pagination: {
                    ...state.pagination,
                    totalCategory: state.pagination.totalCategory - 1,
                },
                statistics: {
                    ...state.statistics,
                    totalActive: deletedCategory && deletedCategory.status ? state.statistics.totalActive - 1 : state.statistics.totalActive,
                    totalInactive: deletedCategory && !deletedCategory.status ? state.statistics.totalInactive - 1 : state.statistics.totalInactive,
                },
            };
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
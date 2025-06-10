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
        limit: 10,
        totalPages: 1,
        totalCategory: 0,
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
                categories: action.payload.data.categories,
                pagination: {
                    page: action.payload.pagination.page,
                    limit: action.payload.pagination.limit,
                    totalPages: action.payload.data.total?.totalPage ?? 1,
                    totalCategory: action.payload.data.total?.totalCategory ?? 0,
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
            return {
                ...state,
                createLoading: false,
                categories: [action.payload.data, ...state.categories],
                pagination: {
                    ...state.pagination,
                    totalCategory: state.pagination.totalCategory + 1,
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
            return {
                ...state,
                updateLoading: false,
                categories: state.categories.map(category =>
                    category._id === action.payload.data._id
                        ? action.payload.data
                        : category
                ),
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
            return {
                ...state,
                deleteLoading: false,
                categories: state.categories.filter(category => category._id !== action.payload),
                pagination: {
                    ...state.pagination,
                    totalCategory: state.pagination.totalCategory - 1,
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
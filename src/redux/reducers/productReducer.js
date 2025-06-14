// reducers/productReducer.js
import {
    FETCH_PRODUCT_REQUEST,
    FETCH_PRODUCT_SUCCESS,
    FETCH_PRODUCT_FAILURE,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,
    CREATE_PRODUCT_FAILURE,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAILURE,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAILURE,
} from "../actions/productActions";

const initialState = {
    products: [],
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
        totalProduct: 0,
    },
    statistics: {
        totalActive: 0,
        totalInactive: 0,
        currentPage: 1,
    },
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload.data.products || [],
                pagination: {
                    page: action.payload.pagination?.page || action.payload.data.total?.currentPage || 1,
                    limit: action.payload.pagination?.limit || 12,
                    totalPages: action.payload.pagination?.totalPages || action.payload.data.total?.totalPage || 1,
                    totalProduct: action.payload.data.total?.totalProduct || 0,
                },
                statistics: {
                    totalActive: action.payload.data.total?.totalActive || 0,
                    totalInactive: action.payload.data.total?.totalInactive || 0,
                    currentPage: action.payload.data.total?.currentPage || 1,
                },
            };
        case FETCH_PRODUCT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Create Product Cases
        case CREATE_PRODUCT_REQUEST:
            return {
                ...state,
                createLoading: true,
                createError: null,
            };
        case CREATE_PRODUCT_SUCCESS:
            const newProduct = action.payload.data;
            return {
                ...state,
                createLoading: false,
                products: [newProduct, ...state.products],
                pagination: {
                    ...state.pagination,
                    totalProduct: state.pagination.totalProduct + 1,
                },
                statistics: {
                    ...state.statistics,
                    totalActive: newProduct.status ? state.statistics.totalActive + 1 : state.statistics.totalActive,
                    totalInactive: !newProduct.status ? state.statistics.totalInactive + 1 : state.statistics.totalInactive,
                },
            };
        case CREATE_PRODUCT_FAILURE:
            return {
                ...state,
                createLoading: false,
                createError: action.payload,
            };

        // Update Product Cases
        case UPDATE_PRODUCT_REQUEST:
            return {
                ...state,
                updateLoading: true,
                updateError: null,
            };
        case UPDATE_PRODUCT_SUCCESS:
            const updatedProduct = action.payload.data;
            const oldProduct = state.products.find(prod => prod._id === updatedProduct._id);

            return {
                ...state,
                updateLoading: false,
                products: state.products.map(product =>
                    product._id === updatedProduct._id ? updatedProduct : product
                ),
                statistics: {
                    ...state.statistics,
                    totalActive: oldProduct && oldProduct.status !== updatedProduct.status
                        ? (updatedProduct.status ? state.statistics.totalActive + 1 : state.statistics.totalActive - 1)
                        : state.statistics.totalActive,
                    totalInactive: oldProduct && oldProduct.status !== updatedProduct.status
                        ? (!updatedProduct.status ? state.statistics.totalInactive + 1 : state.statistics.totalInactive - 1)
                        : state.statistics.totalInactive,
                },
            };
        case UPDATE_PRODUCT_FAILURE:
            return {
                ...state,
                updateLoading: false,
                updateError: action.payload,
            };

        // Delete Product Cases
        case DELETE_PRODUCT_REQUEST:
            return {
                ...state,
                deleteLoading: true,
                deleteError: null,
            };
        case DELETE_PRODUCT_SUCCESS:
            const deletedProduct = state.products.find(prod => prod._id === action.payload);
            return {
                ...state,
                deleteLoading: false,
                products: state.products.filter(product => product._id !== action.payload),
                pagination: {
                    ...state.pagination,
                    totalProduct: state.pagination.totalProduct - 1,
                },
                statistics: {
                    ...state.statistics,
                    totalActive: deletedProduct && deletedProduct.status ? state.statistics.totalActive - 1 : state.statistics.totalActive,
                    totalInactive: deletedProduct && !deletedProduct.status ? state.statistics.totalInactive - 1 : state.statistics.totalInactive,
                },
            };
        case DELETE_PRODUCT_FAILURE:
            return {
                ...state,
                deleteLoading: false,
                deleteError: action.payload,
            };

        default:
            return state;
    }
};

export default productReducer; 
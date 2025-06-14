import { REVIEW_ACTION_TYPES } from '../actions/reviewActions';

const initialState = {
    // Reviews data
    reviews: [],
    selectedReview: null,
    pagination: {
        page: 1,
        limit: 10,
        totalPages: 0
    },
    total: {
        currentPage: 1,
        totalReview: 0,
        totalPage: 0
    },
    stats: {
        total: 0,
        approved: 0,
        pending: 0,
        averageRating: 0,
        ratingBreakdown: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        }
    },

    // Loading states
    loading: false,
    detailLoading: false,
    updateLoading: false,
    deleteLoading: false,
    statsLoading: false,
    searchLoading: false,

    // Messages
    message: '',
    error: '',

    // Search
    searchKeyword: '',
    searchResults: [],
};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        // Get all reviews
        case REVIEW_ACTION_TYPES.GET_ALL_REVIEWS_REQUEST:
            return {
                ...state,
                loading: true,
                error: ''
            };

        case REVIEW_ACTION_TYPES.GET_ALL_REVIEWS_SUCCESS:
            return {
                ...state,
                loading: false,
                reviews: action.payload.reviews,
                pagination: action.payload.pagination,
                total: action.payload.total,
                error: ''
            };

        case REVIEW_ACTION_TYPES.GET_ALL_REVIEWS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.message,
                reviews: []
            };

        // Get review details
        case REVIEW_ACTION_TYPES.GET_REVIEW_DETAILS_REQUEST:
            return {
                ...state,
                detailLoading: true,
                error: ''
            };

        case REVIEW_ACTION_TYPES.GET_REVIEW_DETAILS_SUCCESS:
            return {
                ...state,
                detailLoading: false,
                selectedReview: action.payload.review,
                error: ''
            };

        case REVIEW_ACTION_TYPES.GET_REVIEW_DETAILS_FAILURE:
            return {
                ...state,
                detailLoading: false,
                error: action.payload.message,
                selectedReview: null
            };

        // Update review status
        case REVIEW_ACTION_TYPES.UPDATE_REVIEW_STATUS_REQUEST:
            return {
                ...state,
                updateLoading: true,
                error: ''
            };

        case REVIEW_ACTION_TYPES.UPDATE_REVIEW_STATUS_SUCCESS:
            return {
                ...state,
                updateLoading: false,

                error: '',
                reviews: state.reviews.map(review =>
                    review._id === action.payload.reviewId
                        ? { ...review, ...action.payload.updatedData }
                        : review
                )
            };

        case REVIEW_ACTION_TYPES.UPDATE_REVIEW_STATUS_FAILURE:
            return {
                ...state,
                updateLoading: false,
                error: action.payload.message
            };

        // Delete review
        case REVIEW_ACTION_TYPES.DELETE_REVIEW_REQUEST:
            return {
                ...state,
                deleteLoading: true,
                error: ''
            };

        case REVIEW_ACTION_TYPES.DELETE_REVIEW_SUCCESS:
            return {
                ...state,
                deleteLoading: false,
                message: 'Đã ẩn đánh giá thành công',
                error: '',
                reviews: state.reviews.map(review =>
                    review._id === action.payload.reviewId
                        ? { ...review, status: false }
                        : review
                )
            };

        case REVIEW_ACTION_TYPES.DELETE_REVIEW_FAILURE:
            return {
                ...state,
                deleteLoading: false,
                error: action.payload.message
            };

        // Get review statistics
        case REVIEW_ACTION_TYPES.GET_REVIEW_STATS_REQUEST:
            return {
                ...state,
                statsLoading: true,
                error: ''
            };

        case REVIEW_ACTION_TYPES.GET_REVIEW_STATS_SUCCESS:
            return {
                ...state,
                statsLoading: false,
                stats: action.payload,
                error: ''
            };

        case REVIEW_ACTION_TYPES.GET_REVIEW_STATS_FAILURE:
            return {
                ...state,
                statsLoading: false,
                error: action.payload.message
            };

        // Search reviews
        case REVIEW_ACTION_TYPES.SEARCH_REVIEWS_REQUEST:
            return {
                ...state,
                searchLoading: true,
                error: ''
            };

        case REVIEW_ACTION_TYPES.SEARCH_REVIEWS_SUCCESS:
            return {
                ...state,
                searchLoading: false,
                searchResults: action.payload.reviews,
                searchKeyword: action.payload.keyword,
                pagination: action.payload.pagination,
                total: action.payload.total,
                error: ''
            };

        case REVIEW_ACTION_TYPES.SEARCH_REVIEWS_FAILURE:
            return {
                ...state,
                searchLoading: false,
                error: action.payload.message,
                searchResults: []
            };

        // Clear messages
        case REVIEW_ACTION_TYPES.CLEAR_REVIEW_MESSAGES:
            return {
                ...state,
                message: '',
                error: ''
            };

        default:
            return state;
    }
};

export default reviewReducer; 
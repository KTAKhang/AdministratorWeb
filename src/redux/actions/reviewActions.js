// Action Types
export const REVIEW_ACTION_TYPES = {
    // Get all reviews
    GET_ALL_REVIEWS_REQUEST: 'GET_ALL_REVIEWS_REQUEST',
    GET_ALL_REVIEWS_SUCCESS: 'GET_ALL_REVIEWS_SUCCESS',
    GET_ALL_REVIEWS_FAILURE: 'GET_ALL_REVIEWS_FAILURE',

    // Get review details
    GET_REVIEW_DETAILS_REQUEST: 'GET_REVIEW_DETAILS_REQUEST',
    GET_REVIEW_DETAILS_SUCCESS: 'GET_REVIEW_DETAILS_SUCCESS',
    GET_REVIEW_DETAILS_FAILURE: 'GET_REVIEW_DETAILS_FAILURE',

    // Update review status
    UPDATE_REVIEW_STATUS_REQUEST: 'UPDATE_REVIEW_STATUS_REQUEST',
    UPDATE_REVIEW_STATUS_SUCCESS: 'UPDATE_REVIEW_STATUS_SUCCESS',
    UPDATE_REVIEW_STATUS_FAILURE: 'UPDATE_REVIEW_STATUS_FAILURE',

    // Delete review
    DELETE_REVIEW_REQUEST: 'DELETE_REVIEW_REQUEST',
    DELETE_REVIEW_SUCCESS: 'DELETE_REVIEW_SUCCESS',
    DELETE_REVIEW_FAILURE: 'DELETE_REVIEW_FAILURE',

    // Get review statistics
    GET_REVIEW_STATS_REQUEST: 'GET_REVIEW_STATS_REQUEST',
    GET_REVIEW_STATS_SUCCESS: 'GET_REVIEW_STATS_SUCCESS',
    GET_REVIEW_STATS_FAILURE: 'GET_REVIEW_STATS_FAILURE',

    // Search reviews
    SEARCH_REVIEWS_REQUEST: 'SEARCH_REVIEWS_REQUEST',
    SEARCH_REVIEWS_SUCCESS: 'SEARCH_REVIEWS_SUCCESS',
    SEARCH_REVIEWS_FAILURE: 'SEARCH_REVIEWS_FAILURE',

    // Clear messages
    CLEAR_REVIEW_MESSAGES: 'CLEAR_REVIEW_MESSAGES',
};

// Action Creators

// Get all reviews
export const getAllReviewsRequest = (payload) => ({
    type: REVIEW_ACTION_TYPES.GET_ALL_REVIEWS_REQUEST,
    payload
});

export const getAllReviewsSuccess = (payload) => ({
    type: REVIEW_ACTION_TYPES.GET_ALL_REVIEWS_SUCCESS,
    payload
});

export const getAllReviewsFailure = (payload) => ({
    type: REVIEW_ACTION_TYPES.GET_ALL_REVIEWS_FAILURE,
    payload
});

// Get review details
export const getReviewDetailsRequest = (payload) => ({
    type: REVIEW_ACTION_TYPES.GET_REVIEW_DETAILS_REQUEST,
    payload
});

export const getReviewDetailsSuccess = (payload) => ({
    type: REVIEW_ACTION_TYPES.GET_REVIEW_DETAILS_SUCCESS,
    payload
});

export const getReviewDetailsFailure = (payload) => ({
    type: REVIEW_ACTION_TYPES.GET_REVIEW_DETAILS_FAILURE,
    payload
});

// Update review status
export const updateReviewStatusRequest = (payload) => ({
    type: REVIEW_ACTION_TYPES.UPDATE_REVIEW_STATUS_REQUEST,
    payload
});

export const updateReviewStatusSuccess = (payload) => ({
    type: REVIEW_ACTION_TYPES.UPDATE_REVIEW_STATUS_SUCCESS,
    payload
});

export const updateReviewStatusFailure = (payload) => ({
    type: REVIEW_ACTION_TYPES.UPDATE_REVIEW_STATUS_FAILURE,
    payload
});

// Delete review
export const deleteReviewRequest = (payload) => ({
    type: REVIEW_ACTION_TYPES.DELETE_REVIEW_REQUEST,
    payload
});

export const deleteReviewSuccess = (payload) => ({
    type: REVIEW_ACTION_TYPES.DELETE_REVIEW_SUCCESS,
    payload
});

export const deleteReviewFailure = (payload) => ({
    type: REVIEW_ACTION_TYPES.DELETE_REVIEW_FAILURE,
    payload
});

// Get review statistics
export const getReviewStatsRequest = () => ({
    type: REVIEW_ACTION_TYPES.GET_REVIEW_STATS_REQUEST
});

export const getReviewStatsSuccess = (payload) => ({
    type: REVIEW_ACTION_TYPES.GET_REVIEW_STATS_SUCCESS,
    payload
});

export const getReviewStatsFailure = (payload) => ({
    type: REVIEW_ACTION_TYPES.GET_REVIEW_STATS_FAILURE,
    payload
});

// Search reviews
export const searchReviewsRequest = (payload) => ({
    type: REVIEW_ACTION_TYPES.SEARCH_REVIEWS_REQUEST,
    payload
});

export const searchReviewsSuccess = (payload) => ({
    type: REVIEW_ACTION_TYPES.SEARCH_REVIEWS_SUCCESS,
    payload
});

export const searchReviewsFailure = (payload) => ({
    type: REVIEW_ACTION_TYPES.SEARCH_REVIEWS_FAILURE,
    payload
});

// Clear messages
export const clearReviewMessages = () => ({
    type: REVIEW_ACTION_TYPES.CLEAR_REVIEW_MESSAGES
});

// Thunk action creators for easier usage
export const getAllReviews = (page = 1, limit = 5, search = '', status = '') => {
    return getAllReviewsRequest({ page, limit, search, status });
};

export const getReviewDetails = (id) => {
    return getReviewDetailsRequest({ id });
};

export const updateReviewStatus = (id, status) => {
    return updateReviewStatusRequest({ id, status });
};

export const deleteReview = (id) => {
    return deleteReviewRequest({ id });
};

export const getReviewStats = () => {
    return getReviewStatsRequest();
};

export const searchReviews = (keyword, page = 1, limit = 5) => {
    return searchReviewsRequest({ keyword, page, limit });
}; 
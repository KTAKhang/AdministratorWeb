import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    REVIEW_ACTION_TYPES,
    getAllReviewsSuccess,
    getAllReviewsFailure,
    getReviewDetailsSuccess,
    getReviewDetailsFailure,
    updateReviewStatusSuccess,
    updateReviewStatusFailure,
    deleteReviewSuccess,
    deleteReviewFailure,
    getReviewStatsSuccess,
    getReviewStatsFailure,
    searchReviewsSuccess,
    searchReviewsFailure
} from '../actions/reviewActions';

const API_BASE_URL = 'https://youtube-fullstack-nodejs-forbeginer.onrender.com/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI3MjA5ODhhNjc5ZmM2YTkyYjAwNjgiLCJpc0FkbWluIjp0cnVlLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDk2MTczMTksImV4cCI6MTc1MjIwOTMxOX0.FroBfu3yrEL5_Qeb7IW4vMK8baSrDedAfjKHufg5Yw8';
};

// Helper function to create headers
const getAuthHeaders = () => {
    return {
        'accept': '*/*',
        'Authorization': `Bearer ${getAuthToken()}`
    };
};

// API call to get all reviews
const apiGetAllReviews = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/product-review/all`,
            {
                headers: getAuthHeaders()
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch reviews");
    }
};

// API call to get review by order detail ID
const apiGetReviewByOrderDetailId = async (orderDetailId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/product-review/order-detail/${orderDetailId}`,
            {
                headers: getAuthHeaders()
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch review details");
    }
};

// API call to update review
const apiUpdateReview = async (reviewId, updateData) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/product-review/update/${reviewId}`,
            updateData,
            {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update review");
    }
};

// Helper function to format review data for display
const formatReviewForDisplay = (review) => ({
    _id: review._id,
    user_id: {
        _id: review.user._id,
        user_name: review.user.user_name || review.user.email.split('@')[0],
        email: review.user.email
    },
    product_id: {
        _id: review.product._id,
        name: review.product.name,
        image: review.product.image || "https://via.placeholder.com/60"
    },
    rating: review.rating,
    comment: review.content,
    status: review.status,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt || review.createdAt
});

// Get all reviews saga
function* getAllReviewsSaga(action) {
    try {
        const { page = 1, limit = 10, search = '' } = action.payload || {};

        const data = yield call(apiGetAllReviews);

        if (data.success) {
            // Format reviews data
            let formattedReviews = data.data.map(review => formatReviewForDisplay(review));

            // Client-side search filtering if search term provided
            if (search) {
                formattedReviews = formattedReviews.filter(review =>
                    review.user_id.user_name.toLowerCase().includes(search.toLowerCase()) ||
                    review.user_id.email.toLowerCase().includes(search.toLowerCase()) ||
                    review.product_id.name.toLowerCase().includes(search.toLowerCase()) ||
                    review.comment.toLowerCase().includes(search.toLowerCase()) ||
                    review._id.toLowerCase().includes(search.toLowerCase())
                );
            }

            // Client-side pagination
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedReviews = formattedReviews.slice(startIndex, endIndex);

            const totalReviews = formattedReviews.length;
            const totalPages = Math.ceil(totalReviews / limit);

            yield put(getAllReviewsSuccess({
                reviews: paginatedReviews,
                pagination: {
                    page: page,
                    limit: limit,
                    totalPages: totalPages
                },
                total: {
                    currentPage: page,
                    totalReview: totalReviews,
                    totalPage: totalPages
                }
            }));

            // Removed toast success for routine data fetching
        } else {
            throw new Error(data.message || 'Failed to fetch reviews');
        }
    } catch (error) {
        console.error('Get all reviews error:', error);
        yield put(getAllReviewsFailure({
            message: error.message || 'Đã xảy ra lỗi khi tải danh sách đánh giá'
        }));
        toast.error('Có lỗi xảy ra khi tải dữ liệu: ' + error.message);
    }
}

// Get review details saga
function* getReviewDetailsSaga(action) {
    try {
        const { id } = action.payload;

        // Since we don't have a direct get review by ID endpoint,
        // we'll get all reviews and find the specific one
        const data = yield call(apiGetAllReviews);

        if (data.success) {
            const review = data.data.find(r => r._id === id);

            if (review) {
                const formattedReview = formatReviewForDisplay(review);
                yield put(getReviewDetailsSuccess({
                    review: formattedReview
                }));
            } else {
                throw new Error('Không tìm thấy đánh giá');
            }
        } else {
            throw new Error(data.message || 'Failed to fetch review details');
        }
    } catch (error) {
        console.error('Get review details error:', error);
        yield put(getReviewDetailsFailure({
            message: error.message || 'Đã xảy ra lỗi khi tải chi tiết đánh giá'
        }));
        toast.error('Có lỗi xảy ra khi tải chi tiết: ' + error.message);
    }
}

// Update review status saga
function* updateReviewStatusSaga(action) {
    try {
        const { id, status, rating, review_content } = action.payload;

        const updateData = {
            status: status
        };

        // Add rating and content if provided
        if (rating !== undefined) {
            updateData.rating = rating;
        }
        if (review_content !== undefined) {
            updateData.review_content = review_content;
        }

        const data = yield call(apiUpdateReview, id, updateData);

        if (data.success) {
            yield put(updateReviewStatusSuccess({
                reviewId: id,
                updatedData: updateData
            }));
            // Toast success handled in component to avoid duplicates
        } else {
            throw new Error(data.message || 'Failed to update review');
        }
    } catch (error) {
        console.error('Update review status error:', error);
        yield put(updateReviewStatusFailure({
            message: error.message || 'Đã xảy ra lỗi khi cập nhật đánh giá'
        }));
        toast.error('Có lỗi xảy ra khi cập nhật: ' + error.message);
    }
}

// Delete review saga (not available in API, so we'll simulate by setting status to false)
function* deleteReviewSaga(action) {
    try {
        const { id } = action.payload;

        // Since there's no delete endpoint, we'll update status to false
        const updateData = {
            status: false
        };

        const data = yield call(apiUpdateReview, id, updateData);

        if (data.success) {
            yield put(deleteReviewSuccess({
                reviewId: id
            }));
            toast.success('Đã ẩn đánh giá thành công');
        } else {
            throw new Error(data.message || 'Failed to delete review');
        }
    } catch (error) {
        console.error('Delete review error:', error);
        yield put(deleteReviewFailure({
            message: error.message || 'Đã xảy ra lỗi khi xóa đánh giá'
        }));
        toast.error('Có lỗi xảy ra khi xóa: ' + error.message);
    }
}

// Get review statistics saga
function* getReviewStatsSaga() {
    try {
        const data = yield call(apiGetAllReviews);

        if (data.success) {
            const reviews = data.data;

            // Calculate statistics
            const stats = {
                total: reviews.length,
                approved: reviews.filter(r => r.status === true).length,
                pending: reviews.filter(r => r.status === false).length,
                averageRating: reviews.length > 0
                    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                    : 0,
                ratingBreakdown: {
                    5: reviews.filter(r => r.rating === 5).length,
                    4: reviews.filter(r => r.rating === 4).length,
                    3: reviews.filter(r => r.rating === 3).length,
                    2: reviews.filter(r => r.rating === 2).length,
                    1: reviews.filter(r => r.rating === 1).length,
                }
            };

            yield put(getReviewStatsSuccess(stats));
        } else {
            throw new Error(data.message || 'Failed to get review statistics');
        }
    } catch (error) {
        console.error('Get review stats error:', error);
        yield put(getReviewStatsFailure({
            message: error.message || 'Đã xảy ra lỗi khi tải thống kê'
        }));
        toast.error('Có lỗi xảy ra khi tải thống kê: ' + error.message);
    }
}

// Search reviews saga
function* searchReviewsSaga(action) {
    try {
        const { keyword, page = 1, limit = 10 } = action.payload;

        // Use the getAllReviews saga with search parameter
        yield* getAllReviewsSaga({ payload: { page, limit, search: keyword } });
    } catch (error) {
        console.error('Search reviews error:', error);
        yield put(searchReviewsFailure({
            message: error.message || 'Đã xảy ra lỗi khi tìm kiếm'
        }));
    }
}

// Root saga
export default function* reviewSaga() {
    yield takeLatest(REVIEW_ACTION_TYPES.GET_ALL_REVIEWS_REQUEST, getAllReviewsSaga);
    yield takeLatest(REVIEW_ACTION_TYPES.GET_REVIEW_DETAILS_REQUEST, getReviewDetailsSaga);
    yield takeLatest(REVIEW_ACTION_TYPES.UPDATE_REVIEW_STATUS_REQUEST, updateReviewStatusSaga);
    yield takeLatest(REVIEW_ACTION_TYPES.DELETE_REVIEW_REQUEST, deleteReviewSaga);
    yield takeLatest(REVIEW_ACTION_TYPES.GET_REVIEW_STATS_REQUEST, getReviewStatsSaga);
    yield takeLatest(REVIEW_ACTION_TYPES.SEARCH_REVIEWS_REQUEST, searchReviewsSaga);
} 
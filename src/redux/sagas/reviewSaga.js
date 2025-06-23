import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
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
    return localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI3MjA5ODhhNjc5ZmM2YTkyYjAwNjgiLCJpc0FkbWluIjp0cnVlLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDk5NzM1MTYsImV4cCI6MTc1MjU2NTUxNn0.Bra4_sSiYgGgz4KPvEAcrUlYoWKqZwxNtXRjokKP4ak';
};

// Helper function to create headers
const getAuthHeaders = () => {
    return {
        'accept': '*/*',
        'Authorization': `Bearer ${getAuthToken()}`
    };
};

// API call to get all reviews with pagination and search
const apiGetAllReviews = async (page = 1, limit = 5, search = '') => {
    try {
        let url = `${API_BASE_URL}/product-review/all?page=${page}&limit=${limit}`;

        // Add search parameter if provided
        if (search && search.trim()) {
            url += `&search=${encodeURIComponent(search.trim())}`;
        }

        console.log('🔍 API URL:', url);

        const response = await axios.get(url, {
            headers: getAuthHeaders()
        });
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

// API call to get all products (dùng lại logic từ productSaga)
const apiGetAllProducts = async (page = 1, limit = 100) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
        `${API_BASE_URL}/product`,
        {
            params: { page, limit },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response.data;
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
        const { page = 1, limit = 5, search = '', status = '' } = action.payload || {};

        console.log('🔍 getAllReviewsSaga params:', { page, limit, search, status });

        // Lấy cả review và product song song để có đầy đủ thông tin sản phẩm
        const [reviewData, productData] = yield all([
            call(apiGetAllReviews, page, limit, search),
            call(apiGetAllProducts, 1, 1000) // lấy tối đa 1000 sản phẩm để map
        ]);

        if (reviewData.success && productData.status === 'OK') {
            // Tạo map sản phẩm để lấy thông tin đầy đủ
            const productMap = {};
            (productData.data.products || []).forEach(product => {
                productMap[product._id] = product;
            });

            console.log('🔍 Product map created:', Object.keys(productMap).length, 'products');
            console.log('🔍 Sample product:', productData.data.products?.[0]);

            // Format reviews data từ API response mới
            let formattedReviews = reviewData.data.reviews.map(review => {
                const productDetail = productMap[review.product._id];

                console.log('🔍 Review product ID:', review.product._id);
                console.log('🔍 Found product detail:', productDetail ? 'YES' : 'NO');
                if (productDetail) {
                    console.log('🔍 Product image:', productDetail.image);
                }

                return {
                    ...review,
                    // Giữ lại các trường cũ cho tương thích UI
                    user_id: {
                        _id: review.user._id,
                        user_name: review.user.user_name || review.user.email.split('@')[0], // Sử dụng user_name từ API
                        email: review.user.email,
                        avatar: review.user.avatar || null
                    },
                    product_id: {
                        _id: review.product._id,
                        name: review.product.name || productDetail?.name || '',
                        image: productDetail?.image || 'https://via.placeholder.com/60'
                    },
                    // Thêm thông tin chi tiết sản phẩm
                    productDetail: productDetail || null,
                    rating: review.rating,
                    comment: review.content,
                    status: review.status,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt || review.createdAt
                };
            });

            // Sử dụng pagination data từ API
            const apiTotal = reviewData.data.total;

            // Client-side status filtering if status filter provided
            let filteredTotal = apiTotal.totalReview;
            if (status !== '' && status !== 'all') {
                const statusBoolean = status === 'true' || status === true;
                formattedReviews = formattedReviews.filter(review => review.status === statusBoolean);
                filteredTotal = formattedReviews.length; // Update total to match filtered results
                console.log('🔍 Status filter applied:', status, 'Results:', formattedReviews.length);
            }

            yield put(getAllReviewsSuccess({
                reviews: formattedReviews,
                pagination: {
                    page: apiTotal.currentPage,
                    limit: limit,
                    totalPages: Math.ceil(filteredTotal / limit), // Recalculate total pages
                    total: filteredTotal // Use filtered total
                },
                total: {
                    currentPage: apiTotal.currentPage,
                    totalReview: filteredTotal, // Use filtered total
                    totalPage: Math.ceil(filteredTotal / limit),
                    totalApproved: apiTotal.totalApproved,
                    totalPending: apiTotal.totalPending
                }
            }));
        } else {
            throw new Error(reviewData.message || 'Failed to fetch reviews');
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

        // Lấy cả review và product data để có thông tin đầy đủ
        const [reviewData, productData] = yield all([
            call(apiGetAllReviews, 1, 1000), // Lấy nhiều reviews để tìm
            call(apiGetAllProducts, 1, 1000) // Lấy products để map
        ]);

        if (reviewData.success && productData.status === 'OK') {
            const review = reviewData.data.reviews.find(r => r._id === id);

            if (review) {
                // Tạo map sản phẩm
                const productMap = {};
                (productData.data.products || []).forEach(product => {
                    productMap[product._id] = product;
                });

                const productDetail = productMap[review.product._id];

                const formattedReview = {
                    ...review,
                    user_id: {
                        _id: review.user._id,
                        user_name: review.user.user_name || review.user.email.split('@')[0],
                        email: review.user.email,
                        avatar: review.user.avatar || null
                    },
                    product_id: {
                        _id: review.product._id,
                        name: review.product.name || productDetail?.name || '',
                        image: productDetail?.image || 'https://via.placeholder.com/60'
                    },
                    productDetail: productDetail || null,
                    rating: review.rating,
                    comment: review.content,
                    status: review.status,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt || review.createdAt
                };

                yield put(getReviewDetailsSuccess({
                    review: formattedReview
                }));
            } else {
                throw new Error('Không tìm thấy đánh giá');
            }
        } else {
            throw new Error(reviewData.message || 'Failed to fetch review details');
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
        // Lấy tất cả reviews để tính thống kê (có thể cần lấy nhiều trang)
        const data = yield call(apiGetAllReviews, 1, 1000); // Lấy tối đa 1000 reviews

        if (data.success) {
            const reviews = data.data.reviews;
            const apiTotal = data.data.total;

            // Sử dụng thống kê từ API nếu có, nếu không thì tính toán
            const stats = {
                totalReview: apiTotal.totalReview,
                totalApproved: apiTotal.totalApproved,
                totalPending: apiTotal.totalPending,
                total: apiTotal.totalReview,
                approved: apiTotal.totalApproved,
                pending: apiTotal.totalPending,
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
        const { keyword, page = 1, limit = 5 } = action.payload;

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
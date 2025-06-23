// sagas/productSaga.js
import { call, put, takeLatest, all } from "redux-saga/effects";
import axios from "axios";
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

const API_BASE_URL = "https://youtube-fullstack-nodejs-forbeginer.onrender.com/api";

// Helper function to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    };
};

// Fetch products with new API structure
const fetchProducts = async ({ page = 1, limit = 12, search }) => {
    const token = localStorage.getItem('token');

    let url = `${API_BASE_URL}/product?page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
        }
    });
    return response.data;
};

// API call to get all categories (dùng lại logic từ categorySaga)
const apiGetAllCategories = async (page = 1, limit = 100) => {
    const response = await axios.get(
        `${API_BASE_URL}/category?page=${page}&limit=${limit}`,
        {
            headers: {
                accept: "*/*",
            },
        }
    );
    return response.data;
};

// Create product
const createProduct = async (formData) => {
    const token = localStorage.getItem('token');

    // Debug: Log status value trong formData
    console.log('Status trong formData (create):', formData.get('status'));

    // Ensure all required fields are present
    const requiredFields = ['name', 'category_id', 'price', 'short_desc', 'detail_desc', 'quantity', 'factory', 'target', 'status'];
    for (const field of requiredFields) {
        if (!formData.get(field) && formData.get(field) !== 'false') {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    // Add default value for sold if not present
    if (!formData.get('sold')) {
        formData.append('sold', '0');
    }

    // Status sẽ được xử lý từ form, không cần default value ở đây

    // Debug: Log tất cả formData trước khi gửi
    console.log('All formData before sending (create):');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await axios.post(`${API_BASE_URL}/product/create`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Update product
const updateProduct = async (id, formData) => {
    const token = localStorage.getItem('token');

    // Debug: Log status value trong formData
    console.log('Status trong formData (update):', formData.get('status'));

    // Ensure all required fields are present
    const requiredFields = ['name', 'category_id', 'price', 'short_desc', 'detail_desc', 'quantity', 'factory', 'target', 'status'];
    for (const field of requiredFields) {
        if (!formData.get(field) && formData.get(field) !== 'false') {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    // Add default value for sold if not present
    if (!formData.get('sold')) {
        formData.append('sold', '0');
    }

    // Debug: Log tất cả formData trước khi gửi
    console.log('All formData before sending (update):');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await axios.put(`${API_BASE_URL}/product/update/${id}`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Delete product
const deleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/product/delete/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

// Saga handlers
function* handleFetchProducts(action) {
    try {
        const { page = 1, limit = 12, search } = action.payload;

        // Lấy cả product và category song song
        const [productResponse, categoryResponse] = yield all([
            call(fetchProducts, { page, limit, search }),
            call(apiGetAllCategories, 1, 1000) // lấy tối đa 1000 category
        ]);

        if (productResponse.status === 'OK') {
            // Tạo map category
            const categoryMap = {};
            if (categoryResponse.data && categoryResponse.data.categories) {
                categoryResponse.data.categories.forEach(category => {
                    categoryMap[category._id] = category;
                    // Map theo tên category để tương thích với API hiện tại
                    categoryMap[category.name] = category;
                });
            }

            // Map thông tin category chi tiết vào từng sản phẩm
            const productsWithCategoryDetail = (productResponse.data.products || []).map(product => ({
                ...product,
                categoryDetail: categoryMap[product.category_name] || null,
                // Giữ lại trường cũ cho tương thích
                category_id: product.category_id || (categoryMap[product.category_name]?._id)
            }));

            // Handle new API response structure
            const processedData = {
                status: productResponse.status,
                message: productResponse.message,
                data: {
                    products: productsWithCategoryDetail,
                    total: {
                        currentPage: productResponse.data.total?.currentPage || page,
                        totalProduct: productResponse.data.total?.totalProduct || 0,
                        totalPage: productResponse.data.total?.totalPage || 1,
                        totalActive: productResponse.data.total?.totalActive || 0,
                        totalInactive: productResponse.data.total?.totalInactive || 0,
                    }
                },
                pagination: {
                    page: page,
                    limit: limit,
                    totalPages: productResponse.data.total?.totalPage || 1,
                }
            };

            yield put({ type: FETCH_PRODUCT_SUCCESS, payload: processedData });
        } else {
            throw new Error(productResponse.message || 'Failed to fetch products');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put({ type: FETCH_PRODUCT_FAILURE, payload: errorMessage });
    }
}

function* handleCreateProduct(action) {
    try {
        const { formData, onSuccess } = action.payload;
        const response = yield call(createProduct, formData);
        yield put({ type: CREATE_PRODUCT_SUCCESS, payload: response });
        if (onSuccess) {
            onSuccess();
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put({ type: CREATE_PRODUCT_FAILURE, payload: errorMessage });
    }
}

function* handleUpdateProduct(action) {
    try {
        const { id, formData, onSuccess } = action.payload;
        const response = yield call(updateProduct, id, formData);
        yield put({ type: UPDATE_PRODUCT_SUCCESS, payload: response });
        if (onSuccess) {
            onSuccess();
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put({ type: UPDATE_PRODUCT_FAILURE, payload: errorMessage });
    }
}

function* handleDeleteProduct(action) {
    try {
        const { id, onSuccess } = action.payload;
        const response = yield call(deleteProduct, id);
        yield put({ type: DELETE_PRODUCT_SUCCESS, payload: id });
        if (onSuccess) {
            onSuccess();
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        yield put({ type: DELETE_PRODUCT_FAILURE, payload: errorMessage });
    }
}

// Root saga
export default function* productSaga() {
    yield takeLatest(FETCH_PRODUCT_REQUEST, handleFetchProducts);
    yield takeLatest(CREATE_PRODUCT_REQUEST, handleCreateProduct);
    yield takeLatest(UPDATE_PRODUCT_REQUEST, handleUpdateProduct);
    yield takeLatest(DELETE_PRODUCT_REQUEST, handleDeleteProduct);
} 
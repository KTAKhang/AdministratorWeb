import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Card,
    Table,
    Button,
    Tag,
    Input,
    Space,
    Typography,
    Statistic,
    Row,
    Col,
    Badge,
    Avatar,
    Tooltip,
    Rate,
    Alert
} from "antd";
import {
    EyeOutlined,
    EditOutlined,
    SearchOutlined,
    StarOutlined,
    UserOutlined,
    CheckCircleOutlined,
    StopOutlined,
    ExclamationCircleOutlined,
    CommentOutlined,
    ShoppingOutlined,
    ReloadOutlined
} from "@ant-design/icons";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import ViewReviewDetail from "./ViewReviewDetail";
import UpdateReviewStatus from "./UpdateReviewStatus";
import {
    getAllReviews,
    getReviewStats,
    updateReviewStatus,
    clearReviewMessages
} from "../../redux/actions/reviewActions";

const { Title, Text } = Typography;

// Sample data for reviews
const sampleReviews = [
    {
        _id: "r1",
        user_id: {
            _id: "u1",
            name: "Nguyễn Văn A",
            email: "nguyenvana@email.com"
        },
        product_id: {
            _id: "p1",
            name: "iPhone 14 Pro Max",
            image: "https://via.placeholder.com/60"
        },
        order_id: "o1",
        rating: 5,
        comment: "Sản phẩm rất tốt, chất lượng tuyệt vời. Giao hàng nhanh chóng.",
        status: true, // true = hiển thị, false = ẩn
        createdAt: "2024-06-10T09:00:00Z"
    },
    {
        _id: "r2",
        user_id: {
            _id: "u2",
            name: "Trần Thị B",
            email: "tranthib@email.com"
        },
        product_id: {
            _id: "p2",
            name: "Samsung Galaxy S24",
            image: "https://via.placeholder.com/60"
        },
        order_id: "o2",
        rating: 4,
        comment: "Sản phẩm ổn, nhưng pin hơi yếu.",
        status: true,
        createdAt: "2024-06-09T14:30:00Z"
    },
    {
        _id: "r3",
        user_id: {
            _id: "u3",
            name: "Lê Văn C",
            email: "levanc@email.com"
        },
        product_id: {
            _id: "p3",
            name: "iPad Air",
            image: "https://via.placeholder.com/60"
        },
        order_id: "o3",
        rating: 1,
        comment: "Sản phẩm không như mong đợi, màn hình bị lỗi.",
        status: false, // đã ẩn vì đánh giá tiêu cực
        createdAt: "2024-06-08T10:00:00Z"
    }
];

const ReviewManagement = () => {
    const dispatch = useDispatch();
    const {
        reviews,
        loading,
        updateLoading,
        statsLoading,
        pagination: apiPagination,
        total,
        stats: apiStats,
        message,
        error
    } = useSelector(state => state.review);

    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] = useState(false);
    const [hasInitialLoad, setHasInitialLoad] = useState(false);

    // Filter reviews based on search text
    const filteredReviews = reviews.filter(review =>
        review.user_id?.user_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        review.product_id?.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    // Calculate statistics from API or fallback to local calculation
    const stats = apiStats?.total ? apiStats : {
        total: filteredReviews.length,
        approved: filteredReviews.filter(r => r.status).length,
        pending: filteredReviews.filter(r => !r.status).length,
        averageRating: filteredReviews.length > 0 ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1) : 0,
    };

    // Fetch reviews - chỉ gọi khi cần thiết
    const fetchReviews = useCallback((page = 1, pageSize = 10, search = "", force = false) => {
        if (force || !hasInitialLoad || reviews.length === 0) {
            dispatch(getAllReviews(page, pageSize, search));
        }
    }, [dispatch, hasInitialLoad, reviews.length]);

    // Handle search với debounce
    const handleSearch = useCallback(
        debounce((value) => {
            setSearchText(value);
            setPagination((prev) => ({ ...prev, current: 1 }));
            dispatch(getAllReviews(1, pagination.pageSize, value));
        }, 500),
        [dispatch, pagination.pageSize]
    );

    // Load data khi component mount - chỉ 1 lần
    useEffect(() => {
        if (!hasInitialLoad) {
            fetchReviews(pagination.current, pagination.pageSize, searchText, true);
            dispatch(getReviewStats());
            setHasInitialLoad(true);
        }
    }, [fetchReviews, pagination.current, pagination.pageSize, searchText, hasInitialLoad, dispatch]);

    // Reset hasInitialLoad khi component unmount
    useEffect(() => {
        return () => {
            setHasInitialLoad(false);
        };
    }, []);

    // Update pagination when API data changes
    useEffect(() => {
        if (total?.totalReview !== undefined) {
            setPagination(prev => ({
                ...prev,
                total: total.totalReview
            }));
        }
    }, [total]);

    // Refresh data
    const handleRefresh = () => {
        fetchReviews(pagination.current, pagination.pageSize, "", true);
        dispatch(getReviewStats());
        setSearchText("");
    };

    // Handle pagination change
    const handlePaginationChange = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize || 10
        }));
        dispatch(getAllReviews(page, pageSize || 10, searchText));
    };

    const handleViewDetail = (review) => {
        setSelectedReview(review);
        setIsViewDetailModalVisible(true);
    };

    const handleCloseViewDetailModal = () => {
        setIsViewDetailModalVisible(false);
        setSelectedReview(null);
    };

    const handleUpdateStatusClick = (review) => {
        setSelectedReview(review);
        setIsUpdateStatusModalVisible(true);
    };

    const handleUpdateStatusSuccess = (id, newStatus) => {
        dispatch(updateReviewStatus(id, newStatus));
        setIsUpdateStatusModalVisible(false);
        setSelectedReview(null);
        toast.success("Cập nhật trạng thái review thành công");
        handleRefresh();
    };

    const handleCloseUpdateStatusModal = () => {
        setIsUpdateStatusModalVisible(false);
        setSelectedReview(null);
    };

    // Handle success/error messages
    useEffect(() => {
        if (message) {
            toast.success(message);
            dispatch(clearReviewMessages());
        }
        if (error) {
            toast.error(error);
            dispatch(clearReviewMessages());
        }
    }, [message, error, dispatch]);

    const getRatingColor = (rating) => {
        if (rating >= 4) return '#52c41a';
        if (rating >= 3) return '#faad14';
        return '#ff4d4f';
    };

    const columns = [
        {
            title: "Sản phẩm",
            key: "product",
            render: (_, record) => (
                <Space>
                    <Avatar
                        src={record.product_id?.image}
                        icon={<ShoppingOutlined />}
                        style={{ backgroundColor: '#13C2C2' }}
                    />
                    <Text strong style={{ color: '#0D364C' }}>
                        {record.product_id?.name || 'N/A'}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            render: (rating) => (
                <Tag
                    color={getRatingColor(rating)}
                    style={{
                        borderRadius: '16px',
                        padding: '4px 12px',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    {rating}/5 sao ⭐
                </Tag>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Badge
                    status={status ? 'success' : 'error'}
                    text={
                        <Tag
                            color={status ? '#52c41a' : '#ff4d4f'}
                            icon={status ? <CheckCircleOutlined /> : <StopOutlined />}
                            style={{
                                borderRadius: '16px',
                                fontWeight: '500',
                                padding: '4px 12px'
                            }}
                        >
                            {status ? 'Hiển thị' : 'Ẩn'}
                        </Tag>
                    }
                />
            )
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetail(record)}
                            style={{
                                color: '#13C2C2',
                                borderColor: '#13C2C2'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = `#13C2C210`;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Cập nhật trạng thái">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleUpdateStatusClick(record)}
                            style={{
                                color: '#0D364C',
                                borderColor: '#0D364C'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = `#0D364C10`;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{
            padding: '24px',
            background: `linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)`,
            minHeight: '100vh'
        }}>
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={6}>
                    <Card
                        style={{
                            borderRadius: '12px',
                            border: `1px solid #13C2C230`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Statistic
                            title={<Text style={{ color: '#0D364C' }}>Tổng reviews</Text>}
                            value={stats.total}
                            prefix={<CommentOutlined style={{ color: '#13C2C2' }} />}
                            valueStyle={{ color: '#13C2C2', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card
                        style={{
                            borderRadius: '12px',
                            border: `1px solid #13C2C230`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Statistic
                            title={<Text style={{ color: '#0D364C' }}>Đang hiển thị</Text>}
                            value={stats.approved}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card
                        style={{
                            borderRadius: '12px',
                            border: `1px solid #13C2C230`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Statistic
                            title={<Text style={{ color: '#0D364C' }}>Đang ẩn</Text>}
                            value={stats.pending}
                            prefix={<StopOutlined style={{ color: '#ff4d4f' }} />}
                            valueStyle={{ color: '#ff4d4f', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card
                        style={{
                            borderRadius: '12px',
                            border: `1px solid #13C2C230`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Statistic
                            title={<Text style={{ color: '#0D364C' }}>Đánh giá TB</Text>}
                            value={stats.averageRating}
                            prefix={<StarOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
                            suffix="⭐"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Content Card */}
            <Card
                style={{
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    border: `1px solid #13C2C220`
                }}
                title={
                    <Space>
                        <Avatar
                            style={{ backgroundColor: '#13C2C2' }}
                            icon={<CommentOutlined />}
                        />
                        <Title level={3} style={{ margin: 0, color: '#0D364C' }}>
                            Quản lý Reviews
                        </Title>
                    </Space>
                }
            >
                {/* Error Alert */}
                {error && (
                    <Alert
                        message="Lỗi tải dữ liệu"
                        description={error}
                        type="error"
                        closable
                        style={{ marginBottom: '16px' }}
                        action={
                            <Button size="small" danger onClick={handleRefresh}>
                                Thử lại
                            </Button>
                        }
                    />
                )}

                {/* Header Actions */}
                <div style={{
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <Input.Search
                        placeholder="Tìm kiếm review..."
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{
                            width: '320px',
                            maxWidth: '100%'
                        }}
                        size="large"
                        prefix={<SearchOutlined style={{ color: '#13C2C2' }} />}
                        allowClear
                        onSearch={(value) => handleSearch(value)}
                        disabled={loading}
                    />
                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleRefresh}
                            size="large"
                            loading={loading}
                            style={{
                                borderColor: '#13C2C2',
                                color: '#13C2C2',
                                borderRadius: '8px'
                            }}
                        >
                            Làm mới
                        </Button>
                    </Space>
                </div>

                {/* Table */}
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={filteredReviews}
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => (
                            <Text style={{ color: '#0D364C' }}>
                                Hiển thị {range[0]}-{range[1]} trong tổng số {total} reviews
                            </Text>
                        ),
                        onChange: handlePaginationChange,
                    }}
                    style={{
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}
                    rowClassName={(record, index) =>
                        index % 2 === 0 ? '' : 'ant-table-row-alternate'
                    }
                    locale={{
                        emptyText: loading ? 'Đang tải...' : 'Không có dữ liệu'
                    }}
                />
            </Card>

            {/* Modals */}
            {selectedReview && (
                <ViewReviewDetail
                    visible={isViewDetailModalVisible}
                    reviewData={selectedReview}
                    onClose={handleCloseViewDetailModal}
                />
            )}

            {selectedReview && (
                <UpdateReviewStatus
                    visible={isUpdateStatusModalVisible}
                    reviewData={selectedReview}
                    onClose={handleCloseUpdateStatusModal}
                    onSuccess={handleUpdateStatusSuccess}
                />
            )}

            <style>
                {`
          .ant-table-row-alternate {
            background-color: #13C2C205 !important;
          }
          
          .ant-table-thead > tr > th {
            background-color: #0D364C !important;
            color: white !important;
            font-weight: 600 !important;
            border-bottom: 2px solid #13C2C2 !important;
          }
          
          .ant-table-tbody > tr:hover > td {
            background-color: #13C2C210 !important;
          }
          
          .ant-pagination-item-active {
            border-color: #13C2C2 !important;
            background-color: #13C2C2 !important;
          }
          
          .ant-pagination-item-active a {
            color: white !important;
          }
          
          .ant-pagination-item:hover {
            border-color: #13C2C2 !important;
          }
          
          .ant-pagination-item:hover a {
            color: #13C2C2 !important;
          }
          
          .ant-input:focus,
          .ant-input-focused {
            border-color: #13C2C2 !important;
            box-shadow: 0 0 0 2px #13C2C220 !important;
          }
        `}
            </style>
        </div>
    );
};

export default ReviewManagement; 
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
    Alert,
    Spin
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
    SyncOutlined
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
    const reduxState = useSelector(state => state.review);

    const {
        reviews,
        loading,
        error,
        pagination: reduxPagination,
        total
    } = reduxState;

    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] = useState(false);

    const fetchReviews = useCallback((page = 1, pageSize = 5, search = "") => {
        const requestPayload = {
            page,
            limit: pageSize,
            ...(search && { search })
        };

        dispatch(getAllReviews(requestPayload.page, requestPayload.limit, requestPayload.search || ''));
    }, [dispatch]);

    // ✅ Load dữ liệu ban đầu
    useEffect(() => {
        fetchReviews(1, 5);
    }, []); // Chỉ chạy 1 lần khi mount

    // ✅ Sync Redux pagination với local state
    useEffect(() => {
        if (reduxPagination) {
            const newPagination = {
                current: reduxPagination.page || 1,
                pageSize: reduxPagination.limit || 5,
                total: reduxPagination.total || 0
            };

            setPagination(newPagination);
        }
    }, [reduxPagination]);

    // ✅ Handle search
    const handleSearch = useCallback(
        debounce((value) => {
            setSearchText(value);
            setPagination(prev => {
                const newPag = { ...prev, current: 1 };
                return newPag;
            });

            fetchReviews(1, pagination.pageSize, value);
        }, 500),
        [fetchReviews, pagination.pageSize]
    );

    // ✅ Handle table change
    const handleTableChange = (paginationConfig, filters, sorter) => {
        const { current, pageSize } = paginationConfig;

        // Cập nhật local state trước
        setPagination(prev => {
            const newPag = {
                ...prev,
                current: current || 1,
                pageSize: pageSize || prev.pageSize
            };
            return newPag;
        });

        fetchReviews(current || 1, pageSize || pagination.pageSize, searchText);
    };

    // ✅ Handle refresh
    const handleRefresh = () => {
        fetchReviews(pagination.current, pagination.pageSize, searchText);
    };

    // Statistics
    const stats = {
        total: total?.totalReview || 0,
        approved: total?.totalApproved || 0,
        pending: total?.totalPending || 0,
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
        if (error) {
            toast.error(error);
            dispatch(clearReviewMessages());
        }
    }, [error, dispatch]);

    const getRatingColor = (rating) => {
        if (rating >= 4) return '#52c41a';
        if (rating >= 3) return '#faad14';
        return '#ff4d4f';
    };

    const columns = [
        {
            title: "Khách hàng",
            key: "customer",
            render: (_, record) => (
                <Space>
                    <Avatar
                        src={record.user_id?.avatar}
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: record.user_id?.avatar ? 'transparent' : '#52c41a',
                            border: '2px solid #f0f0f0'
                        }}
                        onError={() => false}
                    />
                    <div>
                        <Text strong style={{ color: '#0D364C' }}>
                            {record.user_id?.user_name || 'N/A'}
                        </Text>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                            {record.user_id?.email || 'N/A'}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: "Sản phẩm",
            key: "product",
            render: (_, record) => (
                <Space>
                    <Avatar
                        src={record.productDetail?.image || record.product_id?.image}
                        icon={<ShoppingOutlined />}
                        style={{ backgroundColor: '#13C2C2' }}
                    />
                    <div>
                        <Text strong style={{ color: '#0D364C' }}>
                            {record.productDetail?.name || record.product_id?.name || 'N/A'}
                        </Text>
                        {record.productDetail?.price && (
                            <div style={{ fontSize: '12px', color: '#888' }}>
                                Giá: {record.productDetail.price.toLocaleString('vi-VN')}₫
                            </div>
                        )}
                    </div>
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
            title: "Nội dung",
            dataIndex: "comment",
            key: "comment",
            render: (comment) => (
                <Text
                    style={{
                        maxWidth: '200px',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                    title={comment}
                >
                    {comment || 'N/A'}
                </Text>
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
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => (
                <Text type="secondary">
                    {date ? new Date(date).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : 'N/A'}
                </Text>
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
                            style={{ color: '#13C2C2' }}
                        />
                    </Tooltip>
                    <Tooltip title="Cập nhật trạng thái">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleUpdateStatusClick(record)}
                            style={{ color: '#0D364C' }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    if (error) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    message="Lỗi tải dữ liệu"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button size="small" onClick={handleRefresh}>
                            Thử lại
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{
            padding: '24px',
            background: `linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)`,
            minHeight: '100vh'
        }}>
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
                        <Statistic
                            title={<Text style={{ color: '#0D364C' }}>Tổng reviews</Text>}
                            value={stats.total}
                            prefix={<CommentOutlined style={{ color: '#13C2C2' }} />}
                            valueStyle={{ color: '#13C2C2', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
                        <Statistic
                            title={<Text style={{ color: '#0D364C' }}>Đang hiển thị</Text>}
                            value={stats.approved}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
                        <Statistic
                            title={<Text style={{ color: '#0D364C' }}>Đang ẩn</Text>}
                            value={stats.pending}
                            prefix={<StopOutlined style={{ color: '#ff4d4f' }} />}
                            valueStyle={{ color: '#ff4d4f', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Content */}
            <Card
                style={{
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    border: `1px solid #13C2C220`
                }}
                title={
                    <Space>
                        <Avatar style={{ backgroundColor: '#13C2C2' }} icon={<CommentOutlined />} />
                        <Title level={3} style={{ margin: 0, color: '#0D364C' }}>
                            Quản lý Reviews
                        </Title>
                    </Space>
                }
            >
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
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: '320px', maxWidth: '100%' }}
                        size="large"
                        prefix={<SearchOutlined style={{ color: '#13C2C2' }} />}
                        allowClear
                        onSearch={(value) => handleSearch(value)}
                    />
                    <Button
                        onClick={handleRefresh}
                        icon={<SyncOutlined />}
                        loading={loading}
                        style={{ borderColor: '#13C2C2', color: '#13C2C2' }}
                    >
                        Làm mới
                    </Button>
                </div>

                {/* Table */}
                <Spin spinning={loading}>
                    <Table
                        rowKey="_id"
                        columns={columns}
                        dataSource={reviews || []}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            pageSizeOptions: ['5', '10', '20', '50'],
                            showTotal: (total, range) => (
                                <Text style={{ color: '#0D364C' }}>
                                    Hiển thị {range[0]}-{range[1]} trong tổng số {total} reviews
                                </Text>
                            ),
                            onChange: (page, pageSize) => {
                                handleTableChange({ current: page, pageSize }, {}, {});
                            },
                            onShowSizeChange: (current, size) => {
                                handleTableChange({ current, pageSize: size }, {}, {});
                            },
                        }}
                        style={{ borderRadius: '12px', overflow: 'hidden' }}
                    />
                </Spin>
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
        </div>
    );
};

export default ReviewManagement; 
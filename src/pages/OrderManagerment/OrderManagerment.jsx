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
  Spin,
  Alert,
  Select
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  StopOutlined,
  UserOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CarOutlined,
  QuestionCircleOutlined,
  CopyOutlined
} from "@ant-design/icons";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { fetchOrderRequest } from "../../redux/actions/orderActions";
import ViewOrderDetail from "./ViewOrderDetail";
import UpdateOrderStatus from "./UpdateOrderStatus";

const { Title, Text } = Typography;

const OrderManagement = () => {
  const dispatch = useDispatch();
  const reduxState = useSelector(state => state.order);


  const {
    orders,
    loading,
    error,
    pagination: reduxPagination
  } = reduxState;


  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // Thêm state cho status filter
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // State để lưu stats từ API
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    totalValue: 0
  });

  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] = useState(false);



  const fetchOrders = useCallback((page = 1, pageSize = 5, search = "", status = "") => {

    // Tạo search query kết hợp status và search text
    let combinedSearch = search;
    if (status && status !== 'all') {
      // Nếu có status filter, thêm vào search query
      combinedSearch = status + (search ? ` ${search}` : '');
    }

    const requestPayload = {
      page,
      limit: pageSize,
      ...(combinedSearch && { search: combinedSearch })
    };

    // Sử dụng API chính với search kết hợp
    dispatch(fetchOrderRequest(requestPayload));
  }, [dispatch]);

    // State riêng để lưu toàn bộ orders cho stats (không ảnh hưởng table pagination)
  const [allOrdersForStats, setAllOrdersForStats] = useState([]);

  // Fetch ALL orders for stats calculation (separate from table data)
  const fetchOrderStats = useCallback(async () => {
    try {
    
      
      // Gọi API trực tiếp thay vì qua Redux để không ảnh hưởng table
      const token = localStorage.getItem('token');
      const response = await fetch(
        'https://youtube-fullstack-nodejs-forbeginer.onrender.com/api/order/status?page=1&limit=1000&status=',
        {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      
      const data = await response.json();
    
      
      if (data.success && data.data?.orders) {
        setAllOrdersForStats(data.data.orders);
       
      }
      
      
    } catch (error) {
      console.error('Error fetching order stats:', error);
    }
  }, []);

  // ✅ Load dữ liệu ban đầu
  useEffect(() => {
    fetchOrders(1, 5);
    fetchOrderStats(); // Load stats từ API
  }, [fetchOrders, fetchOrderStats]); // Chỉ chạy 1 lần khi mount

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

  // ✅ Update stats when allOrdersForStats changes (not just table orders)
  useEffect(() => {
    if (allOrdersForStats && Array.isArray(allOrdersForStats)) {
      const newStats = {
        total: allOrdersForStats.length,
        pending: allOrdersForStats.filter(o => o.order_status?.name === 'PENDING').length,
        processing: allOrdersForStats.filter(o => ['PROCESSING', 'CONFIRMED'].includes(o.order_status?.name)).length,
        completed: allOrdersForStats.filter(o => ['DELIVERED', 'COMPLETED'].includes(o.order_status?.name)).length,
        totalValue: allOrdersForStats.reduce((sum, o) => sum + (o.total_price || 0), 0)
      };
      

      
      // Log all unique status names to understand what we're working with
      const statusNames = [...new Set(allOrdersForStats.map(o => o.order_status?.name).filter(Boolean))];
      console.log('All unique status names found:', statusNames);
      
      // Log status distribution
      const statusCounts = {};
      allOrdersForStats.forEach(order => {
        const status = order.order_status?.name;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
   
      
      setOrderStats(newStats);
    } else {
      // Set default stats if no orders
      setOrderStats({
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        totalValue: 0
      });
    }
  }, [allOrdersForStats]);

  // ✅ Handle search với debounce 2 giây - API call only
  const debouncedSearch = useCallback(
    debounce((value) => {
      setPagination(prev => ({ ...prev, current: 1 }));
      fetchOrders(1, pagination.pageSize, value, selectedStatus);
    }, 2000), // API call after 2 seconds of no typing
    [fetchOrders, pagination.pageSize, selectedStatus]
  );

  // ✅ Handle search input change - immediate UI update
  const handleSearch = (value) => {
    setSearchText(value); // Update UI immediately
    debouncedSearch(value); // Debounced API call
  };

  // ✅ Handle table change với log chi tiết
  const handleTableChange = (paginationConfig) => {


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


    fetchOrders(current || 1, pageSize || pagination.pageSize, searchText, selectedStatus);

  };

  // ✅ Handle refresh
  const handleRefresh = () => {
    fetchOrders(pagination.current, pagination.pageSize, searchText, selectedStatus);
    fetchOrderStats(); // Refresh stats cùng với orders
  };

  // ✅ Handle status filter change
  const handleStatusChange = (status) => {
    setSelectedStatus(status || "");
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchOrders(1, pagination.pageSize, searchText, status || "");
  };

  // ✅ Handle clear search and filters
  const handleClearSearch = () => {
    setSearchText("");
    setSelectedStatus("");
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchOrders(1, pagination.pageSize, "", "");
  };



  // Use orderStats from state instead of calculating from orders
  const stats = orderStats;

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsViewDetailModalVisible(true);
  };

  const handleCloseViewDetailModal = () => {
    setIsViewDetailModalVisible(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatusClick = (order) => {
    setSelectedOrder(order);
    setIsUpdateStatusModalVisible(true);
  };

  const handleUpdateStatusSuccess = (id) => {
    toast.success(`Cập nhật trạng thái đơn hàng ${id} thành công`);
    setIsUpdateStatusModalVisible(false);
    setSelectedOrder(null);
    fetchOrders(pagination.current, pagination.pageSize, "", selectedStatus);
    // Refresh stats sau khi update
    fetchOrderStats();
  };

  const handleCloseUpdateStatusModal = () => {
    setIsUpdateStatusModalVisible(false);
    setSelectedOrder(null);
  };

  // ✅ Handle copy ID
  const handleCopyId = (id, type = 'Order') => {
    navigator.clipboard.writeText(id).then(() => {
      toast.success(`Đã sao chép ${type} ID: ${id}`);
    }).catch(() => {
      toast.error('Không thể sao chép ID');
    });
  };

  const getStatusInfo = (status) => {
    const statusName = status?.name || 'UNKNOWN';
    switch (statusName) {
      case 'PENDING':
        return { color: '#faad14', text: 'Chờ xử lý', icon: <ClockCircleOutlined /> };
      case 'CONFIRMED':
        return { color: '#13C2C2', text: 'Đang xử lý', icon: <SyncOutlined spin /> };
      case 'SHIPPED':
        return { color: '#1890ff', text: 'Đang giao', icon: <CarOutlined /> };
      case 'DELIVERED':
        return { color: '#52c41a', text: 'Đã giao', icon: <CheckCircleOutlined /> };
      case 'CANCELLED':
        return { color: '#ff4d4f', text: 'Đã hủy', icon: <StopOutlined /> };
      case 'RETURNED':
        return { color: '#722ed1', text: 'Đã hoàn trả', icon: <SyncOutlined /> };
      default:
        return { color: 'default', text: status?.description || 'Không xác định', icon: <QuestionCircleOutlined /> };
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order_id",
      key: "order_id",
      render: (order_id) => (
        <Space>
          <Text
            strong
            style={{
              color: '#0D364C',
              cursor: 'pointer'
            }}
            onClick={() => handleCopyId(order_id)}
            title={`Click để copy: ${order_id}`}
          >
            {order_id || 'N/A'}
          </Text>
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopyId(order_id)}
            style={{ color: '#13C2C2' }}
          />
        </Space>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => (
        <Space>
          <Avatar
            icon={<UserOutlined />}
            style={{ backgroundColor: '#13C2C2' }}
          />
          <div>
            <Text strong style={{ color: '#0D364C', display: 'block', fontSize: '16px' }}>
              {record.receiver_name || 'N/A'}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.receiver_phone || 'N/A'}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => (
        <Text type="secondary">
          {record.user?.email || 'N/A'}
        </Text>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) => (
        <Tag color="#13C2C2" style={{
          borderRadius: '16px',
          padding: '4px 12px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {price?.toLocaleString('vi-VN') || '0'} VNĐ
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "order_status",
      key: "order_status",
      render: (status) => {
        const statusInfo = getStatusInfo(status);
        return (
          <Badge
            status={statusInfo.color === '#52c41a' ? 'success' : 'processing'}
            text={
              <Tag
                color={statusInfo.color}
                icon={statusInfo.icon}
                style={{
                  borderRadius: '16px',
                  fontWeight: '500',
                  padding: '4px 12px'
                }}
              >
                {statusInfo.text}
              </Tag>
            }
          />
        );
      }
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
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
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
              title={<Text style={{ color: '#0D364C' }}>Tổng đơn hàng</Text>}
              value={stats.total || 0}
              prefix={<ShoppingCartOutlined style={{ color: '#13C2C2' }} />}
              valueStyle={{ color: '#13C2C2', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Chờ xử lý</Text>}
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Đang xử lý</Text>}
              value={stats.processing}
              prefix={<SyncOutlined style={{ color: '#13C2C2' }} />}
              valueStyle={{ color: '#13C2C2', fontWeight: 'bold' }}
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
            <Avatar style={{ backgroundColor: '#13C2C2' }} icon={<ShoppingCartOutlined />} />
            <Title level={3} style={{ margin: 0, color: '#0D364C' }}>
              Quản lý Đơn hàng
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
          <Space size="middle" style={{ flex: 1, flexWrap: 'wrap' }}>
            <Input.Search
              placeholder="Tìm kiếm theo ID đơn hàng, tên khách hàng, email..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '320px', maxWidth: '100%' }}
              size="large"
              prefix={<SearchOutlined style={{ color: '#13C2C2' }} />}
              allowClear
              onSearch={(value) => handleSearch(value)}
            />
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: '200px' }}
              size="large"
              allowClear
              value={selectedStatus || undefined}
              onChange={handleStatusChange}
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'PENDING', label: 'Chờ xử lý' },
                { value: 'CONFIRMED', label: 'Đã xác nhận' },
                { value: 'SHIPPED', label: 'Đang giao' },
                { value: 'DELIVERED', label: 'Đã giao' },
                { value: 'CANCELLED', label: 'Đã hủy' },
                { value: 'RETURNED', label: 'Đã hoàn trả' },
              ]}
            />
            {(searchText || selectedStatus) && (
              <Button
                onClick={handleClearSearch}
                style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </Space>
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
            rowKey={(record) => record.order_id || record._id}
            columns={columns}
            dataSource={orders || []}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              showTotal: (total, range) => (
                <Text style={{ color: '#0D364C' }}>
                  Hiển thị {range[0]}-{range[1]} trong tổng số {total} đơn hàng
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
      {selectedOrder && (
        <ViewOrderDetail
          visible={isViewDetailModalVisible}
          orderData={selectedOrder}
          onClose={handleCloseViewDetailModal}
        />
      )}

      {selectedOrder && (
        <UpdateOrderStatus
          visible={isUpdateStatusModalVisible}
          orderData={selectedOrder}
          onClose={handleCloseUpdateStatusModal}
          onSuccess={handleUpdateStatusSuccess}
        />
      )}
    </div>
  );
};

export default OrderManagement;
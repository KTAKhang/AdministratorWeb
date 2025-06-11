// 🚨 DEBUG VERSION - Thêm nhiều log để tìm lỗi
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
  Alert
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  StopOutlined,
  UserOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CarOutlined,
  QuestionCircleOutlined
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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] = useState(false);



  const fetchOrders = useCallback((page = 1, pageSize = 5, search = "") => {

    const requestPayload = {
      page,
      limit: pageSize,
      ...(search && { search })  // Chỉ thêm search nếu có
    };


    dispatch(fetchOrderRequest(requestPayload));

  }, [dispatch]);

  // ✅ Load dữ liệu ban đầu
  useEffect(() => {

    fetchOrders(1, 5);
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

      fetchOrders(1, pagination.pageSize, value);

    }, 500),
    [fetchOrders, pagination.pageSize]
  );

  // ✅ Handle table change với log chi tiết
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


    fetchOrders(current || 1, pageSize || pagination.pageSize, searchText);

  };

  // ✅ Handle refresh
  const handleRefresh = () => {

    fetchOrders(pagination.current, pagination.pageSize, searchText);
  };



  // Statistics
  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.order_status?.name === 'PENDING')?.length || 0,
    processing: orders?.filter(o => o.order_status?.name === 'PROCESSING')?.length || 0,
    completed: orders?.filter(o => ['DELIVERED', 'COMPLETED'].includes(o.order_status?.name))?.length || 0,
    totalValue: orders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0
  };

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

  const handleUpdateStatusSuccess = (id, newStatusId) => {
    toast.success(`Cập nhật trạng thái đơn hàng ${id} thành công`);
    setIsUpdateStatusModalVisible(false);
    setSelectedOrder(null);
    fetchOrders(pagination.current, pagination.pageSize);
  };

  const handleCloseUpdateStatusModal = () => {
    setIsUpdateStatusModalVisible(false);
    setSelectedOrder(null);
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
        <Text strong style={{ color: '#0D364C' }}>
          {order_id?.slice(-8)?.toUpperCase() || 'N/A'}
        </Text>
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
            <Text strong style={{ color: '#0D364C', display: 'block' }}>
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
        <Col xs={24} sm={6}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Tổng đơn hàng</Text>}
              value={pagination.total || stats.total}
              prefix={<ShoppingCartOutlined style={{ color: '#13C2C2' }} />}
              valueStyle={{ color: '#13C2C2', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Chờ xử lý</Text>}
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Đang xử lý</Text>}
              value={stats.processing}
              prefix={<SyncOutlined style={{ color: '#13C2C2' }} />}
              valueStyle={{ color: '#13C2C2', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Tổng doanh thu</Text>}
              value={stats.totalValue}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
              formatter={(value) => `${value?.toLocaleString('vi-VN')} VNĐ`}
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
          <Input.Search
            placeholder="Tìm kiếm đơn hàng..."
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
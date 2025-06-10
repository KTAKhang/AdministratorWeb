import { useState, useEffect, useCallback } from "react";
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
  Tooltip
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
// import CreateOrder from "./CreateOrder"; // Assuming order creation is not from this page
// import DeleteOrder from "./DeleteOrder"; // Assuming order deletion is not from this page
import ViewOrderDetail from "./ViewOrderDetail"; // Modal to view order details
import UpdateOrderStatus from "./UpdateOrderStatus"; // Modal to update order status

const { Title, Text } = Typography;

// Sample data for orders based on the provided schema
const sampleOrders = [
  {
    _id: "o1",
    user_id: "u1", // Sample user ID
    total_price: 10500000,
    note: "Giao hàng giờ hành chính",
    receiver_address: "123 ABC Street, District 1",
    receiver_name: "Nguyễn Văn A",
    receiver_phone: 1234567890,
    order_status_id: "os1", // Sample status ID (e.g., Pending)
    status: true,
    createdAt: "2024-06-10T09:00:00Z",
    // Sample order details (nested)
    order_details: [
      { product_id: "p1", quantity: 1, price: 10000000 },
      { product_id: "p3", quantity: 1, price: 500000 }
    ]
  },
  {
    _id: "o2",
    user_id: "u2", // Sample user ID
    total_price: 15000000,
    note: "",
    receiver_address: "456 XYZ Road, District 5",
    receiver_name: "Trần Thị B",
    receiver_phone: 9876543210,
    order_status_id: "os2", // Sample status ID (e.g., Processing)
    status: true,
    createdAt: "2024-06-09T14:30:00Z",
     order_details: [
      { product_id: "p2", quantity: 1, price: 15000000 }
    ]
  },
   {
    _id: "o3",
    user_id: "u1", // Sample user ID
    total_price: 750000,
    note: "",
    receiver_address: "789 QWE Avenue, District 3",
    receiver_name: "Nguyễn Văn A",
    receiver_phone: 1234567890,
    order_status_id: "os3", // Sample status ID (e.g., Shipped)
    status: true,
    createdAt: "2024-06-08T10:00:00Z",
     order_details: [
      { product_id: "p3", quantity: 1, price: 500000 },
      { product_id: "p3", quantity: 0.5, price: 250000 }, // Example of fractional quantity if applicable
    ]
  }
];

const OrderManagement = () => {
  const [orders, setOrders] = useState(sampleOrders);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: sampleOrders.length,
  });
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] = useState(false);

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.order_status_id === 'os1').length,
    processing: orders.filter(o => o.order_status_id === 'os2').length,
    completed: orders.filter(o => ['os3', 'os4'].includes(o.order_status_id)).length,
    totalValue: orders.reduce((sum, o) => sum + o.total_price, 0)
  };

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 500),
    []
  );

  useEffect(() => {
    const filtered = sampleOrders.filter(order =>
      order.receiver_name.toLowerCase().includes(searchText.toLowerCase()) ||
      order.receiver_phone.toString().includes(searchText) ||
      order._id.toLowerCase().includes(searchText.toLowerCase())
    );
    setOrders(filtered);
    setPagination(prev => ({ ...prev, total: filtered.length }));
  }, [searchText]);

  // TODO: Implement fetchOrders when using real API
  // const fetchOrders = async (page, pageSize, keyword) => { ... };

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
    const updatedOrders = orders.map(order =>
      order._id === id ? { ...order, order_status_id: newStatusId } : order
    );
    setOrders(updatedOrders);
  };

  const handleCloseUpdateStatusModal = () => {
    setIsUpdateStatusModalVisible(false);
    setSelectedOrder(null);
  };

  const getStatusInfo = (statusId) => {
    switch(statusId) {
      case 'os1':
        return { color: '#faad14', text: 'Chờ xử lý', icon: <ClockCircleOutlined /> };
      case 'os2':
        return { color: '#13C2C2', text: 'Đang xử lý', icon: <SyncOutlined spin /> };
      case 'os3':
        return { color: '#1890ff', text: 'Đang giao', icon: <CarOutlined /> };
      case 'os4':
        return { color: '#52c41a', text: 'Đã giao', icon: <CheckCircleOutlined /> };
      case 'os5':
        return { color: '#ff4d4f', text: 'Đã hủy', icon: <StopOutlined /> };
      default:
        return { color: 'default', text: 'Không xác định', icon: <QuestionCircleOutlined /> };
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      render: (_id) => (
        <Text strong style={{ color: '#0D364C' }}>{_id}</Text>
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
              {record.receiver_name}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.receiver_phone}
            </Text>
          </div>
        </Space>
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
          {price?.toLocaleString('vi-VN')} VNĐ
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "order_status_id",
      key: "order_status_id",
      render: (statusId) => {
        const status = getStatusInfo(statusId);
        return (
          <Badge 
            status={status.color === '#52c41a' ? 'success' : 'processing'} 
            text={
              <Tag 
                color={status.color}
                icon={status.icon}
                style={{ 
                  borderRadius: '16px',
                  fontWeight: '500',
                  padding: '4px 12px'
                }}
              >
                {status.text}
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
          {new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}
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
              title={<Text style={{ color: '#0D364C' }}>Tổng đơn hàng</Text>}
              value={stats.total}
              prefix={<ShoppingCartOutlined style={{ color: '#13C2C2' }} />}
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
              title={<Text style={{ color: '#0D364C' }}>Chờ xử lý</Text>}
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
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
              title={<Text style={{ color: '#0D364C' }}>Đang xử lý</Text>}
              value={stats.processing}
              prefix={<SyncOutlined style={{ color: '#13C2C2' }} />}
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
              title={<Text style={{ color: '#0D364C' }}>Tổng doanh thu</Text>}
              value={stats.totalValue}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
              formatter={(value) => `${value?.toLocaleString('vi-VN')} VNĐ`}
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
              icon={<ShoppingCartOutlined />} 
            />
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
            style={{ 
              width: '320px',
              maxWidth: '100%'
            }}
            size="large"
            prefix={<SearchOutlined style={{ color: '#13C2C2' }} />}
            allowClear
            onSearch={(value) => handleSearch(value)}
          />
        </div>

        {/* Table */}
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={orders}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <Text style={{ color: '#0D364C' }}>
                Hiển thị {range[0]}-{range[1]} trong tổng số {total} đơn hàng
              </Text>
            ),
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10,
              }));
            },
          }}
          style={{
            borderRadius: '12px',
            overflow: 'hidden'
          }}
          rowClassName={(record, index) => 
            index % 2 === 0 ? '' : 'ant-table-row-alternate'
          }
        />
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

export default OrderManagement;

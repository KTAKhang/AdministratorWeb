import { useState, useEffect, useCallback } from "react";
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Image, 
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
  EditOutlined, 
  PlusOutlined, 
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  StopOutlined,
  MailOutlined
} from "@ant-design/icons";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import CreateCustomer from "./CreateCustomer";
import UpdateCustomer from "./UpdateCustomer";
import ViewCustomerDetail from "./ViewCustomerDetail";

const { Title, Text } = Typography;

// Sample data for customers based on the provided schema
const sampleCustomers = [
  {
    _id: "u1",
    user_name: "john_doe",
    email: "john.doe@example.com",
    avatar: "https://via.placeholder.com/60x60?text=User1",
    role_id: "r1", // Sample role ID
    status: true,
    createdAt: "2024-06-01T10:00:00Z"
  },
  {
    _id: "u2",
    user_name: "jane_smith",
    email: "jane.smith@example.com",
    avatar: "https://via.placeholder.com/60x60?text=User2",
    role_id: "r2", // Sample role ID
    status: true,
    createdAt: "2024-06-02T11:00:00Z"
  },
  {
    _id: "u3",
    user_name: "peter_jones",
    email: "peter.jones@example.com",
    avatar: "https://via.placeholder.com/60x60?text=User3",
    role_id: "r1", // Sample role ID
    status: false,
    createdAt: "2024-06-03T12:00:00Z"
  }
];

const CustomerManagement = () => {
  const [customers, setCustomers] = useState(sampleCustomers);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: sampleCustomers.length,
  });
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);

  // Calculate statistics
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status).length,
    inactive: customers.filter(c => !c.status).length,
  };

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 500),
    []
  );

  useEffect(() => {
    const filtered = sampleCustomers.filter(customer =>
      customer.user_name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setCustomers(filtered);
    setPagination(prev => ({ ...prev, total: filtered.length }));
  }, [searchText]);

  const handleCreateSuccess = (newCustomerData) => {
    toast.success("Thêm khách hàng thành công");
    setIsCreateModalVisible(false);
    const newCustomer = { 
      _id: `u${sampleCustomers.length + 1}`, 
      ...newCustomerData,
      createdAt: new Date().toISOString(),
    };
    sampleCustomers.push(newCustomer);
    setCustomers([...sampleCustomers]);
    setPagination(prev => ({...prev, total: sampleCustomers.length}));
  };

  const handleOpenUpdateModal = (customer) => {
    setSelectedCustomer(customer);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateSuccess = (id, updatedValues) => {
    toast.success(`Cập nhật thông tin khách hàng thành công`);
    setIsUpdateModalVisible(false);
    setSelectedCustomer(null);
    const updatedCustomers = customers.map(customer => 
      customer._id === id ? { ...customer, ...updatedValues } : customer
    );
    setCustomers(updatedCustomers);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setSelectedCustomer(null);
  };

  const handleOpenViewDetailModal = (customer) => {
    setSelectedCustomer(customer);
    setIsViewDetailModalVisible(true);
  };

  const handleCloseViewDetailModal = () => {
    setIsViewDetailModalVisible(false);
    setSelectedCustomer(null);
  };

  const columns = [
    {
      title: "Khách hàng",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar 
            src={record.avatar}
            icon={!record.avatar && <UserOutlined />}
            style={{ 
              backgroundColor: !record.avatar ? '#13C2C2' : undefined
            }}
          />
          <div>
            <Text strong style={{ color: '#0D364C', display: 'block' }}>
              {record.user_name}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <MailOutlined style={{ marginRight: '4px' }} />
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role_id",
      key: "role_id",
      render: (role) => (
        <Tag color="#13C2C2" style={{ 
          borderRadius: '16px',
          padding: '4px 12px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {role === 'r1' ? 'Khách hàng' : 'VIP'}
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
              {status ? 'Hoạt động' : 'Đã khóa'}
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
              onClick={() => handleOpenViewDetailModal(record)}
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
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text"
              icon={<EditOutlined />} 
              onClick={() => handleOpenUpdateModal(record)}
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
        <Col xs={24} sm={8}>
          <Card 
            style={{ 
              borderRadius: '12px',
              border: `1px solid #13C2C230`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Tổng khách hàng</Text>}
              value={stats.total}
              prefix={<TeamOutlined style={{ color: '#13C2C2' }} />}
              valueStyle={{ color: '#13C2C2', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            style={{ 
              borderRadius: '12px',
              border: `1px solid #13C2C230`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Đang hoạt động</Text>}
              value={stats.active}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            style={{ 
              borderRadius: '12px',
              border: `1px solid #13C2C230`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Đã khóa</Text>}
              value={stats.inactive}
              prefix={<StopOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f', fontWeight: 'bold' }}
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
              icon={<TeamOutlined />} 
            />
            <Title level={3} style={{ margin: 0, color: '#0D364C' }}>
              Quản lý Khách hàng
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
            placeholder="Tìm kiếm khách hàng..."
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
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsCreateModalVisible(true)}
            size="large"
            style={{ 
              backgroundColor: '#13C2C2', 
              borderColor: '#13C2C2',
              borderRadius: '8px',
              fontWeight: '500',
              boxShadow: `0 4px 12px #13C2C240`
            }}
          >
            Thêm Khách hàng
          </Button>
        </div>

        {/* Table */}
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={customers}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <Text style={{ color: '#0D364C' }}>
                Hiển thị {range[0]}-{range[1]} trong tổng số {total} khách hàng
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
      <CreateCustomer
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />

      {selectedCustomer && (
        <UpdateCustomer
          visible={isUpdateModalVisible}
          customerData={selectedCustomer}
          onClose={handleCloseUpdateModal}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {selectedCustomer && (
        <ViewCustomerDetail
          visible={isViewDetailModalVisible}
          customerData={selectedCustomer}
          onClose={handleCloseViewDetailModal}
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

export default CustomerManagement;

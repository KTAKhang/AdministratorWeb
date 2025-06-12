import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Tooltip,
  Alert
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  StopOutlined,
  MailOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import UpdateCustomer from "./UpdateCustomer";
import ViewCustomerDetail from "./ViewCustomerDetail";
import {
  getAllUsersRequest,
  setUserSearchText,
  setUserPagination
} from "../../redux/actions/userActions";

const { Title, Text } = Typography;

const CustomerManagement = () => {
  const dispatch = useDispatch();

  // Redux state
  const {
    users,
    loading,
    error,
    searchText,
    pagination,
    stats: userStats
  } = useSelector(state => state.user);

  // Local state for modals
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Statistics từ Redux state
  const stats = userStats;

  // Fetch users từ Redux - chỉ gọi khi cần thiết
  const fetchUsers = useCallback((page = 1, limit = 10, force = false) => {
    // Chỉ fetch nếu chưa có data hoặc được ép buộc
    if (force || !hasInitialLoad || users.length === 0) {
      dispatch(getAllUsersRequest(page, limit));
    }
  }, [dispatch, hasInitialLoad, users.length]);

  // Handle search với debounce
  const handleSearch = useCallback(
    debounce((value) => {
      dispatch(setUserSearchText(value));
    }, 500),
    [dispatch]
  );

  // Load data khi component mount - chỉ 1 lần
  useEffect(() => {
    if (!hasInitialLoad) {
      fetchUsers(pagination.current, pagination.pageSize, true);
      setHasInitialLoad(true);
    }
  }, [fetchUsers, pagination.current, pagination.pageSize, hasInitialLoad]);

  // Reset hasInitialLoad khi component unmount
  useEffect(() => {
    return () => {
      setHasInitialLoad(false);
    };
  }, []);

  // Refresh data
  const handleRefresh = () => {
    fetchUsers(pagination.current, pagination.pageSize, true);
    dispatch(setUserSearchText(""));
  };

  const handleOpenUpdateModal = (customer) => {
    setSelectedCustomer(customer);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateSuccess = (id, updatedValues) => {
    toast.success(`Cập nhật thông tin khách hàng thành công`);
    setIsUpdateModalVisible(false);
    setSelectedCustomer(null);
    // Refresh data sau khi cập nhật
    handleRefresh();
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
            icon={<UserOutlined />}
            style={{
              backgroundColor: '#13C2C2'
            }}
            onError={() => false}
          />
          <div>
            <Text strong style={{ color: '#0D364C', display: 'block' }}>
              {record.user_name}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <UserOutlined style={{ marginRight: '4px' }} />
              ID: {record._id.slice(-6)}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role_name",
      key: "role_name",
      render: (roleName) => (
        <Tag color="#13C2C2" style={{
          borderRadius: '16px',
          padding: '4px 12px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {roleName || 'Khách hàng'}
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
            placeholder="Tìm kiếm khách hàng..."
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

        {/* Table - Chỉ sử dụng loading của Table, không wrap thêm Spin */}
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={users}
          loading={loading}
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
              dispatch(setUserPagination({
                current: page,
                pageSize: pageSize || 10,
              }));
              // Fetch new data khi thay đổi pagination
              fetchUsers(page, pageSize || 10, true);
            },
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

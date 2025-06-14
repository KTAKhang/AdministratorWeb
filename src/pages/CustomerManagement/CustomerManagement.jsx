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
  Alert,
  Spin
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
  ReloadOutlined,
  SyncOutlined
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
  const reduxState = useSelector(state => state.user);
  const {
    users,
    loading,
    error,
    searchText: reduxSearchText,
    pagination: reduxPagination,
    stats: userStats
  } = reduxState;

  // Local state
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // Modal states
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);

  // Fetch users function
  const fetchUsers = useCallback((page = 1, pageSize = 5, search = "") => {
    dispatch(getAllUsersRequest(page, pageSize));
    if (search !== reduxSearchText) {
      dispatch(setUserSearchText(search));
    }
  }, [dispatch, reduxSearchText]);

  // Load initial data
  useEffect(() => {
    fetchUsers(1, 5);
  }, []);

  // Sync Redux pagination with local state
  useEffect(() => {
    if (reduxPagination) {
      const newPagination = {
        current: reduxPagination.current || 1,
        pageSize: reduxPagination.pageSize || 5,
        total: reduxPagination.total || 0
      };
      setPagination(newPagination);
    }
  }, [reduxPagination]);

  // Handle search with debounce
  const handleSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setPagination(prev => ({ ...prev, current: 1 }));
      fetchUsers(1, pagination.pageSize, value);
    }, 500),
    [fetchUsers, pagination.pageSize]
  );

  // Handle table change
  const handleTableChange = (paginationConfig, filters, sorter) => {
    const { current, pageSize } = paginationConfig;
    setPagination(prev => ({
      ...prev,
      current: current || 1,
      pageSize: pageSize || prev.pageSize
    }));
    dispatch(setUserPagination({
      current: current || 1,
      pageSize: pageSize || pagination.pageSize,
    }));
    fetchUsers(current || 1, pageSize || pagination.pageSize, searchText);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchUsers(pagination.current, pagination.pageSize, searchText);
  };

  // Statistics từ Redux state - now uses API statistics
  const stats = userStats;

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
              style={{ color: '#13C2C2' }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenUpdateModal(record)}
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
      {/* Statistics Cards - Now using API statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Tổng khách hàng</Text>}
              value={pagination.total || stats.total}
              prefix={<TeamOutlined style={{ color: '#13C2C2' }} />}
              valueStyle={{ color: '#13C2C2', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Đang hoạt động</Text>}
              value={stats.active}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Đã khóa</Text>}
              value={stats.inactive}
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
            <Avatar style={{ backgroundColor: '#13C2C2' }} icon={<TeamOutlined />} />
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

        {/* Table - Enhanced pagination with new API structure */}
        <Spin spinning={loading}>
          <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={users || []}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              showTotal: (total, range) => (
                <Text style={{ color: '#0D364C' }}>
                  Hiển thị {range[0]}-{range[1]} trong tổng số {total} khách hàng
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
    </div>
  );
};

export default CustomerManagement;

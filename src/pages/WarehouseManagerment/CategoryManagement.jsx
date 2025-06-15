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
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import CreateCategory from "./CreateCategory";
import UpdateCategory from "./UpdateCategory";
import ViewCategoryDetail from "./ViewCategoryDetail";
import { fetchCategoryRequest } from '../../redux/actions/categoryActions';

const { Title, Text } = Typography;

const CategoryManagement = () => {
  const dispatch = useDispatch();

  // Redux state
  const reduxState = useSelector(state => state.category);
  const { categories, loading, error, pagination: reduxPagination, statistics } = reduxState;

  // Local state
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);

  // Fetch categories function
  const fetchCategories = useCallback((page = 1, pageSize = 5, search = "") => {
    const requestPayload = {
      page,
      limit: pageSize,
      ...(search && { search })
    };
    dispatch(fetchCategoryRequest(requestPayload));
  }, [dispatch]);

  // Load initial data - only once on mount
  useEffect(() => {
    fetchCategories(1, 5);
  }, []); // Empty dependency array to run only once

  // Sync Redux pagination with local state
  useEffect(() => {
    if (reduxPagination) {
      const newPagination = {
        current: reduxPagination.page || 1,
        pageSize: reduxPagination.limit || 5,
        total: reduxPagination.totalCategory || 0
      };
      setPagination(newPagination);
    }
  }, [reduxPagination]);

  // Handle search with debounce - fix dependency issue
  const handleSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setPagination(prev => ({ ...prev, current: 1 }));
      fetchCategories(1, 5, value); // Use fixed pageSize to avoid dependency
    }, 500),
    [fetchCategories]
  );

  // Handle table change
  const handleTableChange = (paginationConfig, filters, sorter) => {
    const { current, pageSize } = paginationConfig;
    const newCurrent = current || 1;
    const newPageSize = pageSize || pagination.pageSize;

    setPagination(prev => ({
      ...prev,
      current: newCurrent,
      pageSize: newPageSize
    }));

    fetchCategories(newCurrent, newPageSize, searchText);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchCategories(pagination.current, pagination.pageSize, searchText);
  };

  // Statistics - use API statistics when available, fallback to client-side calculation
  const stats = {
    total: statistics?.totalActive + statistics?.totalInactive || (Array.isArray(categories) ? categories.length : 0),
    active: statistics?.totalActive || (Array.isArray(categories) ? categories.filter(cat => cat?.status).length : 0),
    inactive: statistics?.totalInactive || (Array.isArray(categories) ? categories.filter(cat => !cat?.status).length : 0)
  };

  const handleCreateSuccess = () => {
    toast.success("Thêm category thành công");
    setIsCreateModalVisible(false);
    handleRefresh();
  };

  const handleOpenUpdateModal = (category) => {
    setSelectedCategory(category);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateSuccess = (id, updatedValues) => {
    toast.success("Cập nhật category thành công");
    setIsUpdateModalVisible(false);
    setSelectedCategory(null);
    handleRefresh();
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setSelectedCategory(null);
  };

  const handleOpenViewDetailModal = (category) => {
    setSelectedCategory(category);
    setIsViewDetailModalVisible(true);
  };

  const handleCloseViewDetailModal = () => {
    setIsViewDetailModalVisible(false);
    setSelectedCategory(null);
  };

  const columns = [
    {
      title: "Category",
      key: "category",
      render: (_, record) => (
        <Space>
          <Avatar
            src={record.image}
            icon={<AppstoreOutlined />}
            style={{
              backgroundColor: '#13C2C2'
            }}
            onError={() => false}
          />
          <div>
            <Text strong style={{ color: '#0D364C', display: 'block' }}>
              {record.name}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <AppstoreOutlined style={{ marginRight: '4px' }} />
              ID: {record._id?.slice(-6) || 'N/A'}
            </Text>
          </div>
        </Space>
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
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Tổng categories</Text>}
              value={pagination.total || stats.total}
              prefix={<AppstoreOutlined style={{ color: '#13C2C2' }} />}
              valueStyle={{ color: '#13C2C2', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Đang hiển thị</Text>}
              value={stats.active}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Đang ẩn</Text>}
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
            <Avatar style={{ backgroundColor: '#13C2C2' }} icon={<AppstoreOutlined />} />
            <Title level={3} style={{ margin: 0, color: '#0D364C' }}>
              Quản lý Categories
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
            placeholder="Tìm kiếm category..."
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: '320px', maxWidth: '100%' }}
            size="large"
            prefix={<SearchOutlined style={{ color: '#13C2C2' }} />}
            allowClear
            onSearch={(value) => handleSearch(value)}
          />
          <Space>
            <Button
              onClick={handleRefresh}
              icon={<SyncOutlined />}
              loading={loading}
              style={{ borderColor: '#13C2C2', color: '#13C2C2' }}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
              style={{ backgroundColor: '#0D364C', borderColor: '#0D364C' }}
            >
              Thêm Category
            </Button>
          </Space>
        </div>

        {/* Table */}
        <Spin spinning={loading}>
          <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={Array.isArray(categories) ? categories : []}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              showTotal: (total, range) => (
                <Text style={{ color: '#0D364C' }}>
                  Hiển thị {range[0]}-{range[1]} trong tổng số {total} categories
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
      <CreateCategory
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />

      {selectedCategory && (
        <UpdateCategory
          visible={isUpdateModalVisible}
          categoryData={selectedCategory}
          onClose={handleCloseUpdateModal}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {selectedCategory && (
        <ViewCategoryDetail
          visible={isViewDetailModalVisible}
          categoryData={selectedCategory}
          onClose={handleCloseViewDetailModal}
        />
      )}
    </div>
  );
};

export default CategoryManagement;
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
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined
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
  const { categories, loading, error, pagination } = useSelector(state => state.category);

  // Local state for modals
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Filter categories based on search text
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: filteredCategories.length,
    active: filteredCategories.filter(cat => cat.status).length,
    inactive: filteredCategories.filter(cat => !cat.status).length
  };

  // Fetch categories - chỉ gọi khi cần thiết
  const fetchCategories = useCallback((page = 1, limit = 10, force = false) => {
    if (force || !hasInitialLoad || categories.length === 0) {
      dispatch(fetchCategoryRequest({ page, limit }));
    }
  }, [dispatch, hasInitialLoad, categories.length]);

  // Handle search với debounce
  const handleSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
    }, 500),
    []
  );

  // Load data khi component mount - chỉ 1 lần
  useEffect(() => {
    if (!hasInitialLoad) {
      fetchCategories(1, 10, true);
      setHasInitialLoad(true);
    }
  }, [fetchCategories, hasInitialLoad]);

  // Reset hasInitialLoad khi component unmount
  useEffect(() => {
    return () => {
      setHasInitialLoad(false);
    };
  }, []);

  // Refresh data
  const handleRefresh = () => {
    fetchCategories(pagination.page || 1, pagination.limit || 10, true);
    setSearchText("");
  };

  const handleCreateSuccess = () => {
    toast.success("Thêm Category thành công");
    setIsCreateModalVisible(false);
    handleRefresh();
  };

  const handleOpenUpdateModal = (category) => {
    setSelectedCategory(category);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateSuccess = (id, updatedValues) => {
    toast.success(`Cập nhật Category thành công`);
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
              title={<Text style={{ color: '#0D364C' }}>Tổng categories</Text>}
              value={stats.total}
              prefix={<AppstoreOutlined style={{ color: '#13C2C2' }} />}
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
              title={<Text style={{ color: '#0D364C' }}>Đang hiển thị</Text>}
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
              title={<Text style={{ color: '#0D364C' }}>Đang ẩn</Text>}
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
              icon={<AppstoreOutlined />}
            />
            <Title level={3} style={{ margin: 0, color: '#0D364C' }}>
              Quản lý Categories
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
            placeholder="Tìm kiếm category..."
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
              size="large"
              style={{
                backgroundColor: '#0D364C',
                borderColor: '#0D364C',
                borderRadius: '8px'
              }}
            >
              Thêm Category
            </Button>
          </Space>
        </div>

        {/* Table */}
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredCategories}
          loading={loading}
          pagination={{
            current: pagination.page || 1,
            pageSize: pagination.limit || 10,
            total: pagination.total || filteredCategories.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <Text style={{ color: '#0D364C' }}>
                Hiển thị {range[0]}-{range[1]} trong tổng số {total} categories
              </Text>
            ),
            onChange: (page, pageSize) => {
              fetchCategories(page, pageSize || 10, true);
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

export default CategoryManagement;
import { useState, useEffect, useCallback, useRef } from "react";
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
  Alert,
  Spin,
  Select
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
  const mounted = useRef(true);

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
    if (!mounted.current) return;

    const requestPayload = {
      page,
      limit: pageSize,
      ...(search && { search })
    };
    dispatch(fetchCategoryRequest(requestPayload));
  }, [dispatch]);

  // Load initial data - chỉ chạy 1 lần khi component mount
  useEffect(() => {
    mounted.current = true;
    fetchCategories(1, 5);

    return () => {
      mounted.current = false;
    };
  }, []); // Bỏ fetchCategories khỏi dependency để tránh vòng lặp

  // Sync Redux pagination với local state - FIX: Thêm điều kiện kiểm tra chặt chẽ hơn
  useEffect(() => {
    if (reduxPagination && mounted.current) {
      const newPagination = {
        current: reduxPagination.page || 1,
        pageSize: reduxPagination.limit || 5,
        total: reduxPagination.totalCategory || 0
      };

      setPagination(prevPagination => {
        // Chỉ update nếu có sự thay đổi thực sự
        if (
          prevPagination.current !== newPagination.current ||
          prevPagination.pageSize !== newPagination.pageSize ||
          prevPagination.total !== newPagination.total
        ) {
          
          return newPagination;
        }
        return prevPagination;
      });
    }
  }, [reduxPagination?.page, reduxPagination?.limit, reduxPagination?.totalCategory]); // FIX: Chỉ theo dõi các giá trị cụ thể

  // Handle search với debounce
  const debouncedSearch = useCallback(
    debounce((value) => {
      if (!mounted.current) return;
      fetchCategories(1, 5, value);
    }, 2000),
    [] // FIX: Bỏ fetchCategories khỏi dependency
  );

  // Handle search input change
  const handleSearch = useCallback((value) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Handle table change
  const handleTableChange = useCallback((paginationConfig) => {
    if (!mounted.current) return;

    const { current, pageSize } = paginationConfig;
    const newCurrent = current || 1;
    const newPageSize = pageSize || 5;

    // Update local pagination state
    setPagination(prev => ({
      ...prev,
      current: newCurrent,
      pageSize: newPageSize
    }));

    // Fetch data with new pagination
    fetchCategories(newCurrent, newPageSize, searchText);
  }, [searchText]); // FIX: Bỏ fetchCategories khỏi dependency

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (!mounted.current) return;
    fetchCategories(pagination.current, pagination.pageSize, searchText);
  }, [pagination.current, pagination.pageSize, searchText]); // FIX: Bỏ fetchCategories khỏi dependency

  // Clear search and filters
  const handleClearSearch = useCallback(() => {
    setSearchText("");
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchCategories(1, 5, "");
  }, []); // FIX: Bỏ fetchCategories khỏi dependency

  // Statistics - tính toán stable
  const stats = useCallback(() => {
    const categoriesArray = Array.isArray(categories) ? categories : [];
    return {
      total: statistics?.totalActive + statistics?.totalInactive || categoriesArray.length,
      active: statistics?.totalActive || categoriesArray.filter(cat => cat?.status).length,
      inactive: statistics?.totalInactive || categoriesArray.filter(cat => !cat?.status).length
    };
  }, [categories, statistics?.totalActive, statistics?.totalInactive]); // FIX: Theo dõi các giá trị cụ thể

  // Modal handlers
  const handleCreateSuccess = useCallback(() => {
    toast.success("Thêm category thành công");
    setIsCreateModalVisible(false);
    // FIX: Refresh data để đồng bộ với server
    setTimeout(() => {
      fetchCategories(1, pagination.pageSize, searchText); // Về trang đầu sau khi tạo mới
      setPagination(prev => ({ ...prev, current: 1 })); // Reset về trang 1
    }, 100);
  }, [pagination.pageSize, searchText]); // FIX: Bỏ fetchCategories khỏi dependency

  const handleOpenUpdateModal = useCallback((category) => {
    setSelectedCategory(category);
    setIsUpdateModalVisible(true);
  }, []);

  const handleUpdateSuccess = useCallback(() => {
    toast.success("Cập nhật category thành công");
    setIsUpdateModalVisible(false);
    setSelectedCategory(null);
    // Refresh lại trang hiện tại
    setTimeout(() => {
      fetchCategories(pagination.current, pagination.pageSize, searchText);
    }, 100);
  }, [pagination.current, pagination.pageSize, searchText]); // FIX: Bỏ fetchCategories khỏi dependency

  const handleCloseUpdateModal = useCallback(() => {
    setIsUpdateModalVisible(false);
    setSelectedCategory(null);
  }, []);

  const handleOpenViewDetailModal = useCallback((category) => {
    setSelectedCategory(category);
    setIsViewDetailModalVisible(true);
  }, []);

  const handleCloseViewDetailModal = useCallback(() => {
    setIsViewDetailModalVisible(false);
    setSelectedCategory(null);
  }, []);

  // Columns definition - memoized để tránh re-render Table
  const columns = useCallback(() => [
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
            <div style={{ color: '#0D364C', fontWeight: 'bold', fontSize: '16px' }}>
              {record.name}
            </div>
            <div
              style={{ fontSize: '12px', color: '#999', cursor: 'pointer' }}
              onClick={() => {
                navigator.clipboard.writeText(record._id);
                toast.success('Đã copy ID vào clipboard');
              }}
              title="Click để copy ID đầy đủ"
            >
              <AppstoreOutlined style={{ marginRight: '4px' }} />
              ID: {record._id || 'N/A'}
            </div>
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
        <span style={{ color: '#999' }}>
          {date ? new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'N/A'}
        </span>
      )
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleOpenViewDetailModal(record)}
            style={{ color: '#13C2C2' }}
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenUpdateModal(record)}
            style={{ color: '#0D364C' }}
            title="Chỉnh sửa"
          />
        </Space>
      ),
    },
  ], [handleOpenViewDetailModal, handleOpenUpdateModal]);

  // Tính toán stats
  const currentStats = stats();

  // FIX: Xử lý data và pagination để tránh Antd warning
  const tableDataSource = Array.isArray(categories) ? categories : [];
  const tablePagination = {
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['5', '10', '20', '50'],
    showTotal: (total, range) => (
      <span style={{ color: '#0D364C' }}>
        Hiển thị {range[0]}-{range[1]} trong tổng số {total} categories
      </span>
    ),
    onChange: (page, pageSize) => {
      handleTableChange({ current: page, pageSize });
    },
    onShowSizeChange: (current, size) => {
      handleTableChange({ current, pageSize: size });
    },
  };

  // FIX: Kiểm tra tính nhất quán của data
  if (tableDataSource.length > 0 && pagination.total === 0) {
    console.warn("⚠️ Data inconsistency detected - categories exist but total is 0");
  }

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
              title={<span style={{ color: '#0D364C' }}>Tổng categories</span>}
              value={pagination.total || currentStats.total}
              prefix={<AppstoreOutlined style={{ color: '#13C2C2' }} />}
              valueStyle={{ color: '#13C2C2', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<span style={{ color: '#0D364C' }}>Đang hiển thị</span>}
              value={currentStats.active}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<span style={{ color: '#0D364C' }}>Đang ẩn</span>}
              value={currentStats.inactive}
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
          <Space size="middle" style={{ flex: 1, flexWrap: 'wrap' }}>
            <Input.Search
              placeholder="Tìm kiếm theo tên category hoặc ID..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '320px', maxWidth: '100%' }}
              size="large"
              prefix={<SearchOutlined style={{ color: '#13C2C2' }} />}
              allowClear
              onSearch={(value) => handleSearch(value)}
            />
            {searchText && (
              <Button
                onClick={handleClearSearch}
                style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </Space>
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
            columns={columns()}
            dataSource={tableDataSource}
            pagination={tablePagination}
            style={{ borderRadius: '12px', overflow: 'hidden' }}
            scroll={{ x: true }}
            size="middle"
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
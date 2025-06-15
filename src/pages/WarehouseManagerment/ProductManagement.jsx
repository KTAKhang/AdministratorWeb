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
  Spin,
  Select
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { fetchProductRequest } from "../../redux/actions/productActions";
import CreateProduct from "./CreateProduct";
import UpdateProduct from "./UpdateProduct";
import ViewProductDetail from "./ViewProductDetail";

const { Title, Text } = Typography;

const ProductManagement = () => {
  const dispatch = useDispatch();

  // Redux state
  const reduxState = useSelector(state => state.product || {});
  const { products = [], loading = false, error = null, pagination: reduxPagination = { page: 1, limit: 12, totalPages: 1, totalProduct: 0 }, statistics } = reduxState;

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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);

  // Fetch products function
  const fetchProducts = useCallback((page = 1, pageSize = 5, search = "") => {
    const requestPayload = {
      page,
      limit: pageSize,
      ...(search && { search })
    };
    dispatch(fetchProductRequest(requestPayload));
  }, [dispatch]);

  // Load initial data
  useEffect(() => {
    fetchProducts(1, 5);
  }, []);

  // Sync Redux pagination with local state
  useEffect(() => {
    if (reduxPagination) {
      const newPagination = {
        current: reduxPagination.page || 1,
        pageSize: reduxPagination.limit || 5,
        total: reduxPagination.totalProduct || 0
      };
      setPagination(newPagination);
    }
  }, [reduxPagination]);

  // Handle search with debounce 2 giây - API call only
  const debouncedSearch = useCallback(
    debounce((value) => {
      console.log("🔍 Search API triggered for product:", value);
      setPagination(prev => ({ ...prev, current: 1 }));
      fetchProducts(1, 5, value);
    }, 2000), // API call after 2 seconds of no typing
    [fetchProducts]
  );

  // Handle search input change - immediate UI update
  const handleSearch = (value) => {
    console.log("🔍 Search input changed:", value);
    setSearchText(value); // Update UI immediately
    debouncedSearch(value); // Debounced API call
  };

  // Handle table change
  const handleTableChange = (paginationConfig, filters, sorter) => {
    const { current, pageSize } = paginationConfig;
    setPagination(prev => ({
      ...prev,
      current: current || 1,
      pageSize: pageSize || prev.pageSize
    }));
    fetchProducts(current || 1, pageSize || pagination.pageSize, searchText);
  };

  // Handle refresh
  const handleRefresh = () => {
    console.log("🔄 Refreshing products...");
    fetchProducts(pagination.current, pagination.pageSize, searchText);
  };

  // Clear search and filters
  const handleClearSearch = () => {
    setSearchText("");
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchProducts(1, 5, "");
  };

  // Calculate statistics - use API statistics when available, fallback to client-side calculation
  const stats = {
    total: statistics?.totalActive + statistics?.totalInactive || (Array.isArray(products) ? products.length : 0),
    active: statistics?.totalActive || (Array.isArray(products) ? products.filter(p => p.status).length : 0),
    inactive: statistics?.totalInactive || (Array.isArray(products) ? products.filter(p => !p.status).length : 0)
  };

  const handleCreateSuccess = () => {
    toast.success("Thêm sản phẩm thành công");
    setIsCreateModalVisible(false);
    handleRefresh();
  };

  const handleOpenUpdateModal = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateSuccess = () => {
    toast.success("Cập nhật sản phẩm thành công");
    setIsUpdateModalVisible(false);
    setSelectedProduct(null);
    handleRefresh();
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setSelectedProduct(null);
  };

  const handleOpenViewDetailModal = (product) => {
    setSelectedProduct(product);
    setIsViewDetailModalVisible(true);
  };

  const handleCloseViewDetailModal = () => {
    setIsViewDetailModalVisible(false);
    setSelectedProduct(null);
  };

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <Space>
          <Avatar
            src={record.image}
            icon={<ShoppingCartOutlined />}
            style={{
              backgroundColor: '#13C2C2'
            }}
            onError={() => false}
          />
          <div>
            <Text strong style={{ color: '#0D364C', display: 'block', fontSize: '16px' }}>
              {record.name}
            </Text>
            <Text
              type="secondary"
              style={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={() => {
                navigator.clipboard.writeText(record._id);
                toast.success('Đã copy ID vào clipboard');
              }}
              title="Click để copy ID đầy đủ"
            >
              <ShoppingCartOutlined style={{ marginRight: '4px' }} />
              ID: {record._id || 'N/A'}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Danh mục",
      key: "category",
      render: (_, record) => (
        <div>
          <Text strong style={{ color: '#0D364C', display: 'block', fontSize: '14px' }}>
            {record.categoryDetail?.name || record.category_name || 'N/A'}
          </Text>
          {record.categoryDetail && (
            <Tag
              color={record.categoryDetail.status ? '#52c41a' : '#ff4d4f'}
              style={{ fontSize: '11px', marginTop: '4px' }}
            >
              {record.categoryDetail.status ? 'Hoạt động' : 'Ngừng hoạt động'}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Tag color="#13C2C2" style={{
          borderRadius: '16px',
          padding: '4px 12px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {price?.toLocaleString('vi-VN') || 0}đ
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
              {status ? 'Hiển thị' : 'Ẩn'}
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
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: `1px solid #13C2C230` }}>
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Tổng sản phẩm</Text>}
              value={pagination.total || stats.total}
              prefix={<ShoppingCartOutlined style={{ color: '#13C2C2' }} />}
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
            <Avatar style={{ backgroundColor: '#13C2C2' }} icon={<ShoppingCartOutlined />} />
            <Title level={3} style={{ margin: 0, color: '#0D364C' }}>
              Quản lý Sản phẩm
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
              placeholder="Tìm kiếm theo tên sản phẩm hoặc ID..."
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
              Thêm Sản phẩm
            </Button>
          </Space>
        </div>

        {/* Table */}
        <Spin spinning={loading}>
          <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={Array.isArray(products) ? products : []}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              showTotal: (total, range) => (
                <Text style={{ color: '#0D364C' }}>
                  Hiển thị {range[0]}-{range[1]} trong tổng số {total} sản phẩm
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
      <CreateProduct
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />

      {selectedProduct && (
        <UpdateProduct
          visible={isUpdateModalVisible}
          productData={selectedProduct}
          onClose={handleCloseUpdateModal}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {selectedProduct && (
        <ViewProductDetail
          visible={isViewDetailModalVisible}
          productData={selectedProduct}
          onClose={handleCloseViewDetailModal}
        />
      )}
    </div>
  );
};

export default ProductManagement;
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
  ShoppingCartOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined
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
  const { products = [], loading = false, error = null, pagination = { page: 1, limit: 10, totalPages: 1, totalProduct: 0 } } = useSelector(state => state.product || {});

  // Local state for modals
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Filter products based on search text
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: filteredProducts.length,
    active: filteredProducts.filter(p => p.status).length,
    inactive: filteredProducts.filter(p => !p.status).length,
    totalValue: filteredProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0)
  };

  // Fetch products - chỉ gọi khi cần thiết
  const fetchProducts = useCallback((page = 1, limit = 10, force = false) => {
    if (force || !hasInitialLoad || products.length === 0) {
      dispatch(fetchProductRequest({ page, limit }));
    }
  }, [dispatch, hasInitialLoad, products.length]);

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
      fetchProducts(1, 10, true);
      setHasInitialLoad(true);
    }
  }, [fetchProducts, hasInitialLoad]);

  // Reset hasInitialLoad khi component unmount
  useEffect(() => {
    return () => {
      setHasInitialLoad(false);
    };
  }, []);

  // Refresh data
  const handleRefresh = () => {
    fetchProducts(pagination.page || 1, pagination.limit || 10, true);
    setSearchText("");
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
            <Text strong style={{ color: '#0D364C', display: 'block' }}>
              {record.name}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <ShoppingCartOutlined style={{ marginRight: '4px' }} />
              ID: {record._id?.slice(-6) || 'N/A'}
            </Text>
          </div>
        </Space>
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
        <Col xs={24} sm={6}>
          <Card
            style={{
              borderRadius: '12px',
              border: `1px solid #13C2C230`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Statistic
              title={<Text style={{ color: '#0D364C' }}>Tổng sản phẩm</Text>}
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
              title={<Text style={{ color: '#0D364C' }}>Đang hiển thị</Text>}
              value={stats.active}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
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
              title={<Text style={{ color: '#0D364C' }}>Đang ẩn</Text>}
              value={stats.inactive}
              prefix={<StopOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f', fontWeight: 'bold' }}
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
              title={<Text style={{ color: '#0D364C' }}>Tổng giá trị</Text>}
              value={stats.totalValue}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
              formatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
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
              Quản lý Sản phẩm
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
            placeholder="Tìm kiếm sản phẩm..."
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
              Thêm Sản phẩm
            </Button>
          </Space>
        </div>

        {/* Table */}
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredProducts}
          loading={loading}
          pagination={{
            current: pagination.page || 1,
            pageSize: pagination.limit || 10,
            total: pagination.totalProduct || filteredProducts.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <Text style={{ color: '#0D364C' }}>
                Hiển thị {range[0]}-{range[1]} trong tổng số {total} sản phẩm
              </Text>
            ),
            onChange: (page, pageSize) => {
              fetchProducts(page, pageSize || 10, true);
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

export default ProductManagement;
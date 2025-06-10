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
  ShoppingCartOutlined,
  DollarOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  StopOutlined
} from "@ant-design/icons";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import CreateProduct from "./CreateProduct";
import UpdateProduct from "./UpdateProduct";

import ViewProductDetail from "./ViewProductDetail";

const { Title, Text } = Typography;

// Sample data for products based on the provided schema
const sampleProducts = [
  {
    _id: "p1",
    category_id: "c1",
    name: "Smartphone X",
    image: "https://via.placeholder.com/60x60?text=Product1",
    price: 10000000,
    detail_desc: "Detailed description for Smartphone X.",
    short_desc: "Short description for Smartphone X.",
    quantity: 50,
    sold: 10,
    factory: "Factory A",
    target: "Consumer",
    status: true,
    createdAt: "2024-06-01T10:00:00Z"
  },
  {
    _id: "p2",
    category_id: "c2",
    name: "Laptop Y",
    image: "https://via.placeholder.com/60x60?text=Product2",
    price: 15000000,
    detail_desc: "Detailed description for Laptop Y.",
    short_desc: "Short description for Laptop Y.",
    quantity: 30,
    sold: 5,
    factory: "Factory B",
    target: "Business",
    status: true,
    createdAt: "2024-06-02T11:00:00Z"
  },
  {
    _id: "p3",
    category_id: "c1",
    name: "Tai nghe Z",
    image: "https://via.placeholder.com/60x60?text=Product3",
    price: 500000,
    detail_desc: "Detailed description for Tai nghe Z.",
    short_desc: "Short description for Tai nghe Z.",
    quantity: 120,
    sold: 50,
    factory: "Factory A",
    target: "Consumer",
    status: false,
    createdAt: "2024-06-03T12:00:00Z"
  }
];

const ProductManagement = () => {
  const [products, setProducts] = useState(sampleProducts);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: sampleProducts.length,
  });
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);

  // Calculate statistics
  const stats = {
    total: products.length,
    active: products.filter(p => p.status).length,
    inactive: products.filter(p => !p.status).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
    totalSold: products.reduce((sum, p) => sum + p.sold, 0)
  };

  // Debounce search
  const handleSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 500),
    []
  );

  useEffect(() => {
    const filtered = sampleProducts.filter(product =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setProducts(filtered);
    setPagination(prev => ({ ...prev, total: filtered.length }));
  }, [searchText]);

  const handleCreateSuccess = (newProductData) => {
    toast.success("Thêm Sản phẩm thành công (Giả lập)");
    setIsCreateModalVisible(false);
    const newProduct = { 
      _id: `p${sampleProducts.length + 1}`, 
      ...newProductData,
      createdAt: new Date().toISOString(),
      sold: 0
    };
    sampleProducts.push(newProduct);
    setProducts([...sampleProducts]);
    setPagination(prev => ({...prev, total: sampleProducts.length}));
  };

  const handleOpenUpdateModal = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateSuccess = (id, updatedValues) => {
    toast.success(`Cập nhật Sản phẩm ${id} thành công (Giả lập)`);
    setIsUpdateModalVisible(false);
    setSelectedProduct(null);
    const updatedProducts = products.map(product => 
      product._id === id ? { ...product, ...updatedValues } : product
    );
    setProducts(updatedProducts);
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
      title: "Tên Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Space>
          <Avatar 
            src={record.image} 
            icon={<InboxOutlined />}
            style={{ backgroundColor: '#13C2C2' }}
          />
          <Text strong style={{ color: '#0D364C' }}>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (url) => (
        <Image 
          src={url} 
          width={60} 
          height={60} 
          alt="product"
          style={{ 
            borderRadius: '8px',
            border: `2px solid #13C2C220`
          }}
        />
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
          {price?.toLocaleString('vi-VN')} VNĐ
        </Tag>
      ),
    },
    {
      title: "Kho hàng",
      key: "inventory",
      render: (_, record) => (
        <Space>
          <Tag color="blue" style={{ borderRadius: '16px' }}>
            Còn lại: {record.quantity}
          </Tag>
          <Tag color="orange" style={{ borderRadius: '16px' }}>
            Đã bán: {record.sold}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge 
          status={status ? "success" : "error"} 
          text={
            <Tag 
              color={status ? '#13C2C2' : '#ff4d4f'} 
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
              title={<Text style={{ color: '#0D364C' }}>Tổng Sản phẩm</Text>}
              value={stats.total}
              prefix={<InboxOutlined style={{ color: '#13C2C2' }} />}
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
              icon={<InboxOutlined />} 
            />
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
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
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
           
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#13C2C2';
              e.target.style.borderColor = '#13C2C2';
            }}
          > 
            Thêm Sản phẩm
          </Button>
        </div>

        {/* Table */}
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={products}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <Text style={{ color: '#0D364C' }}>
                Hiển thị {range[0]}-{range[1]} trong tổng số {total} sản phẩm
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

      <style jsx>{`
        .ant-table-row-alternate {
          background-color: ${`#13C2C205`} !important;
        }
        
        .ant-table-thead > tr > th {
          background-color: #0D364C !important;
          color: white !important;
          font-weight: 600 !important;
          border-bottom: 2px solid #13C2C2 !important;
        }
        
        .ant-table-tbody > tr:hover > td {
          background-color: ${`#13C2C210`} !important;
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
          box-shadow: 0 0 0 2px ${`#13C2C220`} !important;
        }
      `}</style>
    </div>
  );
};

export default ProductManagement;
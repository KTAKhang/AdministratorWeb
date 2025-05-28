import { useState, useEffect, useCallback } from "react";
import { Card, Table, Button, Tag, Image, Input, Space, Typography, Avatar, Tooltip, Badge, Row, Col, Statistic } from "antd";
import { EditOutlined,  PlusOutlined, EyeOutlined, SearchOutlined, AppstoreOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import CreateCategory from "./CreateCategory";
import UpdateCategory from "./UpdateCategory";
import ViewCategoryDetail from "./ViewCategoryDetail";

const { Title, Text } = Typography;

const sampleCategories = [
  {
    _id: "1",
    name: "Điện thoại",
    image: "https://via.placeholder.com/60x60?text=Phone",
    status: true,
    createdAt: "2024-06-01T10:00:00Z"
  },
  {
    _id: "2",
    name: "Laptop",
    image: "https://via.placeholder.com/60x60?text=Laptop",
    status: false,
    createdAt: "2024-06-02T11:00:00Z"
  },
  {
    _id: "3",
    name: "Phụ kiện",
    image: "https://via.placeholder.com/60x60?text=Accessory",
    status: true,
    createdAt: "2024-06-03T12:00:00Z"
  },
  {
    _id: "4",
    name: "Tablet",
    image: "https://via.placeholder.com/60x60?text=Tablet",
    status: true,
    createdAt: "2024-06-04T13:00:00Z"
  },
  {
    _id: "5",
    name: "Smartwatch",
    image: "https://via.placeholder.com/60x60?text=Watch",
    status: false,
    createdAt: "2024-06-05T14:00:00Z"
  }
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState(sampleCategories);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: sampleCategories.length,
  });
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);

  // Custom styles
  const primaryColor = '#13C2C2';
  const secondaryColor = '#0D364C';

  // Calculate statistics
  const totalCategories = categories.length;
  const activeCategories = categories.filter(cat => cat.status).length;
  const inactiveCategories = totalCategories - activeCategories;

  // Debounce search
  const handleSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 500),
    []
  );

  useEffect(() => {
    const filtered = sampleCategories.filter(cat =>
      cat.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setCategories(filtered);
    setPagination(prev => ({ ...prev, total: filtered.length }));
  }, [pagination.current, pagination.pageSize, searchText]);

  const handleCreateSuccess = () => {
    console.log("Thêm Category thành công (Giả lập)");
    setIsCreateModalVisible(false);
    const newCategory = { 
      _id: (sampleCategories.length + 1).toString(), 
      name: `New Category ${sampleCategories.length + 1}`, 
      image: "https://via.placeholder.com/60x60?text=New", 
      status: true, 
      createdAt: new Date().toISOString() 
    };
    sampleCategories.push(newCategory);
    setCategories([...sampleCategories]);
    setPagination(prev => ({...prev, total: sampleCategories.length}));
  };

  const handleOpenUpdateModal = (category) => {
    setSelectedCategory(category);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateSuccess = (id, updatedValues) => {
    console.log(`Cập nhật Category ${id} thành công (Giả lập)`);
    setIsUpdateModalVisible(false);
    setSelectedCategory(null);
    const updatedCategories = categories.map(cat => 
      cat._id === id ? { ...cat, ...updatedValues } : cat
    );
    setCategories(updatedCategories);
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
      title: "Tên Category",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Space>
          <Avatar 
            src={record.image} 
            icon={<AppstoreOutlined />}
            style={{ backgroundColor: primaryColor }}
          />
          <Text strong style={{ color: secondaryColor }}>{name}</Text>
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
          alt="category"
          style={{ 
            borderRadius: '8px',
            border: `2px solid ${primaryColor}20`
          }}
        />
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
              color={status ? primaryColor : '#ff4d4f'} 
              icon={status ? <CheckCircleOutlined /> : <StopOutlined />}
              style={{ 
                borderRadius: '16px',
                fontWeight: '500'
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
                color: primaryColor,
                borderColor: primaryColor
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${primaryColor}10`;
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
                color: secondaryColor,
                borderColor: secondaryColor
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${secondaryColor}10`;
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
      background: `linear-gradient(135deg, ${primaryColor}05 0%, ${secondaryColor}05 100%)`,
      minHeight: '100vh'
    }}>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card 
            style={{ 
              borderRadius: '12px',
              border: `1px solid ${primaryColor}30`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Statistic
              title={<Text style={{ color: secondaryColor }}>Tổng Categories</Text>}
              value={totalCategories}
              prefix={<AppstoreOutlined style={{ color: primaryColor }} />}
              valueStyle={{ color: primaryColor, fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            style={{ 
              borderRadius: '12px',
              border: `1px solid ${primaryColor}30`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Statistic
              title={<Text style={{ color: secondaryColor }}>Đang hiển thị</Text>}
              value={activeCategories}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            style={{ 
              borderRadius: '12px',
              border: `1px solid ${primaryColor}30`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Statistic
              title={<Text style={{ color: secondaryColor }}>Đang ẩn</Text>}
              value={inactiveCategories}
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
          border: `1px solid ${primaryColor}20`
        }}
        title={
          <Space>
            <Avatar 
              style={{ backgroundColor: primaryColor }} 
              icon={<AppstoreOutlined />} 
            />
            <Title level={3} style={{ margin: 0, color: secondaryColor }}>
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
            style={{ 
              width: '320px',
              maxWidth: '100%'
            }}
            size="large"
            prefix={<SearchOutlined style={{ color: primaryColor }} />}
            allowClear
            onSearch={(value) => handleSearch(value)}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsCreateModalVisible(true)}
            size="large"
            style={{ 
              backgroundColor: primaryColor, 
              borderColor: primaryColor,
              borderRadius: '8px',
              fontWeight: '500',
              boxShadow: `0 4px 12px ${primaryColor}40`
            }}
           
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = primaryColor;
              e.target.style.borderColor = primaryColor;
            }}
          > 
            Thêm Category
          </Button>
        </div>

        {/* Table */}
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={categories}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <Text style={{ color: secondaryColor }}>
                Hiển thị {range[0]}-{range[1]} trong tổng số {total} categories
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

      <style jsx>{`
        .ant-table-row-alternate {
          background-color: ${primaryColor}05 !important;
        }
        
        .ant-table-thead > tr > th {
          background-color: ${secondaryColor} !important;
          color: white !important;
          font-weight: 600 !important;
          border-bottom: 2px solid ${primaryColor} !important;
        }
        
        .ant-table-tbody > tr:hover > td {
          background-color: ${primaryColor}10 !important;
        }
        
        .ant-pagination-item-active {
          border-color: ${primaryColor} !important;
          background-color: ${primaryColor} !important;
        }
        
        .ant-pagination-item-active a {
          color: white !important;
        }
        
        .ant-pagination-item:hover {
          border-color: ${primaryColor} !important;
        }
        
        .ant-pagination-item:hover a {
          color: ${primaryColor} !important;
        }
        
        .ant-input:focus,
        .ant-input-focused {
          border-color: ${primaryColor} !important;
          box-shadow: 0 0 0 2px ${primaryColor}20 !important;
        }
      `}</style>
    </div>
  );
};

export default CategoryManagement;
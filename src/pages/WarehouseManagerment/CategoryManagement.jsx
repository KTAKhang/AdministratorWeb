import { useState, useEffect, useCallback } from "react";
import { Card, Table, Button, Tag, Image, Input, Space, Typography, Avatar, Tooltip, Badge, Row, Col, Statistic, Spin } from "antd";
import { EditOutlined, PlusOutlined, EyeOutlined, SearchOutlined, AppstoreOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import CreateCategory from "./CreateCategory";
import UpdateCategory from "./UpdateCategory";
import ViewCategoryDetail from "./ViewCategoryDetail";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryRequest } from '../../redux/actions/categoryActions';
const { Title, Text } = Typography;

const CategoryManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);

  const dispatch = useDispatch();

  // Get data from Redux store
  const { categories, loading, error, pagination } = useSelector(state => state.category);

  // Custom styles
  const primaryColor = '#13C2C2';
  const secondaryColor = '#0D364C';

  // Filter categories based on search text
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate statistics
  const totalCategories = filteredCategories.length;
  const activeCategories = filteredCategories.filter(cat => cat.status).length;
  const inactiveCategories = totalCategories - activeCategories;

  // Debounce search
  const handleSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
    }, 500),
    []
  );

  // Fetch categories on component mount
  useEffect(() => {
    const page = 1;
    const limit = 3;
    dispatch(fetchCategoryRequest({ page, limit }));
  }, [dispatch]);

  const handleCreateSuccess = () => {
    console.log("Thêm Category thành công");
    setIsCreateModalVisible(false);
    // Refresh data after creating
    dispatch(fetchCategoryRequest({ page: pagination.page, limit: pagination.limit }));
  };

  const handleOpenUpdateModal = (category) => {
    setSelectedCategory(category);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateSuccess = (id, updatedValues) => {
    console.log(`Cập nhật Category ${id} thành công`);
    setIsUpdateModalVisible(false);
    setSelectedCategory(null);
    // Refresh data after updating
    dispatch(fetchCategoryRequest({ page: pagination.page, limit: pagination.limit }));
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

  // Show loading spinner
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column'
      }}>
        <Text type="danger" style={{ fontSize: '18px', marginBottom: '16px' }}>
          Có lỗi xảy ra: {error}
        </Text>
        <Button
          type="primary"
          onClick={() => dispatch(fetchCategoryRequest({ page: 1, limit: 10 }))}
        >
          Thử lại
        </Button>
      </div>
    );
  }

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
          >
            Thêm Category
          </Button>
        </div>

        {/* Table */}
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredCategories}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalCategory,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <Text style={{ color: secondaryColor }}>
                Hiển thị {range[0]}-{range[1]} trong tổng số {total} categories
              </Text>
            ),
            onChange: (page, pageSize) => {
              dispatch(fetchCategoryRequest({ page, limit: pageSize || 10 }));
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
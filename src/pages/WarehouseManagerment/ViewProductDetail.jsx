import { Modal, Button, Tag, Image, Typography, Card, Space, Divider, Avatar, Spin } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  CalendarOutlined,
  TagOutlined,
  FileImageOutlined,
  CloseOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ShopOutlined,
  UserOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const { Title, Text } = Typography;

const ViewProductDetail = ({ visible, productData, onClose }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && productData) {
      setLoading(true);
      // Simulate loading time
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [visible, productData]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusTag = ({ status }) => (
    <Tag
      icon={status ? <EyeOutlined /> : <EyeInvisibleOutlined />}
      color={status ? '#13C2C2' : '#ff4d4f'}
      style={{
        borderRadius: '16px',
        padding: '4px 12px',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        width: 'fit-content'
      }}
    >
      {status ? 'Đang hiển thị' : 'Đang ẩn'}
    </Tag>
  );

  return (
    <Modal
      open={visible}
      title={
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#0D364C'
        }}>
          <EyeOutlined style={{ color: '#13C2C2' }} />
          <Title level={4} style={{ margin: 0, color: '#0D364C' }}>
            Chi tiết Sản phẩm
          </Title>
        </div>
      }
      onCancel={onClose}
      footer={
        <Button
          size="large"
          onClick={onClose}
          icon={<CloseOutlined />}
          style={{
            borderRadius: '8px',
            borderColor: '#d1d5db',
            color: '#6b7280'
          }}
        >
          Đóng
        </Button>
      }
      width={700}
      centered
      style={{
        borderRadius: '12px',
      }}
      styles={{
        header: {
          backgroundColor: '#f8fafc',
          borderBottom: '2px solid #13C2C2',
          borderRadius: '12px 12px 0 0',
          padding: '20px 24px'
        },
        body: {
          padding: '24px'
        }
      }}
    >
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 0'
        }}>
          <Spin size="large" style={{ color: '#13C2C2' }} />
        </div>
      ) : productData ? (
        <Card
          bordered={false}
          style={{
            boxShadow: 'none',
            background: 'transparent'
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header with Avatar */}
            <div style={{
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <Avatar
                size={120}
                src={productData.image}
                icon={!productData.image && <FileImageOutlined />}
                style={{
                  border: '3px solid #13C2C2',
                  marginBottom: '16px'
                }}
              />
              <Title level={3} style={{
                margin: '8px 0',
                color: '#0D364C'
              }}>
                {productData.name}
              </Title>
              <Space size="small">
                <StatusTag status={productData.status} />
                <Tag color="#13C2C2" icon={<DollarOutlined />} style={{ borderRadius: '16px', padding: '4px 12px' }}>
                  {formatPrice(productData.price)}
                </Tag>
              </Space>
            </div>

            <Divider style={{ margin: '0 0 24px 0' }} />

            {/* Info Items */}
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <TagOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  ID Sản phẩm
                </Text>
                <div style={{ marginTop: '8px' }}>
                  <Text style={{
                    fontFamily: 'monospace',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    color: '#374151',
                    fontSize: '13px',
                    display: 'inline-block'
                  }}>
                    {productData._id}
                  </Text>
                </div>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <ShoppingOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Thông tin tồn kho
                </Text>
                <Space style={{ marginTop: '8px' }}>
                  <Tag color="blue">Số lượng: {productData.quantity}</Tag>
                  <Tag color="orange">Đã bán: {productData.sold}</Tag>
                </Space>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <InfoCircleOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Mô tả ngắn
                </Text>
                <Text style={{
                  display: 'block',
                  color: '#0D364C',
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  {productData.short_desc}
                </Text>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <InfoCircleOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Mô tả chi tiết
                </Text>
                <Text style={{
                  display: 'block',
                  color: '#0D364C',
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  {productData.detail_desc}
                </Text>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <ShopOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Nhà sản xuất
                </Text>
                <Text style={{
                  display: 'block',
                  color: '#0D364C',
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  {productData.factory}
                </Text>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <UserOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Đối tượng
                </Text>
                <Text style={{
                  display: 'block',
                  color: '#0D364C',
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  {productData.target}
                </Text>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <CalendarOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Thời gian tạo
                </Text>
                <Text style={{
                  display: 'block',
                  color: '#0D364C',
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  {formatDate(productData.createdAt)}
                </Text>
              </div>
            </Space>
          </Space>
        </Card>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px 0'
        }}>
          <Text type="secondary">Đang tải thông tin sản phẩm...</Text>
        </div>
      )}

      <style jsx>{`
        .info-item {
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
      `}</style>
    </Modal>
  );
};

ViewProductDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  productData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ViewProductDetail; 
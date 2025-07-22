import { Modal, Button, Tag, Typography, Card, Space, Divider, Avatar, Row, Col, Image } from "antd";
import {
  EyeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  CloseOutlined,
  MailOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CarOutlined,
  StopOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const ViewOrderDetail = ({ visible, orderData, onClose }) => {
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

  const getStatusInfo = (status) => {
    const statusName = status?.name || 'UNKNOWN';
    switch (statusName) {
      case 'PENDING':
        return { color: '#faad14', text: 'Chờ xử lý', icon: <ClockCircleOutlined /> };
      case 'PROCESSING':
        return { color: '#13C2C2', text: 'Đang xử lý', icon: <SyncOutlined spin /> };
      case 'SHIPPING':
        return { color: '#1890ff', text: 'Đang giao', icon: <CarOutlined /> };
      case 'DELIVERED':
        return { color: '#52c41a', text: 'Đã giao', icon: <CheckCircleOutlined /> };
      case 'CANCELLED':
        return { color: '#ff4d4f', text: 'Đã hủy', icon: <StopOutlined /> };
      default:
        return { color: 'default', text: status?.description || 'Không xác định', icon: <QuestionCircleOutlined /> };
    }
  };

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
            Chi tiết Đơn hàng
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
      width={800}
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
          padding: '24px',
          maxHeight: '70vh',
          overflowY: 'auto'
        }
      }}
    >
      {orderData ? (
        <Card
          bordered={false}
          style={{
            boxShadow: 'none',
            background: 'transparent'
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header with Order ID and Status */}
            <div style={{
              textAlign: 'center',
              marginBottom: '24px',
              padding: '20px',
              background: 'linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)',
              borderRadius: '12px',
              border: '1px solid #13C2C220'
            }}>
              <Avatar
                size={80}
                icon={<ShoppingCartOutlined />}
                style={{
                  backgroundColor: '#13C2C2',
                  marginBottom: '16px'
                }}
              />
              <Title level={3} style={{
                margin: '8px 0',
                color: '#0D364C'
              }}>
                #{orderData.order_id?.slice(-8)?.toUpperCase()}
              </Title>
              <Space size="middle" wrap>
                {(() => {
                  const statusInfo = getStatusInfo(orderData.order_status);
                  return (
                    <Tag
                      color={statusInfo.color}
                      icon={statusInfo.icon}
                      style={{
                        borderRadius: '16px',
                        padding: '6px 16px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      {statusInfo.text}
                    </Tag>
                  );
                })()}
                <Tag
                  color="#13C2C2"
                  icon={<DollarOutlined />}
                  style={{
                    borderRadius: '16px',
                    padding: '6px 16px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {formatPrice(orderData.total_price)}
                </Tag>
              </Space>
            </div>

            {/* Customer Information */}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card
                  size="small"
                  title={
                    <Space>
                      <UserOutlined style={{ color: '#13C2C2' }} />
                      <Text strong style={{ color: '#0D364C' }}>Thông tin khách hàng</Text>
                    </Space>
                  }
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #13C2C220'
                  }}
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Email:</Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MailOutlined style={{ color: '#13C2C2' }} />
                        <Text strong>{orderData.user?.email || 'N/A'}</Text>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Người nhận:</Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <UserOutlined style={{ color: '#13C2C2' }} />
                        <Text strong>{orderData.receiver_name}</Text>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Số điện thoại:</Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <PhoneOutlined style={{ color: '#13C2C2' }} />
                        <Text strong>{orderData.receiver_phone}</Text>
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  size="small"
                  title={
                    <Space>
                      <HomeOutlined style={{ color: '#13C2C2' }} />
                      <Text strong style={{ color: '#0D364C' }}>Thông tin đơn hàng</Text>
                    </Space>
                  }
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #13C2C220'
                  }}
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Mã đơn hàng:</Text>
                      <div>
                        <Tag color="#0D364C" style={{
                          fontFamily: 'monospace',
                          fontSize: '12px'
                        }}>
                          {orderData.order_id}
                        </Tag>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Ngày đặt hàng:</Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CalendarOutlined style={{ color: '#13C2C2' }} />
                        <Text strong>{formatDate(orderData.createdAt)}</Text>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Ngày cập nhật:</Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CalendarOutlined style={{ color: '#13C2C2' }} />
                        <Text strong>{formatDate(orderData.updatedAt)}</Text>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>Địa chỉ giao hàng:</Text>
                      <Text style={{
                        display: 'block',
                        color: '#0D364C',
                        marginTop: '4px',
                        wordBreak: 'break-word'
                      }}>
                        {orderData.receiver_address}
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Divider style={{ margin: '16px 0' }} />

            {/* Order Items */}
            <Card
              title={
                <Space>
                  <ShoppingCartOutlined style={{ color: '#13C2C2' }} />
                  <Text strong style={{ color: '#0D364C' }}>
                    Sản phẩm đã đặt ({orderData.items?.length || 0} sản phẩm)
                  </Text>
                </Space>
              }
              style={{
                borderRadius: '8px',
                border: '1px solid #13C2C220'
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {orderData.items?.map((item, index) => (
                  <Card
                    key={index}
                    size="small"
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  >
                    <Row gutter={[16, 16]} align="middle">
                      <Col xs={24} sm={6}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          style={{
                            borderRadius: '6px',
                            objectFit: 'cover'
                          }}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FmuFHkM2OI9OxY8f2A9g+gIEbGDiBnRvgBnZu4AY2N3ByA9vOwI4d2zE7tjNgYGb2/3xd6uruqqpX/6X6/Z5npnu6urq0oyf9"
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <Space direction="vertical" size="small">
                          <Text strong style={{ color: '#0D364C', fontSize: '16px' }}>
                            {item.name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            ID: {item.product_id}
                          </Text>
                          <Tag color="#13C2C2" style={{ width: 'fit-content' }}>
                            {formatPrice(item.price)} / sản phẩm
                          </Tag>
                        </Space>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Space direction="vertical" align="end" style={{ width: '100%' }}>
                          <Text style={{ fontSize: '14px' }}>
                            Số lượng: <Text strong>{item.quantity}</Text>
                          </Text>
                          <Tag color="#52c41a" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            {formatPrice(item.subtotal)}
                          </Tag>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                ))}

                {/* Total Summary */}
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #13C2C205 0%, #0D364C05 100%)',
                  borderRadius: '8px',
                  border: '2px solid #13C2C220'
                }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong style={{ fontSize: '18px', color: '#0D364C' }}>
                        Tổng cộng:
                      </Text>
                    </Col>
                    <Col>
                      <Text
                        strong
                        style={{
                          fontSize: '20px',
                          color: '#13C2C2',
                          fontWeight: 'bold'
                        }}
                      >
                        {formatPrice(orderData.total_price)}
                      </Text>
                    </Col>
                  </Row>
                </div>
              </Space>
            </Card>
          </Space>
        </Card>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px 0'
        }}>
          <Text type="secondary">Đang tải thông tin đơn hàng...</Text>
        </div>
      )}

      <style>
        {`
          .ant-card-head-title {
            font-weight: 600 !important;
          }
          
          .ant-image {
            border: 1px solid #e5e7eb;
          }
          
          .ant-tag {
            border: none;
          }
        `}
      </style>
    </Modal>
  );
};

ViewOrderDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  orderData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ViewOrderDetail;
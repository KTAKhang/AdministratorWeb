import { Modal, Button, Tag, Typography, Card, Space, Divider, Avatar } from "antd";
import { 
  EyeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  CloseOutlined,
  TagOutlined
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

  const getStatusInfo = (statusId) => {
    switch(statusId) {
      case 'os1':
        return { color: '#faad14', text: 'Chờ xử lý' };
      case 'os2':
        return { color: '#13C2C2', text: 'Đang xử lý' };
      case 'os3':
        return { color: '#1890ff', text: 'Đang giao' };
      case 'os4':
        return { color: '#52c41a', text: 'Đã giao' };
      case 'os5':
        return { color: '#ff4d4f', text: 'Đã hủy' };
      default:
        return { color: 'default', text: 'Không xác định' };
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
              marginBottom: '24px'
            }}>
              <Avatar 
                size={120} 
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
                Đơn hàng #{orderData._id}
              </Title>
              <Space size="small">
                {(() => {
                  const status = getStatusInfo(orderData.order_status_id);
                  return (
                    <Tag color={status.color} style={{ borderRadius: '16px', padding: '4px 12px' }}>
                      {status.text}
                    </Tag>
                  );
                })()}
                <Tag color="#13C2C2" icon={<DollarOutlined />} style={{ borderRadius: '16px', padding: '4px 12px' }}>
                  {formatPrice(orderData.total_price)}
                </Tag>
              </Space>
            </div>

            <Divider style={{ margin: '0 0 24px 0' }} />

            {/* Info Items */}
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <TagOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Mã đơn hàng
                </Text>
                <Tag color="#0D364C" style={{ 
                  fontFamily: 'monospace',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginTop: '8px'
                }}>
                  {orderData._id}
                </Tag>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <UserOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Thông tin người nhận
                </Text>
                <div style={{ marginTop: '8px' }}>
                  <Text style={{ display: 'block', color: '#0D364C' }}>
                    {orderData.receiver_name}
                  </Text>
                  <Text type="secondary">
                    <PhoneOutlined style={{ marginRight: '8px' }} />
                    {orderData.receiver_phone}
                  </Text>
                </div>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <HomeOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Địa chỉ giao hàng
                </Text>
                <Text style={{ 
                  display: 'block',
                  color: '#0D364C',
                  marginTop: '8px'
                }}>
                  {orderData.receiver_address}
                </Text>
              </div>

              {orderData.note && (
                <div className="info-item">
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <FileTextOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Ghi chú
                  </Text>
                  <Text style={{ 
                    display: 'block',
                    color: '#0D364C',
                    marginTop: '8px'
                  }}>
                    {orderData.note}
                  </Text>
                </div>
              )}

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <CalendarOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Thời gian đặt hàng
                </Text>
                <Text style={{ 
                  display: 'block',
                  color: '#0D364C',
                  marginTop: '8px'
                }}>
                  {formatDate(orderData.createdAt)}
                </Text>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              {/* Order Details */}
              <div>
                <Text strong style={{ color: '#0D364C', fontSize: '14px', display: 'block', marginBottom: '16px' }}>
                  <ShoppingCartOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Chi tiết đơn hàng
                </Text>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {orderData.order_details.map((detail, index) => (
                    <div key={index} className="info-item" style={{ background: '#f8fafc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ color: '#0D364C' }}>
                          Sản phẩm #{detail.product_id}
                        </Text>
                        <Tag color="#13C2C2">
                          {formatPrice(detail.price)}
                        </Tag>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginTop: '8px',
                        color: '#666'
                      }}>
                        <Text>Số lượng: {detail.quantity}</Text>
                        <Text>Thành tiền: {formatPrice(detail.price * detail.quantity)}</Text>
                      </div>
                    </div>
                  ))}
                </Space>
              </div>
            </Space>
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
          .info-item {
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
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
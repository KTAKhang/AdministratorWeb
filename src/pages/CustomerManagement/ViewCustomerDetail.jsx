import { Modal, Button, Tag, Typography, Card, Space, Divider, Avatar } from "antd";
import { 
  EyeOutlined,
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  CloseOutlined,
  TagOutlined,
  CheckCircleOutlined,
  StopOutlined,
  TeamOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const ViewCustomerDetail = ({ visible, customerData, onClose }) => {
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
      icon={status ? <CheckCircleOutlined /> : <StopOutlined />}
      color={status ? '#52c41a' : '#ff4d4f'}
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
      {status ? 'Đang hoạt động' : 'Đã khóa'}
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
            Chi tiết Khách hàng
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
      {customerData ? (
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
                src={customerData.avatar}
                icon={!customerData.avatar && <UserOutlined />}
                style={{ 
                  backgroundColor: !customerData.avatar ? '#13C2C2' : undefined,
                  border: '3px solid #13C2C2',
                  marginBottom: '16px'
                }}
              />
              <Title level={3} style={{ 
                margin: '8px 0',
                color: '#0D364C'
              }}>
                {customerData.user_name}
              </Title>
              <Space size="small">
                <StatusTag status={customerData.status} />
                <Tag color="#13C2C2" icon={<TeamOutlined />} style={{ borderRadius: '16px', padding: '4px 12px' }}>
                  {customerData.role_id === 'r1' ? 'Khách hàng' : 'VIP'}
                </Tag>
              </Space>
            </div>

            <Divider style={{ margin: '0 0 24px 0' }} />

            {/* Info Items */}
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <TagOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  ID Khách hàng
                </Text>
                <Tag color="#0D364C" style={{ 
                  fontFamily: 'monospace',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginTop: '8px'
                }}>
                  {customerData._id}
                </Tag>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <MailOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Email
                </Text>
                <Text style={{ 
                  display: 'block',
                  color: '#0D364C',
                  marginTop: '8px'
                }}>
                  {customerData.email}
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
                  marginTop: '8px'
                }}>
                  {formatDate(customerData.createdAt)}
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
          <Text type="secondary">Đang tải thông tin khách hàng...</Text>
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

ViewCustomerDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  customerData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ViewCustomerDetail; 
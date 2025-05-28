import { Modal, Button, Descriptions, Tag, Image, Card, Space, Divider, Typography, Avatar } from "antd";
import { 
  EyeOutlined, 
  EyeInvisibleOutlined, 
  CalendarOutlined, 
  TagOutlined, 
  FileImageOutlined,
  CloseOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const ViewCategoryDetail = ({ visible, categoryData, onClose }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status tag component
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
            Chi tiết Category
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
      width={600}
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
      {categoryData ? (
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
                size={100} 
                src={categoryData.image}
                icon={!categoryData.image && <FileImageOutlined />}
                style={{ 
                  border: '3px solid #13C2C2',
                  marginBottom: '16px'
                }}
              />
              <Title level={3} style={{ 
                margin: '8px 0',
                color: '#0D364C'
              }}>
                {categoryData.name}
              </Title>
              <StatusTag status={categoryData.status} />
            </div>

            <Divider style={{ margin: '0 0 24px 0' }} />

            {/* Info Items */}
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <TagOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  ID Category
                </Text>
                <Tag color="#0D364C" style={{ 
                  fontFamily: 'monospace',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  marginTop: '8px'
                }}>
                  {categoryData._id}
                </Tag>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <TagOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Tên Category
                </Text>
                <Text style={{ 
                  display: 'block',
                  color: '#0D364C',
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  {categoryData.name}
                </Text>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <FileImageOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Hình ảnh Category
                </Text>
                <div style={{ marginTop: '12px' }}>
                  {categoryData.image ? (
                    <Image 
                      src={categoryData.image} 
                      width={200}
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '200px',
                      height: '200px',
                      background: '#f3f4f6',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9ca3af'
                    }}>
                      <FileImageOutlined style={{ fontSize: '32px' }} />
                      <Text style={{ marginTop: '8px' }}>Không có hình ảnh</Text>
                    </div>
                  )}
                </div>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <EyeOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Trạng thái hiển thị
                </Text>
                <div style={{ marginTop: '8px' }}>
                  <StatusTag status={categoryData.status} />
                </div>
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
                  {formatDate(categoryData.createdAt)}
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
          <Text type="secondary">Đang tải thông tin category...</Text>
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

ViewCategoryDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  categoryData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ViewCategoryDetail;
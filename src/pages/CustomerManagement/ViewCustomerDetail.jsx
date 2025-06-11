import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Tag, Typography, Card, Space, Divider, Avatar, Spin, Alert, Row, Col } from "antd";
import {
  EyeOutlined,
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  CloseOutlined,
  TagOutlined,
  CheckCircleOutlined,
  StopOutlined,
  TeamOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import {
  getUserByIdRequest,
  clearUserDetail
} from "../../redux/actions/userActions";

const { Title, Text } = Typography;

const ViewCustomerDetail = ({ visible, customerData, onClose }) => {
  const dispatch = useDispatch();

  // Redux state
  const {
    userDetail,
    detailLoading,
    detailError
  } = useSelector(state => state.user);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Load detail ngay khi modal mở để đảm bảo có email
  useEffect(() => {
    if (visible && customerData?._id) {
      // Luôn fetch detail để có đầy đủ thông tin bao gồm email
      dispatch(getUserByIdRequest(customerData._id));
    } else if (!visible) {
      dispatch(clearUserDetail());
    }
  }, [visible, customerData, dispatch]);

  const handleRefresh = () => {
    if (customerData?._id) {
      dispatch(getUserByIdRequest(customerData._id));
    }
  };

  // Chỉ hiển thị userDetail để đảm bảo có đầy đủ thông tin email
  const displayData = userDetail;

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
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={detailLoading}
            style={{
              borderRadius: '8px',
              borderColor: '#13C2C2',
              color: '#13C2C2'
            }}
          >
            Làm mới
          </Button>
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
        </Space>
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
      {/* Hiển thị loading khi đang fetch detail */}
      {detailLoading && (
        <Card
          bordered={false}
          style={{
            boxShadow: 'none',
            background: 'transparent'
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header with Avatar - hiển thị từ customerData */}
            <div style={{
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <Avatar
                size={120}
                src={customerData?.avatar}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: '#13C2C2',
                  border: '3px solid #13C2C2',
                  marginBottom: '16px'
                }}
                onError={() => false}
              />
              <Title level={3} style={{
                margin: '8px 0',
                color: '#0D364C'
              }}>
                {customerData?.user_name || 'Đang tải...'}
              </Title>
              <Space size="small">
                <StatusTag status={customerData?.status} />
                <Tag color="#13C2C2" icon={<TeamOutlined />} style={{ borderRadius: '16px', padding: '4px 12px' }}>
                  {customerData?.role_name || 'Khách hàng'}
                </Tag>
              </Space>
            </div>

            <Divider style={{ margin: '0 0 24px 0' }} />

            {/* Loading spinner cho phần detail */}
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Spin size="large" tip="Đang tải thông tin chi tiết..." />
            </div>
          </Space>
        </Card>
      )}

      {detailError && (
        <Alert
          message="Lỗi tải dữ liệu"
          description={detailError}
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

      {/* Chỉ hiển thị content khi có userDetail đầy đủ */}
      {!detailLoading && displayData && (
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
                src={displayData.avatar}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: '#13C2C2',
                  border: '3px solid #13C2C2',
                  marginBottom: '16px'
                }}
                onError={() => false}
              />
              <Title level={3} style={{
                margin: '8px 0',
                color: '#0D364C'
              }}>
                {displayData.user_name}
              </Title>
              <Space size="small">
                <StatusTag status={displayData.status} />
                <Tag color="#13C2C2" icon={<TeamOutlined />} style={{ borderRadius: '16px', padding: '4px 12px' }}>
                  {displayData.role_name || 'Khách hàng'}
                </Tag>
              </Space>
            </div>

            <Divider style={{ margin: '0 0 24px 0' }} />

            {/* Info Items */}
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <TagOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  ID Khách hàng:
                </Text>
                <Text style={{ marginLeft: '8px', fontSize: '14px' }}>
                  {displayData._id}
                </Text>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <MailOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Email:
                </Text>
                <Text style={{ marginLeft: '8px', fontSize: '14px' }}>
                  {displayData.email || 'Chưa có thông tin email'}
                </Text>
              </div>

              <div className="info-item">
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <TeamOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Vai trò:
                </Text>
                <Text style={{ marginLeft: '8px', fontSize: '14px' }}>
                  {displayData.role_name || 'Khách hàng'}
                </Text>
              </div>

              {displayData.createdAt && (
                <div className="info-item">
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <CalendarOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Ngày tạo tài khoản:
                  </Text>
                  <Text style={{ marginLeft: '8px', fontSize: '14px' }}>
                    {formatDate(displayData.createdAt)}
                  </Text>
                </div>
              )}

              {displayData.updatedAt && (
                <div className="info-item">
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <CalendarOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Cập nhật lần cuối:
                  </Text>
                  <Text style={{ marginLeft: '8px', fontSize: '14px' }}>
                    {formatDate(displayData.updatedAt)}
                  </Text>
                </div>
              )}
            </Space>
          </Space>
        </Card>
      )}

      {/* Fallback khi không có data và không loading */}
      {!detailLoading && !displayData && !detailError && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Text type="secondary">Không thể tải thông tin chi tiết</Text>
        </div>
      )}

      <style>
        {`
          .info-item {
            padding: 12px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 3px solid #13C2C2;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
          }
          
          .info-item:hover {
            background: #e0f7fa;
            transition: background-color 0.3s ease;
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
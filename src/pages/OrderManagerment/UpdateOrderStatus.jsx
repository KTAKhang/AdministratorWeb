import { useState, useEffect } from "react";
import { Modal, Button, Form, Select, Typography, Card, Space, Divider } from "antd";
import { 
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  ShoppingCartOutlined,
  TagOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

// Sample status options (replace with fetching from API)
const sampleStatusOptions = [
  { id: 'os1', name: 'Chờ xử lý', color: '#faad14' },
  { id: 'os2', name: 'Đang xử lý', color: '#13C2C2' },
  { id: 'os3', name: 'Đang giao', color: '#1890ff' },
  { id: 'os4', name: 'Đã giao', color: '#52c41a' },
  { id: 'os5', name: 'Đã hủy', color: '#ff4d4f' },
];

const UpdateOrderStatus = ({ visible, orderData, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && orderData) {
      form.setFieldsValue({ order_status_id: orderData.order_status_id });
    }
  }, [visible, orderData, form]);

  const handleFinish = (values) => {
    setLoading(true);
    console.log('Updating order status:', values);
    setTimeout(() => {
      setLoading(false);
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      onSuccess && onSuccess(orderData?._id, values.order_status_id);
      onClose && onClose();
    }, 1000);
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
          <EditOutlined style={{ color: '#13C2C2' }} />
          <Title level={4} style={{ margin: 0, color: '#0D364C' }}>
            Cập nhật Trạng thái Đơn hàng
          </Title>
        </div>
      }
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={500}
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
      <Card
        bordered={false}
        style={{
          boxShadow: 'none',
          background: 'transparent'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              backgroundColor: '#13C2C2', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <ShoppingCartOutlined style={{ fontSize: '24px', color: 'white' }} />
            </div>
            <Title level={4} style={{ 
              color: '#0D364C',
              margin: '0 0 8px 0'
            }}>
              Đơn hàng #{orderData?._id}
            </Title>
            <Text type="secondary">
              Cập nhật trạng thái mới cho đơn hàng
            </Text>
          </div>

          <Divider style={{ borderColor: '#13C2C2', opacity: 0.3 }} />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            size="large"
          >
            <Form.Item
              label={
                <Space>
                  <TagOutlined style={{ color: '#13C2C2' }} />
                  <span style={{ color: '#0D364C', fontWeight: '600' }}>
                    Trạng thái đơn hàng
                  </span>
                </Space>
              }
              name="order_status_id"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select 
                placeholder="Chọn trạng thái đơn hàng"
                style={{ width: '100%' }}
                options={sampleStatusOptions.map(status => ({
                  value: status.id,
                  label: status.name,
                  style: {
                    color: status.color
                  }
                }))}
              />
            </Form.Item>

            <Divider style={{ borderColor: '#13C2C2', opacity: 0.3 }} />

            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button 
                  onClick={onClose}
                  size="large"
                  icon={<CloseOutlined />}
                  style={{
                    height: '44px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    minWidth: '120px',
                    borderColor: '#d9d9d9',
                    color: '#666'
                  }}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                  style={{
                    backgroundColor: loading ? '#94a3b8' : '#13C2C2',
                    borderColor: loading ? '#94a3b8' : '#13C2C2',
                    height: '44px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    minWidth: '140px'
                  }}
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Space>
      </Card>

      <style>
        {`
          .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
            border-color: #13C2C2 !important;
          }

          .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
            border-color: #13C2C2 !important;
            box-shadow: 0 0 0 2px rgba(19, 194, 194, 0.1) !important;
          }

          .ant-btn-primary:hover {
            background-color: #0D364C !important;
            border-color: #0D364C !important;
          }

          .ant-modal-content {
            border-radius: 12px !important;
          }
        `}
      </style>
    </Modal>
  );
};

UpdateOrderStatus.propTypes = {
  visible: PropTypes.bool.isRequired,
  orderData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default UpdateOrderStatus; 
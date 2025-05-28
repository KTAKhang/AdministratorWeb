import { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Switch, 
  Upload, 
  Modal, 
  Select,
  Space,
  Typography,
  Divider,
  message,
  Avatar
} from "antd";
import { 
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
  MailOutlined,
  TeamOutlined,
  UploadOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

// Sample roles data
const sampleRoles = [
  { id: 'r1', name: 'Khách hàng' },
  { id: 'r2', name: 'VIP' },
];

const UpdateCustomer = ({ visible, customerData, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible && customerData) {
      form.setFieldsValue({
        user_name: customerData.user_name,
        email: customerData.email,
        role_id: customerData.role_id,
        status: customerData.status,
      });
      if (customerData.avatar) {
        setFileList([
          {
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: customerData.avatar,
          },
        ]);
      } else {
        setFileList([]);
      }
    } else if (!visible) {
      form.resetFields();
      setFileList([]);
      setPreviewImage("");
      setModalVisible(false);
    }
  }, [visible, customerData, form]);

  const handleFinish = (values) => {
    setLoading(true);
    console.log('Updating customer:', values);
    setTimeout(() => {
      setLoading(false);
      message.success('Cập nhật thông tin khách hàng thành công!');
      onSuccess && onSuccess(customerData._id, values);
      onClose && onClose();
    }, 1000);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setModalVisible(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length === 0) {
      form.setFieldValue('avatar', null);
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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
            Cập nhật Thông tin Khách hàng
          </Title>
        </div>
      }
      onCancel={onClose}
      footer={null}
      destroyOnClose
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
      <Card
        bordered={false}
        style={{
          boxShadow: 'none',
          background: 'transparent'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          size="large"
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header with Avatar */}
            <div style={{ textAlign: 'center' }}>
              <Avatar 
                size={120}
                src={customerData?.avatar}
                icon={!customerData?.avatar && <UserOutlined />}
                style={{ 
                  backgroundColor: !customerData?.avatar ? '#13C2C2' : undefined,
                  border: '3px solid #13C2C2',
                  marginBottom: '16px'
                }}
              />
              <Title level={4} style={{ 
                color: '#0D364C',
                margin: '0 0 8px 0'
              }}>
                {customerData?.user_name}
              </Title>
              <Text type="secondary">
                Cập nhật thông tin khách hàng
              </Text>
            </div>

            <Divider style={{ borderColor: '#13C2C2', opacity: 0.3 }} />

            <Form.Item
              label={
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <UserOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Tên người dùng
                </Text>
              }
              name="user_name"
              rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
            >
              <Input 
                placeholder="Nhập tên người dùng"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item
              label={
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <MailOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Email
                </Text>
              }
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: 'email', message: "Email không hợp lệ!" }
              ]}
            >
              <Input 
                placeholder="Nhập email"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item
              label={
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <TeamOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Vai trò
                </Text>
              }
              name="role_id"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Select 
                placeholder="Chọn vai trò"
                style={{ borderRadius: '8px' }}
              >
                {sampleRoles.map(role => (
                  <Select.Option key={role.id} value={role.id}>
                    {role.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  <UploadOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                  Avatar
                </Text>
              }
              name="avatar"
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                onPreview={handlePreview}
                onChange={handleChange}
                fileList={fileList}
                className="avatar-upload"
              >
                {fileList.length < 1 && (
                  <div style={{ color: '#13C2C2' }}>
                    <UploadOutlined />
                    <div style={{ marginTop: 8, fontSize: '12px' }}>Tải ảnh lên</div>
                  </div>
                )}
              </Upload>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Định dạng: JPG, PNG. Kích thước tối đa: 2MB
              </Text>
            </Form.Item>

            <Form.Item
              label={
                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                  Trạng thái tài khoản
                </Text>
              }
              name="status"
              valuePropName="checked"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Switch 
                  checkedChildren="Hoạt động" 
                  unCheckedChildren="Khóa"
                  style={{
                    backgroundColor: '#13C2C2'
                  }}
                />
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  Bật/tắt để thay đổi trạng thái tài khoản
                </Text>
              </div>
            </Form.Item>

            <Divider style={{ margin: '24px 0' }} />

            <Form.Item style={{ marginBottom: 0 }}>
              <Space size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
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
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  style={{
                    backgroundColor: loading ? '#94a3b8' : '#0D364C',
                    borderColor: loading ? '#94a3b8' : '#0D364C',
                    borderRadius: '8px',
                    fontWeight: '500',
                    minWidth: '140px'
                  }}
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
      </Card>

      {/* Image Preview Modal */}
      <Modal 
        open={modalVisible} 
        footer={null} 
        onCancel={() => setModalVisible(false)}
        centered
        width={500}
        style={{
          borderRadius: '12px'
        }}
        styles={{
          header: {
            borderBottom: '1px solid #e5e7eb',
            borderRadius: '12px 12px 0 0'
          }
        }}
      >
        <img 
          alt="preview" 
          style={{ 
            width: '100%', 
            borderRadius: '8px',
            maxHeight: '400px',
            objectFit: 'contain'
          }} 
          src={previewImage} 
        />
      </Modal>

      <style>
        {`
          .avatar-upload .ant-upload-select {
            border: 2px dashed #13C2C2 !important;
            border-radius: 8px !important;
            background-color: #f0fdfd !important;
            transition: all 0.3s ease;
          }
          
          .avatar-upload .ant-upload-select:hover {
            border-color: #0D364C !important;
            background-color: #ecfeff !important;
          }
          
          .avatar-upload .ant-upload-list-picture-card-container {
            border-radius: 8px !important;
          }
          
          .ant-form-item-label > label {
            font-weight: 600 !important;
          }
          
          .ant-input:focus,
          .ant-input-focused {
            border-color: #13C2C2 !important;
            box-shadow: 0 0 0 2px rgba(19, 194, 194, 0.2) !important;
          }

          .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
            border-color: #13C2C2 !important;
          }

          .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
            border-color: #13C2C2 !important;
            box-shadow: 0 0 0 2px rgba(19, 194, 194, 0.1) !important;
          }
        `}
      </style>
    </Modal>
  );
};

UpdateCustomer.propTypes = {
  visible: PropTypes.bool.isRequired,
  customerData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default UpdateCustomer; 
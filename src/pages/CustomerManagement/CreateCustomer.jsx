import { useState } from "react";
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
  PlusOutlined,
  UserOutlined,
  MailOutlined,
  TeamOutlined,
  UploadOutlined,
  LockOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

// Sample roles data
const sampleRoles = [
  { id: 'r1', name: 'Khách hàng' },
  { id: 'r2', name: 'VIP' },
];

const CreateCustomer = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [switchValue, setSwitchValue] = useState(true);

  const handleFinish = (values) => {
    setLoading(true);
    console.log('Creating customer:', values);
    setTimeout(() => {
      setLoading(false);
      message.success('Thêm khách hàng thành công!');
      onSuccess && onSuccess(values);
      form.resetFields();
      setFileList([]);
      setSwitchValue(true);
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

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleSwitchChange = (checked) => {
    setSwitchValue(checked);
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
      title={null}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={600}
      styles={{
        body: { padding: '0' },
        header: { display: 'none' }
      }}
    >
      <Card style={{ borderRadius: '8px', border: 'none', boxShadow: 'none' }}>
        <div style={{ padding: '8px 0' }}>
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
                <PlusOutlined style={{ fontSize: '24px', color: 'white' }} />
              </div>
              <Title level={3} style={{ 
                color: '#0D364C',
                marginBottom: '24px',
                fontWeight: '700'
              }}>
                Thêm Khách hàng Mới
              </Title>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Thêm khách hàng mới vào hệ thống của bạn
              </Text>
            </div>

            <Divider style={{ borderColor: '#13C2C2', opacity: 0.3 }} />

            {/* Form */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{ status: true }}
              size="large"
            >
              <Form.Item
                label={
                  <Space>
                    <UserOutlined style={{ color: '#13C2C2' }} />
                    <span style={{ color: '#0D364C', fontWeight: '600' }}>
                      Tên người dùng
                    </span>
                  </Space>
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
                  <Space>
                    <MailOutlined style={{ color: '#13C2C2' }} />
                    <span style={{ color: '#0D364C', fontWeight: '600' }}>
                      Email
                    </span>
                  </Space>
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
                  <Space>
                    <LockOutlined style={{ color: '#13C2C2' }} />
                    <span style={{ color: '#0D364C', fontWeight: '600' }}>
                      Mật khẩu
                    </span>
                  </Space>
                }
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
                ]}
              >
                <Input.Password 
                  placeholder="Nhập mật khẩu"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <TeamOutlined style={{ color: '#13C2C2' }} />
                    <span style={{ color: '#0D364C', fontWeight: '600' }}>
                      Vai trò
                    </span>
                  </Space>
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
                  <Space>
                    <UploadOutlined style={{ color: '#13C2C2' }} />
                    <span style={{ color: '#0D364C', fontWeight: '600' }}>
                      Avatar
                    </span>
                  </Space>
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
                >
                  {fileList.length < 1 && (
                    <div style={{ padding: '20px 0' }}>
                      <UploadOutlined style={{
                        color: '#13C2C2',
                        fontSize: '24px'
                      }} />
                      <div style={{ 
                        marginTop: 8, 
                        color: '#13C2C2', 
                        fontWeight: '500',
                        fontSize: '14px'
                      }}>
                        Tải ảnh lên
                      </div>
                      <div style={{ 
                        color: '#999', 
                        fontSize: '12px',
                        marginTop: '4px'
                      }}>
                        PNG, JPG tối đa 2MB
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item
                label={
                  <span style={{ color: '#0D364C', fontWeight: '600' }}>
                    Trạng thái tài khoản
                  </span>
                }
                name="status"
                valuePropName="checked"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Switch 
                    checkedChildren="Hoạt động" 
                    unCheckedChildren="Khóa"
                    onChange={handleSwitchChange}
                    defaultChecked={true}
                    style={{
                      backgroundColor: switchValue ? '#13C2C2' : undefined
                    }}
                  />
                  <Text style={{ color: '#666', fontSize: '14px' }}>
                    {switchValue ? 'Tài khoản sẽ được kích hoạt' : 'Tài khoản sẽ bị khóa'}
                  </Text>
                </div>
              </Form.Item>

              <Divider style={{ borderColor: '#13C2C2', opacity: 0.3 }} />

              {/* Actions */}
              <Form.Item style={{ marginBottom: 0 }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Button 
                    onClick={onClose}
                    size="large"
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
                    icon={<PlusOutlined />}
                    size="large"
                    style={{
                      backgroundColor: '#13C2C2',
                      borderColor: '#13C2C2',
                      height: '44px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      minWidth: '140px'
                    }}
                  >
                    Thêm Khách hàng
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Space>
        </div>
      </Card>

      {/* Preview Modal */}
      <Modal
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={400}
      >
        <img 
          alt="preview" 
          style={{ 
            width: "100%", 
            borderRadius: '8px',
            maxHeight: '400px',
            objectFit: 'contain'
          }} 
          src={previewImage} 
        />
      </Modal>

      <style>
        {`
          .ant-upload-select-picture-card {
            border: 2px dashed #13C2C2 !important;
            border-radius: 8px !important;
            background-color: #f8fdfd !important;
          }
          
          .ant-upload-select-picture-card:hover {
            border-color: #0D364C !important;
          }
          
          .ant-switch-checked {
            background-color: #13C2C2 !important;
          }
          
          .ant-input:focus,
          .ant-input-number-focused {
            border-color: #13C2C2 !important;
            box-shadow: 0 0 0 2px rgba(19, 194, 194, 0.1) !important;
          }
          
          .ant-btn-primary:hover {
            background-color: #0D364C !important;
            border-color: #0D364C !important;
          }

          .ant-form-item-label > label {
            color: #0D364C !important;
            font-weight: 600 !important;
          }

          .ant-modal-content {
            border-radius: 12px !important;
          }

          .ant-card {
            border-radius: 8px !important;
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

CreateCustomer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default CreateCustomer;
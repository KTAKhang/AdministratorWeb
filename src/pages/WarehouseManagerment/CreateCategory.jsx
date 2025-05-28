import { useState } from "react";
import { Form, Input, Button, Card, Switch, Upload, Modal, Typography, Space, Divider } from "antd";
import { PlusOutlined, UploadOutlined, CameraOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const CreateCategory = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [switchValue, setSwitchValue] = useState(true);

  const handleFinish = () => {
    setLoading(true);
    // Giả lập tạo category thành công
    setTimeout(() => {
      setLoading(false);
      form.resetFields();
      setSwitchValue(true);
      onSuccess && onSuccess();
      onClose && onClose();
    }, 1000);
  };

  const handlePreview = async (file) => {
    setPreviewImage(file.thumbUrl || file.url);
    setModalVisible(true);
  };

  const handleSwitchChange = (checked) => {
    setSwitchValue(checked);
  };

  const customStyles = {
    modal: {
      borderRadius: '12px',
    },
    card: {
      borderRadius: '8px',
      border: 'none',
      boxShadow: 'none',
    },
    primaryButton: {
      backgroundColor: '#13C2C2',
      borderColor: '#13C2C2',
      height: '44px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '16px',
    },
    title: {
      color: '#0D364C',
      marginBottom: '24px',
      fontWeight: '700',
    },
    label: {
      color: '#0D364C',
      fontWeight: '600',
      fontSize: '14px',
    },
    input: {
      borderRadius: '8px',
      height: '40px',
      borderColor: '#d9d9d9',
    },
    divider: {
      borderColor: '#13C2C2',
      opacity: 0.3,
    }
  };

  return (
    <>
      <Modal
        open={visible}
        title={null}
        onCancel={onClose}
        footer={null}
        destroyOnClose
        width={500}
        styles={{
          body: { padding: '0' },
          header: { display: 'none' }
        }}
      >
        <Card style={customStyles.card}>
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
                <Title level={3} style={customStyles.title}>
                  Tạo Category Mới
                </Title>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  Thêm category mới vào hệ thống của bạn
                </Text>
              </div>

              <Divider style={customStyles.divider} />

              {/* Form */}
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ status: true }}
                size="large"
              >
                <Form.Item
                  label={<span style={customStyles.label}>Tên Category</span>}
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập tên category!" }]}
                >
                  <Input 
                    placeholder="Nhập tên category" 
                    style={customStyles.input}
                  />
                </Form.Item>

                <Form.Item label={<span style={customStyles.label}>Hình ảnh</span>} name="image">
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    beforeUpload={() => false}
                    onPreview={handlePreview}
                  >
                    <div style={{ padding: '20px 0' }}>
                      <CameraOutlined style={{
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
                  </Upload>
                </Form.Item>

                <Form.Item
                  label={<span style={customStyles.label}>Trạng thái hiển thị</span>}
                  name="status"
                  valuePropName="checked"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Switch 
                      checkedChildren="Hiển thị" 
                      unCheckedChildren="Ẩn"
                      onChange={handleSwitchChange}
                      defaultChecked={true}
                    />
                    <Text style={{ color: '#666', fontSize: '14px' }}>
                      {switchValue ? 'Category sẽ được hiển thị công khai' : 'Category sẽ được ẩn'}
                    </Text>
                  </div>
                </Form.Item>

                <Divider style={customStyles.divider} />

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
                        ...customStyles.primaryButton,
                        minWidth: '140px',
                      }}
                    >
                      Tạo Category
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Space>
          </div>
        </Card>
      </Modal>

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

      <style>{`
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
        
        .ant-input:focus {
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
      `}</style>
    </>
  );
};

CreateCategory.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default CreateCategory;
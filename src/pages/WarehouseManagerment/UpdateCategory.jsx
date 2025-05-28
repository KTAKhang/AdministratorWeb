import { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Switch, 
  Upload, 
  Modal, 
  Space,
  Typography,
  Divider,
  message,
  Row,
  Col
} from "antd";
import { 
  PlusOutlined, 
  UploadOutlined, 
  EditOutlined,
  SaveOutlined,
  CloseOutlined 
} from "@ant-design/icons";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const UpdateCategory = ({ visible, categoryData, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible && categoryData) {
      form.setFieldsValue({
        name: categoryData.name,
        status: categoryData.status,
      });
      // Set initial image if exists
      if (categoryData.image) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: categoryData.image,
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
  }, [visible, categoryData, form]);

  const handleFinish = (values) => {
    setLoading(true);
    // Simulated update
    console.log('Updating category:', values);
    setTimeout(() => {
      setLoading(false);
      message.success('Cập nhật category thành công!');
      // Simulate success
      onSuccess && onSuccess(categoryData._id, values);
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
      form.setFieldValue('image', null);
    }
  };

  // Helper function for image preview
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const uploadButton = (
    <div style={{ color: '#13C2C2' }}>
      <PlusOutlined />
      <div style={{ marginTop: 8, fontSize: '12px' }}>Tải ảnh lên</div>
    </div>
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
          <EditOutlined style={{ color: '#13C2C2' }} />
          <Title level={4} style={{ margin: 0, color: '#0D364C' }}>
            Cập nhật Category
          </Title>
        </div>
      }
      onCancel={onClose}
      footer={null}
      destroyOnClose
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
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    Tên Category
                  </Text>
                }
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên category!" },
                  { min: 2, message: "Tên category phải có ít nhất 2 ký tự!" }
                ]}
              >
                <Input 
                  placeholder="Nhập tên category" 
                  style={{
                    borderRadius: '8px',
                    borderColor: '#d1d5db',
                    fontSize: '14px'
                  }}
                  styles={{
                    input: {
                      '&:focus': {
                        borderColor: '#13C2C2',
                        boxShadow: '0 0 0 2px rgba(19, 194, 194, 0.2)'
                      }
                    }
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Divider 
                style={{ 
                  margin: '16px 0',
                  borderColor: '#e5e7eb'
                }} 
              />
            </Col>

            <Col span={24}>
              <Form.Item 
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    Hình ảnh Category
                  </Text>
                }
                name="image"
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  fileList={fileList}
                  style={{
                    width: '100%'
                  }}
                  className="category-upload"
                >
                  {fileList.length < 1 && uploadButton}
                </Upload>
                <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                  Định dạng: JPG, PNG. Kích thước tối đa: 2MB
                </Text>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Divider 
                style={{ 
                  margin: '16px 0',
                  borderColor: '#e5e7eb'
                }} 
              />
            </Col>

            <Col span={24}>
              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    Trạng thái hiển thị
                  </Text>
                }
                name="status"
                valuePropName="checked"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Switch 
                    checkedChildren="Hiển thị" 
                    unCheckedChildren="Ẩn"
                    style={{
                      backgroundColor: '#13C2C2'
                    }}
                    styles={{
                      track: {
                        backgroundColor: '#13C2C2'
                      }
                    }}
                  />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Bật/tắt để hiển thị category trên website
                  </Text>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '24px 0', borderColor: '#e5e7eb' }} />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                size="large"
                onClick={onClose}
                style={{
                  borderRadius: '8px',
                  borderColor: '#d1d5db',
                  color: '#6b7280'
                }}
                icon={<CloseOutlined />}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<SaveOutlined />}
                style={{
                  backgroundColor: loading ? '#94a3b8' : '#0D364C',
                  borderColor: loading ? '#94a3b8' : '#0D364C',
                  borderRadius: '8px',
                  fontWeight: '500',
                  minWidth: '140px'
                }}
                styles={{
                  '&:hover': {
                    backgroundColor: '#1e40af !important',
                    borderColor: '#1e40af !important'
                  }
                }}
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật Category'}
              </Button>
            </Space>
          </Form.Item>
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

      <style jsx>{`
        .category-upload .ant-upload-select {
          border: 2px dashed #13C2C2 !important;
          border-radius: 8px !important;
          background-color: #f0fdfd !important;
          transition: all 0.3s ease;
        }
        
        .category-upload .ant-upload-select:hover {
          border-color: #0D364C !important;
          background-color: #ecfeff !important;
        }
        
        .category-upload .ant-upload-list-picture-card-container {
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
      `}</style>
    </Modal>
  );
};

UpdateCategory.propTypes = {
  visible: PropTypes.bool.isRequired,
  categoryData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default UpdateCategory;
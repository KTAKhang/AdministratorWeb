import { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Switch, 
  Upload, 
  Modal, 
  InputNumber, 
  Select,
  Space,
  Typography,
  Divider,
  message,
  Row,
  Col
} from "antd";
import { 
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DollarOutlined,
  ShoppingOutlined,
  ShopOutlined,
  UserOutlined,
  InfoCircleOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const sampleCategories = [
  { _id: "c1", name: "Điện thoại" },
  { _id: "c2", name: "Laptop" },
  { _id: "c3", name: "Phụ kiện" },
];

const UpdateProduct = ({ visible, productData, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState(sampleCategories);

  useEffect(() => {
    if (visible && productData) {
      form.setFieldsValue({
        name: productData.name,
        price: productData.price,
        quantity: productData.quantity,
        short_desc: productData.short_desc,
        detail_desc: productData.detail_desc,
        factory: productData.factory,
        target: productData.target,
        status: productData.status,
        category_id: productData.category_id,
      });
      if (productData.image) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: productData.image,
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
  }, [visible, productData, form]);

  const handleFinish = (values) => {
    setLoading(true);
    console.log('Updating product:', values);
    setTimeout(() => {
      setLoading(false);
      message.success('Cập nhật sản phẩm thành công!');
      onSuccess && onSuccess(productData._id, values);
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
            Cập nhật Sản phẩm
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
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <AppstoreOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Danh mục sản phẩm
                  </Text>
                }
                name="category_id"
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              >
                <Select 
                  placeholder="Chọn danh mục sản phẩm"
                  style={{
                    borderRadius: '8px'
                  }}
                >
                  {categories.map(cat => (
                    <Select.Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <ShoppingOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Tên sản phẩm
                  </Text>
                }
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                  { min: 2, message: "Tên sản phẩm phải có ít nhất 2 ký tự!" }
                ]}
              >
                <Input 
                  placeholder="Nhập tên sản phẩm" 
                  style={{
                    borderRadius: '8px'
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <DollarOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Giá sản phẩm
                  </Text>
                }
                name="price"
                rules={[
                  { required: true, message: "Vui lòng nhập giá!" },
                  { type: 'number', min: 0, message: "Giá không được âm!" }
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%', borderRadius: '8px' }}
                  placeholder="Nhập giá sản phẩm"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <ShoppingOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Số lượng
                  </Text>
                }
                name="quantity"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng!" },
                  { type: 'number', min: 0, message: "Số lượng không được âm!" }
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%', borderRadius: '8px' }}
                  placeholder="Nhập số lượng"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <ShopOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Nhà sản xuất
                  </Text>
                }
                name="factory"
                rules={[{ required: true, message: "Vui lòng nhập nhà sản xuất!" }]}
              >
                <Input 
                  placeholder="Nhập nhà sản xuất"
                  style={{
                    borderRadius: '8px'
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Divider style={{ margin: '8px 0' }} />
            </Col>

            <Col span={24}>
              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <InfoCircleOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Mô tả ngắn
                  </Text>
                }
                name="short_desc"
                rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn!" }]}
              >
                <Input.TextArea 
                  rows={2}
                  placeholder="Nhập mô tả ngắn"
                  style={{
                    borderRadius: '8px'
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <InfoCircleOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Mô tả chi tiết
                  </Text>
                }
                name="detail_desc"
                rules={[{ required: true, message: "Vui lòng nhập mô tả chi tiết!" }]}
              >
                <Input.TextArea 
                  rows={4}
                  placeholder="Nhập mô tả chi tiết"
                  style={{
                    borderRadius: '8px'
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <UserOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Đối tượng
                  </Text>
                }
                name="target"
                rules={[{ required: true, message: "Vui lòng nhập đối tượng!" }]}
              >
                <Input 
                  placeholder="Nhập đối tượng sử dụng"
                  style={{
                    borderRadius: '8px'
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Divider style={{ margin: '8px 0' }} />
            </Col>

            <Col span={24}>
              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    Hình ảnh sản phẩm
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
                  className="product-upload"
                >
                  {fileList.length < 1 && uploadButton}
                </Upload>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Định dạng: JPG, PNG. Kích thước tối đa: 2MB
                </Text>
              </Form.Item>
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
                  />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Bật/tắt để hiển thị sản phẩm trên website
                  </Text>
                </div>
              </Form.Item>
            </Col>
          </Row>

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
                {loading ? 'Đang cập nhật...' : 'Cập nhật Sản phẩm'}
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
        .product-upload .ant-upload-select {
          border: 2px dashed #13C2C2 !important;
          border-radius: 8px !important;
          background-color: #f0fdfd !important;
          transition: all 0.3s ease;
        }
        
        .product-upload .ant-upload-select:hover {
          border-color: #0D364C !important;
          background-color: #ecfeff !important;
        }
        
        .product-upload .ant-upload-list-picture-card-container {
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

UpdateProduct.propTypes = {
  visible: PropTypes.bool.isRequired,
  productData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default UpdateProduct;
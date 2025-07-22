import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Upload, Modal, InputNumber, Select, Typography, Space, Divider, message } from "antd";
import {
  PlusOutlined,
  CameraOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ShopOutlined,
  UserOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createProductRequest } from "../../redux/actions/productActions";
import { fetchCategoryRequest } from "../../redux/actions/categoryActions";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const CreateProduct = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { createLoading = false } = useSelector(state => state.product || {});
  const { categories = [], loading: categoryLoading } = useSelector(state => state.category || {});

  // Fetch categories when modal opens
  useEffect(() => {
    if (visible) {
      dispatch(fetchCategoryRequest({ page: 1, limit: 100 }));
    }
  }, [visible, dispatch]);

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setFileList([]);
      setPreviewImage("");
      setModalVisible(false);
      setIsSubmitting(false);
    } else {
      // Khi mở modal, đảm bảo form có giá trị mặc định đúng
      form.setFieldsValue({ quantity: 1, price: 1000 });
    }
  }, [visible, form]);

  // Filter active categories
  const activeCategories = categories.filter(cat => cat.status);

  const handleFinish = async (values) => {
    // Prevent double submission
    if (isSubmitting || createLoading) {
      return;
    }

    try {
      setIsSubmitting(true);

      const requiredFields = ['name', 'category_id', 'price', 'short_desc', 'detail_desc', 'quantity', 'factory', 'target'];
      for (const field of requiredFields) {
        if (!values[field] && values[field] !== 0) {
          message.error(`Thiếu thông tin bắt buộc: ${field}`);
          setIsSubmitting(false);
          return;
        }
      }

      // Validate category exists
      if (!activeCategories.find(cat => cat._id === values.category_id)) {
        message.error('Danh mục được chọn không hợp lệ!');
        setIsSubmitting(false);
        return;
      }

      // Get image file from form or fileList
      let imageFile = null;
      if (values.image && Array.isArray(values.image) && values.image.length > 0) {
        imageFile = values.image[0].originFileObj || values.image[0];
      } else if (fileList.length > 0) {
        imageFile = fileList[0].originFileObj || fileList[0];
      }

      if (!imageFile) {
        message.error('Vui lòng chọn hình ảnh cho sản phẩm!');
        setIsSubmitting(false);
        return;
      }

      // Validate image file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(imageFile.type)) {
        message.error('Chỉ hỗ trợ file ảnh định dạng JPG, JPEG, PNG!');
        setIsSubmitting(false);
        return;
      }

      if (imageFile.size > maxSize) {
        message.error('Kích thước file ảnh không được vượt quá 2MB!');
        setIsSubmitting(false);
        return;
      }

      // Check token
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để thực hiện chức năng này!');
        setIsSubmitting(false);
        return;
      }

      // Create FormData
      const formData = new FormData();

      // Add image
      formData.append('image', imageFile);

      // Add all required fields
      formData.append('name', values.name.trim());
      formData.append('category_id', values.category_id);
      formData.append('price', values.price);
      formData.append('short_desc', values.short_desc.trim());
      formData.append('detail_desc', values.detail_desc.trim());
      formData.append('quantity', values.quantity);
      formData.append('factory', values.factory.trim());
      formData.append('target', values.target.trim());
      formData.append('sold', 0); // Default value

      
      for (let [key, value] of formData.entries()) {
        console.log(key + ': ', value);
      }
     

      // Dispatch create action
      dispatch(createProductRequest({
        formData,
        onSuccess: () => {
          // message.success('Tạo sản phẩm thành công!');
          form.resetFields();
          setFileList([]);
          setPreviewImage("");
          setModalVisible(false);
          setIsSubmitting(false);
          onSuccess && onSuccess();
          onClose && onClose();
        }
      }));

    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo sản phẩm!');
      console.error('Error creating product:', error);
      setIsSubmitting(false);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setModalVisible(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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
        width={600}
        confirmLoading={createLoading || isSubmitting}
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
                  Tạo Sản phẩm Mới
                </Title>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  Thêm sản phẩm mới vào hệ thống của bạn
                </Text>
              </div>

              <Divider style={customStyles.divider} />

              {/* Form */}
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                                  initialValues={{ quantity: 1, price: 1000 }}
                size="large"
              >
                <Form.Item
                  label={
                    <Space>
                      <AppstoreOutlined style={{ color: '#13C2C2' }} />
                      <span style={customStyles.label}>Danh mục sản phẩm</span>
                    </Space>
                  }
                  name="category_id"
                  rules={[{ required: true, message: "Vui lòng chọn danh mục sản phẩm!" }]}
                >
                  <Select
                    placeholder="Chọn danh mục sản phẩm"
                    style={customStyles.input}
                    loading={categoryLoading}
                    notFoundContent={
                      <div style={{ padding: '12px', textAlign: 'center' }}>
                        {categoryLoading ? 'Đang tải danh mục...' : 'Không tìm thấy danh mục nào'}
                      </div>
                    }
                  >
                    {activeCategories.map(cat => (
                      <Select.Option key={cat._id} value={cat._id}>
                        {cat.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <Space>
                      <ShoppingOutlined style={{ color: '#13C2C2' }} />
                      <span style={customStyles.label}>Tên sản phẩm</span>
                    </Space>
                  }
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                    { min: 2, message: "Tên sản phẩm phải có ít nhất 2 ký tự!" },
                    { max: 100, message: "Tên sản phẩm không được vượt quá 100 ký tự!" },
                    { whitespace: true, message: "Tên sản phẩm không được chỉ chứa khoảng trắng!" }
                  ]}
                >
                  <Input
                    placeholder="Nhập tên sản phẩm (2-100 ký tự)"
                    style={customStyles.input}
                    maxLength={100}
                    showCount
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <Space>
                      <DollarOutlined style={{ color: '#13C2C2' }} />
                      <span style={customStyles.label}>Giá sản phẩm</span>
                    </Space>
                  }
                  name="price"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá sản phẩm!" },
                    { type: 'number', min: 1000, message: "Giá sản phẩm phải ít nhất 1,000 VNĐ!" },
                    { type: 'number', max: 1000000000, message: "Giá sản phẩm không được vượt quá 1 tỷ VNĐ!" }
                  ]}
                >
                  <InputNumber
                    min={1000}
                    max={1000000000}
                    style={{ width: '100%', ...customStyles.input }}
                    placeholder="Nhập giá sản phẩm (tối thiểu 1,000 VNĐ)"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <Space>
                      <ShoppingOutlined style={{ color: '#13C2C2' }} />
                      <span style={customStyles.label}>Số lượng</span>
                    </Space>
                  }
                  name="quantity"
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng sản phẩm!" },
                    { type: 'number', min: 1, message: "Số lượng phải ít nhất là 1!" },
                    { type: 'number', max: 100000, message: "Số lượng không được vượt quá 100,000!" },
                    {
                      validator: (_, value) => {
                        if (value && !Number.isInteger(value)) {
                          return Promise.reject(new Error('Số lượng phải là số nguyên!'));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={100000}
                    style={{ width: '100%', ...customStyles.input }}
                    placeholder="Nhập số lượng (1-100,000)"
                    precision={0}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <Space>
                      <InfoCircleOutlined style={{ color: '#13C2C2' }} />
                      <span style={customStyles.label}>Mô tả ngắn</span>
                    </Space>
                  }
                  name="short_desc"
                  rules={[
                    { required: true, message: "Vui lòng nhập mô tả ngắn!" },
                    { min: 10, message: "Mô tả ngắn phải có ít nhất 10 ký tự!" },
                    { max: 200, message: "Mô tả ngắn không được vượt quá 200 ký tự!" },
                    { whitespace: true, message: "Mô tả ngắn không được chỉ chứa khoảng trắng!" }
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    placeholder="Nhập mô tả ngắn (ít nhất 10 ký tự)"
                    style={{ borderRadius: '8px' }}
                    showCount
                    maxLength={200}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <Space>
                      <InfoCircleOutlined style={{ color: '#13C2C2' }} />
                      <span style={customStyles.label}>Mô tả chi tiết</span>
                    </Space>
                  }
                  name="detail_desc"
                  rules={[
                    { required: true, message: "Vui lòng nhập mô tả chi tiết!" },
                    { min: 10, message: "Mô tả chi tiết phải có ít nhất 10 ký tự!" },
                    { max: 1000, message: "Mô tả chi tiết không được vượt quá 1,000 ký tự!" },
                    { whitespace: true, message: "Mô tả chi tiết không được chỉ chứa khoảng trắng!" }
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Nhập mô tả chi tiết (ít nhất 10 ký tự)"
                    style={{ borderRadius: '8px' }}
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <Space>
                      <ShopOutlined style={{ color: '#13C2C2' }} />
                      <span style={customStyles.label}>Nhà sản xuất</span>
                    </Space>
                  }
                  name="factory"
                  rules={[
                    { required: true, message: "Vui lòng nhập nhà sản xuất!" },
                    { min: 2, message: "Tên nhà sản xuất phải có ít nhất 2 ký tự!" },
                    { max: 100, message: "Tên nhà sản xuất không được vượt quá 100 ký tự!" },
                    { whitespace: true, message: "Tên nhà sản xuất không được chỉ chứa khoảng trắng!" }
                  ]}
                >
                  <Input
                    placeholder="Nhập nhà sản xuất (2-100 ký tự)"
                    style={customStyles.input}
                    maxLength={100}
                    showCount
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <Space>
                      <UserOutlined style={{ color: '#13C2C2' }} />
                      <span style={customStyles.label}>Đối tượng</span>
                    </Space>
                  }
                  name="target"
                  rules={[
                    { required: true, message: "Vui lòng nhập đối tượng sử dụng!" },
                    { min: 2, message: "Đối tượng sử dụng phải có ít nhất 2 ký tự!" },
                    { max: 100, message: "Đối tượng sử dụng không được vượt quá 100 ký tự!" },
                    { whitespace: true, message: "Đối tượng sử dụng không được chỉ chứa khoảng trắng!" }
                  ]}
                >
                  <Input
                    placeholder="Nhập đối tượng sử dụng (2-100 ký tự)"
                    style={customStyles.input}
                    maxLength={100}
                    showCount
                  />
                </Form.Item>

                <Form.Item
                  label={<span style={customStyles.label}>Hình ảnh sản phẩm</span>}
                  name="image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                  rules={[
                    { required: true, message: "Vui lòng chọn hình ảnh cho sản phẩm!" }
                  ]}
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
                    )}
                  </Upload>
                </Form.Item>

                <Divider style={customStyles.divider} />

                {/* Actions */}
                <Form.Item style={{ marginBottom: 0 }}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Button
                      onClick={onClose}
                      size="large"
                      disabled={isSubmitting || createLoading}
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
                      loading={createLoading || isSubmitting}
                      icon={<PlusOutlined />}
                      size="large"
                      disabled={isSubmitting || createLoading}
                      style={{
                        ...customStyles.primaryButton,
                        minWidth: '140px',
                      }}
                    >
                      {(createLoading || isSubmitting) ? 'Đang tạo...' : 'Tạo Sản phẩm'}
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
      `}</style>
    </>
  );
};

CreateProduct.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default CreateProduct;
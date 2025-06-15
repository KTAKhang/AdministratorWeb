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
  message
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
import { useDispatch, useSelector } from "react-redux";
import { updateProductRequest } from "../../redux/actions/productActions";
import { fetchCategoryRequest } from "../../redux/actions/categoryActions";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const UpdateProduct = ({ visible, productData, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [statusValue, setStatusValue] = useState(true);

  const dispatch = useDispatch();
  const { updateLoading = false } = useSelector(state => state.product || {});
  const { categories = [], loading: categoryLoading } = useSelector(state => state.category || {});

  // Fetch categories when modal opens - prioritize this
  useEffect(() => {
    if (visible) {
      // Fetch categories ngay khi modal mở để đảm bảo có data trước khi set form
      dispatch(fetchCategoryRequest({ page: 1, limit: 100 }));
    }
  }, [visible, dispatch]);

  // Filter active categories
  const activeCategories = categories.filter(cat => cat.status);

  // Helper function to extract category ID
  const extractCategoryId = (categoryData, productData) => {
    // Ưu tiên lấy từ categoryDetail nếu có
    if (productData?.categoryDetail?._id) {
      return productData.categoryDetail._id;
    }

    if (!categoryData) return null;

    if (typeof categoryData === 'object' && categoryData._id) {
      return categoryData._id;
    }
    if (typeof categoryData === 'string') {
      return categoryData;
    }
    return null;
  };

  // Set form values when modal opens and productData is available
  useEffect(() => {
    if (visible && productData) {
      const categoryId = extractCategoryId(productData.category_id, productData);

      const currentStatus = productData.status !== undefined ? productData.status : true;

      const formValues = {
        name: productData.name,
        price: productData.price,
        quantity: productData.quantity,
        short_desc: productData.short_desc,
        detail_desc: productData.detail_desc,
        factory: productData.factory,
        target: productData.target,
        status: currentStatus,
        category_id: categoryId,
      };

      console.log('🔍 ProductData status:', productData.status);
      console.log('🔍 Current status value:', currentStatus);
      console.log('🔍 Available categories:', categories.length);
      console.log('🔍 CategoryDetail:', productData.categoryDetail);
      console.log('🔍 Extracted category ID:', categoryId);

      form.setFieldsValue(formValues);
      setStatusValue(currentStatus);

      // Set image file list
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
      // Reset everything when modal closes
      form.resetFields();
      setFileList([]);
      setPreviewImage("");
      setModalVisible(false);
      setStatusValue(true);
    }
  }, [visible, productData, form]);

  // Re-set category_id after categories are loaded (if not already set)
  useEffect(() => {
    if (visible && productData && categories.length > 0 && !categoryLoading) {
      const currentCategoryId = form.getFieldValue('category_id');
      const expectedCategoryId = extractCategoryId(productData.category_id, productData);

      // Only update if current value is empty/null but we have a valid expected value
      if (!currentCategoryId && expectedCategoryId) {
        console.log('🔄 Re-setting category_id after categories loaded:', expectedCategoryId);
        form.setFieldValue('category_id', expectedCategoryId);
      }
    }
  }, [categories, categoryLoading, visible, productData, form]);

  const handleFinish = (values) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add image if exists
      if (fileList[0]?.originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      // Add all form values
      Object.keys(values).forEach(key => {
        if (key !== 'image') {
          // Convert status boolean to string để API hiểu đúng
          if (key === 'status') {
            formData.append(key, values[key].toString());
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      // Add default value for sold
      formData.append('sold', '0');

      // Add token
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để thực hiện chức năng này!');
        return;
      }

      // Log form data for debugging
      console.log('📤 Form values being submitted:', values);
      console.log('📤 Category ID being sent:', values.category_id);
      console.log('📤 Status value being sent:', values.status);
      console.log('📤 FormData entries:');
      for (let pair of formData.entries()) {
        console.log(`  ${pair[0]}: ${pair[1]}`);
      }

      dispatch(updateProductRequest(productData._id, formData, () => {

        onSuccess && onSuccess();
        onClose && onClose();
      }));
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật sản phẩm!');
      console.error('Error updating product:', error);
    }
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
      confirmLoading={updateLoading}
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
              loading={categoryLoading}
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(value) => {
                console.log('🔄 Category selection changed to:', value);
                const selectedCategory = activeCategories.find(cat => cat._id === value);
                if (selectedCategory) {
                  console.log('🔄 Selected category name:', selectedCategory.name);
                }
              }}
              notFoundContent={
                <div style={{ padding: '12px', textAlign: 'center' }}>
                  {categoryLoading ? 'Đang tải danh mục...' : 'Không tìm thấy danh mục nào'}
                </div>
              }
            >
              {/* Hiển thị category hiện tại nếu chưa có trong danh sách categories đã load */}
              {productData?.categoryDetail &&
                !activeCategories.some(cat => cat._id === productData.categoryDetail._id) && (
                  <Select.Option
                    key={productData.categoryDetail._id}
                    value={productData.categoryDetail._id}
                    style={{ backgroundColor: '#f0f9ff', borderLeft: '3px solid #13C2C2' }}
                  >
                    {productData.categoryDetail.name} (Hiện tại - {productData.categoryDetail.status ? 'Hoạt động' : 'Ngừng hoạt động'})
                  </Select.Option>
                )}
              {/* Fallback: Hiển thị category cũ nếu không có categoryDetail */}
              {!productData?.categoryDetail &&
                productData?.category_id &&
                typeof productData.category_id === 'object' &&
                productData.category_id.name &&
                !activeCategories.some(cat => cat._id === productData.category_id._id) && (
                  <Select.Option
                    key={productData.category_id._id}
                    value={productData.category_id._id}
                    style={{ backgroundColor: '#f0f9ff', borderLeft: '3px solid #13C2C2' }}
                  >
                    {productData.category_id.name} (Hiện tại)
                  </Select.Option>
                )}
              {/* Hiển thị tất cả active categories */}
              {activeCategories.map(cat => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name} {cat.status ? '' : '(Ngừng hoạt động)'}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

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
                checked={statusValue}
                checkedChildren="Hiển thị"
                unCheckedChildren="Ẩn"
                onChange={(checked) => {
                  setStatusValue(checked);
                  form.setFieldValue('status', checked);
                }}
              />
              <Text type="secondary" style={{ fontSize: '13px' }}>
                {statusValue ? 'Sản phẩm đang hiển thị trên website' : 'Sản phẩm đang bị ẩn khỏi website'}
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
                loading={updateLoading}
                icon={<SaveOutlined />}
                style={{
                  backgroundColor: updateLoading ? '#94a3b8' : '#0D364C',
                  borderColor: updateLoading ? '#94a3b8' : '#0D364C',
                  borderRadius: '8px',
                  fontWeight: '500',
                  minWidth: '140px'
                }}
                onClick={() => form.submit()}
              >
                {updateLoading ? 'Đang cập nhật...' : 'Cập nhật Sản phẩm'}
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

        /* Switch màu xanh khi bật (hiển thị) */
        .ant-switch-checked {
          background-color: #52c41a !important;
        }
        
        /* Switch màu đỏ khi tắt (ẩn) */
        .ant-switch:not(.ant-switch-checked) {
          background-color: #ff4d4f !important;
        }
        
        /* Hover effects cho switch */
        .ant-switch-checked:hover:not(.ant-switch-disabled) {
          background-color: #73d13d !important;
        }
        
        .ant-switch:not(.ant-switch-checked):hover:not(.ant-switch-disabled) {
          background-color: #ff7875 !important;
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
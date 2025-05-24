import { useState } from "react";
import { Form, Input, Button, Card, Switch, Upload, Modal, InputNumber, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

// Sample categories data
const sampleCategories = [
  { _id: "c1", name: "Điện thoại" },
  { _id: "c2", name: "Laptop" },
  { _id: "c3", name: "Phụ kiện" },
];

const CreateProduct = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleFinish = (values) => {
    setLoading(true);
    // Simulated create
    console.log('Creating product:', values);
    setTimeout(() => {
      setLoading(false);
      // Simulate success
      onSuccess && onSuccess(values); // Pass new product data back
      form.resetFields();
      setFileList([]);
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

  // Helper function for image preview
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
      title="Thêm Sản phẩm mới"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ status: true, quantity: 1, price: 0, sold: 0 }}
        >
          <Form.Item
            label="Category"
            name="category_id"
            rules={[{ required: true, message: "Vui lòng chọn category!" }]}
          >
            <Select placeholder="Chọn category">
              {sampleCategories.map(cat => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Tên Sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item label="Hình ảnh" name="image">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false} // Prevent default upload behavior
              onPreview={handlePreview}
              onChange={handleChange}
              fileList={fileList}
            >
              {fileList.length < 1 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <Modal open={modalVisible} footer={null} onCancel={() => setModalVisible(false)}>
              <img alt="preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá!", type: 'number', min: 0 }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập giá" />
          </Form.Item>

           <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!", type: 'number', min: 0 }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số lượng" />
          </Form.Item>

          <Form.Item
            label="Mô tả ngắn"
            name="short_desc"
            rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn!" }]}
          >
            <Input.TextArea rows={2} placeholder="Nhập mô tả ngắn" />
          </Form.Item>

          <Form.Item
            label="Mô tả chi tiết"
            name="detail_desc"
            rules={[{ required: true, message: "Vui lòng nhập mô tả chi tiết!" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
          </Form.Item>

           <Form.Item
            label="Nhà sản xuất"
            name="factory"
            rules={[{ required: true, message: "Vui lòng nhập nhà sản xuất!" }]}
          >
            <Input placeholder="Nhập nhà sản xuất" />
          </Form.Item>

           <Form.Item
            label="Đối tượng"
            name="target"
            rules={[{ required: true, message: "Vui lòng nhập đối tượng!" }]}
          >
            <Input placeholder="Nhập đối tượng" />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<PlusOutlined />}
              block
            >
              Thêm Sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

CreateProduct.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default CreateProduct; 
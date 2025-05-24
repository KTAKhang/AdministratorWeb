import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Switch, Upload, Modal, InputNumber, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

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
        category_id: productData.category_id, // Set category ID
      });
      // Set initial image if exists
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
    // Simulated update
    console.log('Updating product:', productData._id, values);
    setTimeout(() => {
      setLoading(false);
      // Simulate success
      onSuccess && onSuccess(productData._id, values); // Pass updated data back
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
      title="Cập nhật Sản phẩm"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          {/* category_id, name, image, price, detail_desc, short_desc, quantity, sold, factory, target, status */}

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
              beforeUpload={() => false}
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
            label="Category"
            name="category_id"
            rules={[{ required: true, message: "Vui lòng chọn category!" }]}
          >
            <Select placeholder="Chọn category">
              {categories.map(cat => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
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

          {/* sold is not updated in this form */}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Cập nhật Sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </Card>
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
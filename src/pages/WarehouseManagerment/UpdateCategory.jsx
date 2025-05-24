import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Switch, Upload, Modal } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

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
      // Simulate success
      onSuccess && onSuccess(categoryData._id, values); // Pass updated data back
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
      title="Cập nhật Category"
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
          <Form.Item
            label="Tên Category"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên category!" }]}
          >
            <Input placeholder="Nhập tên category" />
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
              block
            >
              Cập nhật Category
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

UpdateCategory.propTypes = {
  visible: PropTypes.bool.isRequired,
  categoryData: PropTypes.object, // Can be null initially
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default UpdateCategory;

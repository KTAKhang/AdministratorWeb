import { useState } from "react";
import { Form, Input, Button, Card, Switch, Upload, Modal } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const CreateCategory = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleFinish = () => {
    setLoading(true);
    // Giả lập tạo category thành công
    setTimeout(() => {
      setLoading(false);
      form.resetFields();
      onSuccess && onSuccess();
      onClose && onClose();
    }, 1000);
  };

  const handlePreview = async (file) => {
    setPreviewImage(file.thumbUrl || file.url);
    setModalVisible(true);
  };

  return (
    <Modal
      open={visible}
      title="Tạo Category mới"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ status: true }}
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
              beforeUpload={() => false}
              onPreview={handlePreview}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
            <Modal
              open={modalVisible}
              footer={null}
              onCancel={() => setModalVisible(false)}
            >
              <img alt="preview" style={{ width: "100%" }} src={previewImage} />
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
              icon={<PlusOutlined />}
              block
            >
              Tạo Category
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

CreateCategory.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default CreateCategory;

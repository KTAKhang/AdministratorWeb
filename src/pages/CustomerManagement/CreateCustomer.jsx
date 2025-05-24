import { useState } from "react";
import { Modal, Button, Form, Input, Switch } from "antd";
import PropTypes from "prop-types";

const CreateCustomer = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = (values) => {
    setLoading(true);
    // Simulated create
    console.log('Creating customer:', values);
    setTimeout(() => {
      setLoading(false);
      onSuccess && onSuccess(values);
      form.resetFields();
      onClose && onClose();
    }, 1000);
  };

  return (
    <Modal
      open={visible}
      title="Thêm Khách hàng mới"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ status: true }}
      >
        {/* TODO: Add form fields based on user schema (user_name, email, password, avatar, role_id) */}
        <Form.Item
          label="Tên người dùng"
          name="user_name"
          rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
        >
          <Input placeholder="Nhập tên người dùng" />
        </Form.Item>
        
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!", type: 'email' }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        {/* TODO: Add fields for avatar and role_id */}

        <Form.Item
          label="Trạng thái"
          name="status"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Thêm Khách hàng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

CreateCustomer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default CreateCustomer;
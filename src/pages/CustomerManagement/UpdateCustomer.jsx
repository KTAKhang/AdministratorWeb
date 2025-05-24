import { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Switch } from "antd";
import PropTypes from "prop-types";

const UpdateCustomer = ({ visible, customerData, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && customerData) {
      form.setFieldsValue(customerData);
    }
  }, [visible, customerData, form]);

  const handleFinish = (values) => {
    setLoading(true);
    // Simulated update
    console.log('Updating customer:', customerData?._id, values);
    setTimeout(() => {
      setLoading(false);
      onSuccess && onSuccess(customerData?._id, values);
      onClose && onClose();
    }, 1000);
  };

  return (
    <Modal
      open={visible}
      title="Cập nhật thông tin Khách hàng"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
         {/* TODO: Add form fields based on user schema (user_name, email, avatar, role_id, status) */}
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

        {/* TODO: Add fields for avatar, role_id, and status */}

         <Form.Item
          label="Trạng thái"
          name="status"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Cập nhật Khách hàng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateCustomer.propTypes = {
  visible: PropTypes.bool.isRequired,
  customerData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default UpdateCustomer; 
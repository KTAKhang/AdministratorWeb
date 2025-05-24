import { useState, useEffect } from "react";
import { Modal, Button, Form, Select } from "antd";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

// Sample status options (replace with fetching from API)
const sampleStatusOptions = [
  { id: 'os1', name: 'Pending' },
  { id: 'os2', name: 'Processing' },
  { id: 'os3', name: 'Shipped' },
  { id: 'os4', name: 'Delivered' },
  { id: 'os5', name: 'Cancelled' },
];

const UpdateOrderStatus = ({ visible, orderData, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && orderData) {
      form.setFieldsValue({ order_status_id: orderData.order_status_id });
    }
  }, [visible, orderData, form]);

  const handleFinish = (values) => {
    setLoading(true);
    // Simulated update status
    console.log('Updating order status for order:', orderData?._id, ', new status:', values.order_status_id);
    setTimeout(() => {
      setLoading(false);
      toast.success("Cập nhật trạng thái đơn hàng thành công (Simulated)");
      onSuccess && onSuccess(orderData?._id, values.order_status_id);
      onClose && onClose();
    }, 1000);
  };

  return (
    <Modal
      open={visible}
      title={`Cập nhật Trạng thái Đơn hàng: ${orderData?._id}`}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="Trạng thái đơn hàng"
          name="order_status_id"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select placeholder="Chọn trạng thái">
            {sampleStatusOptions.map(status => (
              <Select.Option key={status.id} value={status.id}>
                {status.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateOrderStatus.propTypes = {
  visible: PropTypes.bool.isRequired,
  orderData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default UpdateOrderStatus; 
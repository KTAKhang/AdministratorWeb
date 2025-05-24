import { useState } from "react";
import { Modal, Button } from "antd";
import PropTypes from "prop-types";

const DeleteCustomer = ({ visible, customerData, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    // Simulated delete
    console.log('Deleting customer:', customerData?._id);
    setTimeout(() => {
      setLoading(false);
      onSuccess && onSuccess(customerData?._id);
      onClose && onClose();
    }, 1000);
  };

  return (
    <Modal
      title="Xác nhận xóa Khách hàng"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="delete" type="primary" danger loading={loading} onClick={handleDelete}>
          Xóa
        </Button>,
      ]}
      destroyOnClose
    >
      <p>Bạn có chắc chắn muốn xóa khách hàng &quot;<strong>{customerData?.user_name}</strong>&quot; không?</p>
      <p>Thao tác này không thể hoàn tác.</p>
    </Modal>
  );
};

DeleteCustomer.propTypes = {
  visible: PropTypes.bool.isRequired,
  customerData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default DeleteCustomer; 
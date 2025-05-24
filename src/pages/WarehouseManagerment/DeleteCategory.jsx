import { useState } from "react";
import { Modal, Button } from "antd";
import PropTypes from "prop-types";

const DeleteCategory = ({ visible, categoryData, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    // Simulated deletion
    console.log('Deleting category:', categoryData?._id);
    setTimeout(() => {
      setLoading(false);
      // Simulate success
      onSuccess && onSuccess(categoryData?._id);
      onClose && onClose();
    }, 1000);
  };

  return (
    <Modal
      title="Xác nhận xóa Category"
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
      <p>Bạn có chắc chắn muốn xóa category "<strong>{categoryData?.name}</strong>" không?</p>
      <p>Thao tác này không thể hoàn tác.</p>
    </Modal>
  );
};

DeleteCategory.propTypes = {
  visible: PropTypes.bool.isRequired,
  categoryData: PropTypes.object, // Can be null if modal is not open
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default DeleteCategory;

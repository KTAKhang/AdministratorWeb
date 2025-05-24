import { useState } from "react";
import { Modal, Button } from "antd";
import PropTypes from "prop-types";

const DeleteProduct = ({ visible, productData, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    console.log('Deleting product:', productData?._id);
    setTimeout(() => {
      setLoading(false);
      onSuccess && onSuccess(productData?._id);
      onClose && onClose();
    }, 1000);
  };

  return (
    <Modal
      title="Xác nhận xóa Sản phẩm"
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
      <p>Bạn có chắc chắn muốn xóa sản phẩm "<strong>{productData?.name}</strong>" không?</p>
      <p>Thao tác này không thể hoàn tác.</p>
    </Modal>
  );
};

DeleteProduct.propTypes = {
  visible: PropTypes.bool.isRequired,
  productData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default DeleteProduct;
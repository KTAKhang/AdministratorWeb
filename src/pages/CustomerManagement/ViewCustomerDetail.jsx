import { Modal, Button, Descriptions, Tag, Image } from "antd";
import PropTypes from "prop-types";

const ViewCustomerDetail = ({ visible, customerData, onClose }) => {
  return (
    <Modal
      open={visible}
      title={`Chi tiết Khách hàng: ${customerData?.user_name}`}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={600} // Adjust width as needed
    >
      {customerData ? (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="ID">{customerData._id}</Descriptions.Item>
          <Descriptions.Item label="Tên người dùng">{customerData.user_name}</Descriptions.Item>
          <Descriptions.Item label="Email">{customerData.email}</Descriptions.Item>
          <Descriptions.Item label="Avatar">
            {customerData.avatar ? (
              <Image src={customerData.avatar} width={60} height={60} alt="avatar" />
            ) : (
              "Không có hình ảnh"
            )}
          </Descriptions.Item>
           <Descriptions.Item label="Role ID">{customerData.role_id}</Descriptions.Item> {/* TODO: Display role name */}
          <Descriptions.Item label="Trạng thái">
            {customerData.status ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{new Date(customerData.createdAt).toLocaleString()}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Đang tải chi tiết khách hàng...</p>
      )}
    </Modal>
  );
};

ViewCustomerDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  customerData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ViewCustomerDetail; 
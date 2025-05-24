import { Modal, Button, Descriptions, Tag, Image } from "antd";
import PropTypes from "prop-types";

const ViewCategoryDetail = ({ visible, categoryData, onClose }) => {
  return (
    <Modal
      open={visible}
      title={`Chi tiết Category: ${categoryData?.name}`}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={600} // Adjust width as needed
    >
      {categoryData ? (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="ID">{categoryData._id}</Descriptions.Item>
          <Descriptions.Item label="Tên Category">{categoryData.name}</Descriptions.Item>
          <Descriptions.Item label="Hình ảnh">
            {categoryData.image ? (
              <Image src={categoryData.image} width={60} height={60} alt="category" />
            ) : (
              "Không có hình ảnh"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {categoryData.status ? <Tag color="green">Hiển thị</Tag> : <Tag color="red">Ẩn</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{new Date(categoryData.createdAt).toLocaleString()}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Đang tải chi tiết category...</p>
      )}
    </Modal>
  );
};

ViewCategoryDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  categoryData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ViewCategoryDetail; 
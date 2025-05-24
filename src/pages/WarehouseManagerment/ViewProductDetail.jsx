import { Modal, Button, Descriptions, Tag, Image, Typography } from "antd";
import PropTypes from "prop-types";

const { Text } = Typography;

const ViewProductDetail = ({ visible, productData, onClose }) => {
  return (
    <Modal
      open={visible}
      title={`Chi tiết Sản phẩm: ${productData?.name}`}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={600} // Adjust width as needed
    >
      {productData ? (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="ID">{productData._id}</Descriptions.Item>
          <Descriptions.Item label="Category ID">{productData.category_id}</Descriptions.Item> {/* TODO: Display category name */}
          <Descriptions.Item label="Tên Sản phẩm">{productData.name}</Descriptions.Item>
          <Descriptions.Item label="Hình ảnh">
            {productData.image ? (
              <Image src={productData.image} width={60} height={60} alt="product" />
            ) : (
              "Không có hình ảnh"
            )}
          </Descriptions.Item>
           <Descriptions.Item label="Giá"><Text strong>{productData.price?.toLocaleString('vi-VN')} VNĐ</Text></Descriptions.Item>
           <Descriptions.Item label="Số lượng">{productData.quantity}</Descriptions.Item>
           <Descriptions.Item label="Đã bán">{productData.sold}</Descriptions.Item>
            <Descriptions.Item label="Mô tả ngắn">{productData.short_desc}</Descriptions.Item>
             <Descriptions.Item label="Mô tả chi tiết">{productData.detail_desc}</Descriptions.Item>
              <Descriptions.Item label="Nhà sản xuất">{productData.factory}</Descriptions.Item>
               <Descriptions.Item label="Đối tượng">{productData.target}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {productData.status ? <Tag color="green">Hiển thị</Tag> : <Tag color="red">Ẩn</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{new Date(productData.createdAt).toLocaleString()}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Đang tải chi tiết sản phẩm...</p>
      )}
    </Modal>
  );
};

ViewProductDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  productData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ViewProductDetail; 
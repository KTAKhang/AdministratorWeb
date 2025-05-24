import { Modal, Button, Descriptions, Table, Typography } from "antd";
import PropTypes from "prop-types";

const { Text } = Typography;

const ViewOrderDetail = ({ visible, orderData, onClose }) => {
  const columns = [
    {
      title: "Sản phẩm ID", // TODO: Fetch and display product name
      dataIndex: "product_id",
      key: "product_id",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
       render: (price) => price?.toLocaleString('vi-VN') + ' VNĐ'
    },
    {
        title: "Thành tiền",
        key: "subtotal",
        render: (_, record) => (record.quantity * record.price)?.toLocaleString('vi-VN') + ' VNĐ'
    }
  ];

  return (
    <Modal
      open={visible}
      title={`Chi tiết Đơn hàng: ${orderData?._id}`}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={800} // Adjust width as needed
    >
      {orderData ? (
        <>
          <Descriptions bordered column={1} size="small" className="mb-4">
            <Descriptions.Item label="ID Đơn hàng">{orderData._id}</Descriptions.Item>
            <Descriptions.Item label="ID Người dùng">{orderData.user_id}</Descriptions.Item> {/* TODO: Display username */}
            <Descriptions.Item label="Tổng tiền"><Text strong>{orderData.total_price?.toLocaleString('vi-VN')} VNĐ</Text></Descriptions.Item>
            <Descriptions.Item label="Người nhận">{orderData.receiver_name}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ nhận">{orderData.receiver_address}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{orderData.receiver_phone}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{orderData.order_status_id}</Descriptions.Item> {/* TODO: Display status name */}
            <Descriptions.Item label="Ngày tạo">{new Date(orderData.createdAt).toLocaleString()}</Descriptions.Item>
            {orderData.note && <Descriptions.Item label="Ghi chú">{orderData.note}</Descriptions.Item>}
          </Descriptions>

          <Text strong>Chi tiết sản phẩm:</Text>
          <Table
            columns={columns}
            dataSource={orderData.order_details || []}
            pagination={false}
            rowKey={(record, index) => index} // Use index as key for order details
            size="small"
          />
        </>
      ) : (
        <p>Đang tải chi tiết đơn hàng...</p>
      )}
    </Modal>
  );
};

ViewOrderDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  orderData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ViewOrderDetail; 
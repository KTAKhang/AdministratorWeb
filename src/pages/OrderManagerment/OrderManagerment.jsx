import { useState, useEffect, useCallback } from "react";
import { Card, Table, Button, Tag, Input } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import { toast } from "react-toastify";
// import CreateOrder from "./CreateOrder"; // Assuming order creation is not from this page
// import DeleteOrder from "./DeleteOrder"; // Assuming order deletion is not from this page
import ViewOrderDetail from "./ViewOrderDetail"; // Modal to view order details
import UpdateOrderStatus from "./UpdateOrderStatus"; // Modal to update order status

// Sample data for orders based on the provided schema
const sampleOrders = [
  {
    _id: "o1",
    user_id: "u1", // Sample user ID
    total_price: 10500000,
    note: "Giao hàng giờ hành chính",
    receiver_address: "123 ABC Street, District 1",
    receiver_name: "Nguyễn Văn A",
    receiver_phone: 1234567890,
    order_status_id: "os1", // Sample status ID (e.g., Pending)
    status: true,
    createdAt: "2024-06-10T09:00:00Z",
    // Sample order details (nested)
    order_details: [
      { product_id: "p1", quantity: 1, price: 10000000 },
      { product_id: "p3", quantity: 1, price: 500000 }
    ]
  },
  {
    _id: "o2",
    user_id: "u2", // Sample user ID
    total_price: 15000000,
    note: "",
    receiver_address: "456 XYZ Road, District 5",
    receiver_name: "Trần Thị B",
    receiver_phone: 9876543210,
    order_status_id: "os2", // Sample status ID (e.g., Processing)
    status: true,
    createdAt: "2024-06-09T14:30:00Z",
     order_details: [
      { product_id: "p2", quantity: 1, price: 15000000 }
    ]
  },
   {
    _id: "o3",
    user_id: "u1", // Sample user ID
    total_price: 750000,
    note: "",
    receiver_address: "789 QWE Avenue, District 3",
    receiver_name: "Nguyễn Văn A",
    receiver_phone: 1234567890,
    order_status_id: "os3", // Sample status ID (e.g., Shipped)
    status: true,
    createdAt: "2024-06-08T10:00:00Z",
     order_details: [
      { product_id: "p3", quantity: 1, price: 500000 },
      { product_id: "p3", quantity: 0.5, price: 250000 }, // Example of fractional quantity if applicable
    ]
  }
];

const OrderManagement = () => {
  const [orders, setOrders] = useState(sampleOrders);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: sampleOrders.length,
  });
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] = useState(false);

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setPagination((prev) => ({ ...prev, current: 1 }));
      // TODO: When using real API, call fetchOrders here
    }, 500),
    []
  );

  useEffect(() => {
    // Filter sample data by searchText (search by receiver name or phone, maybe user ID)
    const filtered = sampleOrders.filter(order =>
      order.receiver_name.toLowerCase().includes(searchText.toLowerCase()) ||
      order.receiver_phone.toString().includes(searchText) ||
      order.user_id.toLowerCase().includes(searchText.toLowerCase())
    );
    setOrders(filtered);
    setPagination(prev => ({ ...prev, total: filtered.length }));

  }, [searchText]); // Dependency includes searchText only for local filtering

  // TODO: Implement fetchOrders when using real API
  // const fetchOrders = async (page, pageSize, keyword) => { ... };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsViewDetailModalVisible(true);
  };

  const handleCloseViewDetailModal = () => {
    setIsViewDetailModalVisible(false);
    setSelectedOrder(null);
  };

   const handleUpdateStatusClick = (order) => {
    setSelectedOrder(order);
    setIsUpdateStatusModalVisible(true);
  };

  const handleUpdateStatusSuccess = (id, newStatusId) => {
    toast.success(`Order ${id} status updated successfully (Simulated)`);
    setIsUpdateStatusModalVisible(false);
    setSelectedOrder(null);
     // Update sample data (temporary)
    const updatedOrders = orders.map(order =>
      order._id === id ? { ...order, order_status_id: newStatusId } : order
    );
    setOrders(updatedOrders);
  };

  const handleCloseUpdateStatusModal = () => {
    setIsUpdateStatusModalVisible(false);
    setSelectedOrder(null);
  };


  const columns = [
    {
      title: "ID Đơn hàng",
      dataIndex: "_id",
      key: "_id",
    },
     {
      title: "ID Người dùng", // TODO: Fetch and display actual username
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) => price?.toLocaleString('vi-VN') + ' VNĐ'
    },
    {
      title: "Người nhận",
      dataIndex: "receiver_name",
      key: "receiver_name",
    },
     {
      title: "Số điện thoại",
      dataIndex: "receiver_phone",
      key: "receiver_phone",
    },
     {
      title: "Trạng thái", // TODO: Fetch and display actual status name
      dataIndex: "order_status_id",
      key: "order_status_id",
      render: (statusId) => {
        // Basic mapping for sample data. Replace with fetching status names from API.
        let color = 'default';
        let text = statusId;
        if (statusId === 'os1') { color = 'orange'; text = 'Pending'; }
        else if (statusId === 'os2') { color = 'blue'; text = 'Processing'; }
        else if (statusId === 'os3') { color = 'green'; text = 'Shipped'; }
         else if (statusId === 'os4') { color = 'purple'; text = 'Delivered'; }
          else if (statusId === 'os5') { color = 'red'; text = 'Cancelled'; }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleUpdateStatusClick(record)} /> {/* Use Edit for status update */}
          {/* <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteClick(record)} /> */}
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto" >
      <Card
        className="shadow-md"
        title="Danh sách Đơn hàng"
        // No "Add" button as orders are created via checkout flow
      >
        <div className="mb-4 flex justify-start items-center">
           {/* Search bar moved to left as per previous user request */}
          <Input.Search
            placeholder="Tìm kiếm đơn hàng..."
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
           {/* No create button here */}
        </div>
        <Table
          rowKey="_id"
          // loading={loading}
          columns={columns}
          dataSource={orders}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10,
              }));
              // TODO: When using real API, call fetchOrders(page, pageSize, searchText) here
            },
          }}
        />
      </Card>

      <ViewOrderDetail
        visible={isViewDetailModalVisible}
        orderData={selectedOrder}
        onClose={handleCloseViewDetailModal}
      />

       {selectedOrder && (
        <UpdateOrderStatus
          visible={isUpdateStatusModalVisible}
          orderData={selectedOrder}
          onClose={handleCloseUpdateStatusModal}
          onSuccess={handleUpdateStatusSuccess}
        />
      )}

      {/* Delete modal omitted */}
    </div>
  );
};

export default OrderManagement;

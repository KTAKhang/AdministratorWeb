import { useState, useEffect, useCallback } from "react";
import { Card, Table, Button, Tag, Image, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import CreateCustomer from "./CreateCustomer";
import UpdateCustomer from "./UpdateCustomer";
import DeleteCustomer from "./DeleteCustomer";
import ViewCustomerDetail from "./ViewCustomerDetail";

// Sample data for customers based on the provided schema (excluding sensitive fields)
const sampleCustomers = [
  {
    _id: "u1",
    user_name: "john_doe",
    email: "john.doe@example.com",
    avatar: "https://via.placeholder.com/60x60?text=User1",
    role_id: "r1", // Sample role ID
    status: true,
    createdAt: "2024-06-01T10:00:00Z"
  },
  {
    _id: "u2",
    user_name: "jane_smith",
    email: "jane.smith@example.com",
    avatar: "https://via.placeholder.com/60x60?text=User2",
    role_id: "r2", // Sample role ID
    status: true,
    createdAt: "2024-06-02T11:00:00Z"
  },
  {
    _id: "u3",
    user_name: "peter_jones",
    email: "peter.jones@example.com",
    avatar: "https://via.placeholder.com/60x60?text=User3",
    role_id: "r1", // Sample role ID
    status: false,
    createdAt: "2024-06-03T12:00:00Z"
  }
];

const CustomerManagement = () => {
  const [customers, setCustomers] = useState(sampleCustomers);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: sampleCustomers.length,
  });
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setPagination((prev) => ({ ...prev, current: 1 }));
      // TODO: When using real API, call fetchCustomers here
    }, 500),
    []
  );

  useEffect(() => {
    // Filter sample data by searchText
    const filtered = sampleCustomers.filter(customer =>
      customer.user_name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setCustomers(filtered);
    setPagination(prev => ({ ...prev, total: filtered.length }));

  }, [searchText]); // Dependency includes searchText only for local filtering

  // TODO: Implement fetchCustomers when using real API
  // const fetchCustomers = async (page, pageSize, keyword) => { ... };

  const handleCreateSuccess = (newCustomerData) => {
    toast.success("Customer created successfully (Simulated)");
    setIsCreateModalVisible(false);
    // Update sample data (temporary)
    const newCustomer = { 
      _id: `u${sampleCustomers.length + 1}`, 
      ...newCustomerData,
      createdAt: new Date().toISOString(),
    };
     sampleCustomers.push(newCustomer);
    setCustomers([...sampleCustomers]);
    setPagination(prev => ({...prev, total: sampleCustomers.length}));
  };

  const handleOpenUpdateModal = (customer) => {
    setSelectedCustomer(customer);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateSuccess = (id, updatedValues) => {
    toast.success(`Customer ${id} updated successfully (Simulated)`);
    setIsUpdateModalVisible(false);
    setSelectedCustomer(null);
    // Update sample data (temporary)
    const updatedCustomers = customers.map(customer => 
      customer._id === id ? { ...customer, ...updatedValues } : customer
    );
    setCustomers(updatedCustomers);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setSelectedCustomer(null);
  };

  const handleOpenDeleteModal = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteSuccess = (id) => {
    toast.success(`Customer ${id} deleted successfully (Simulated)`);
    setIsDeleteModalVisible(false);
    setCustomerToDelete(null);
    // Update sample data (temporary)
    const remainingCustomers = customers.filter(customer => customer._id !== id);
    setCustomers(remainingCustomers);
    setPagination(prev => ({...prev, total: remainingCustomers.length}));
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setCustomerToDelete(null);
  };

  const handleOpenViewDetailModal = (customer) => {
    setSelectedCustomer(customer);
    setIsViewDetailModalVisible(true);
  };

  const handleCloseViewDetailModal = () => {
    setIsViewDetailModalVisible(false);
    setSelectedCustomer(null);
  };

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (url) => <Image src={url} width={48} height={48} alt="avatar" />,
    },
    {
      title: "Role ID",
      dataIndex: "role_id",
      key: "role_id",
      // TODO: Render actual role name when fetching real data
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => status ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button icon={<EyeOutlined />} onClick={() => handleOpenViewDetailModal(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleOpenUpdateModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleOpenDeleteModal(record)} />
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto" style={{ paddingLeft: '250px' }}>
      <Card
        className="shadow-md"
        title="Danh sách Khách hàng"
      >
        <div className="mb-4 flex justify-between items-center">
          <Input.Search
            placeholder="Tìm kiếm khách hàng..."
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}> 
            Thêm Khách hàng
          </Button>
        </div>
        <Table
          rowKey="_id"
          // loading={loading}
          columns={columns}
          dataSource={customers}
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
              // TODO: When using real API, call fetchCustomers(page, pageSize, searchText) here
            },
          }}
        />
      </Card>

      <CreateCustomer
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />

      {selectedCustomer && (
        <UpdateCustomer
          visible={isUpdateModalVisible}
          customerData={selectedCustomer}
          onClose={handleCloseUpdateModal}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {customerToDelete && (
        <DeleteCustomer
          visible={isDeleteModalVisible}
          customerData={customerToDelete}
          onClose={handleCloseDeleteModal}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {selectedCustomer && (
        <ViewCustomerDetail
          visible={isViewDetailModalVisible}
          customerData={selectedCustomer}
          onClose={handleCloseViewDetailModal}
        />
      )}
    </div>
  );
};

export default CustomerManagement;

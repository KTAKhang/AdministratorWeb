import { useState, useEffect, useCallback } from "react";
import { Card, Table, Button, Tag, Image, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
// import { categoryService } from "../../services/category.service"; // Giả lập, bạn sửa lại cho đúng
import { debounce } from "lodash";
import { toast } from "react-toastify";
import CreateCategory from "./CreateCategory"; // Import component CreateCategory
import UpdateCategory from "./UpdateCategory"; // Import component UpdateCategory
import DeleteCategory from "./DeleteCategory"; // Import component DeleteCategory
import ViewCategoryDetail from "./ViewCategoryDetail"; // Import component ViewCategoryDetail

const sampleCategories = [
  {
    _id: "1",
    name: "Điện thoại",
    image: "https://via.placeholder.com/60x60?text=Phone",
    status: true,
    createdAt: "2024-06-01T10:00:00Z"
  },
  {
    _id: "2",
    name: "Laptop",
    image: "https://via.placeholder.com/60x60?text=Laptop",
    status: false,
    createdAt: "2024-06-02T11:00:00Z"
  },
  {
    _id: "3",
    name: "Phụ kiện",
    image: "https://via.placeholder.com/60x60?text=Accessory",
    status: true,
    createdAt: "2024-06-03T12:00:00Z"
  }
];

const CategoryManagement = () => {
  // const [loading, setLoading] = useState(false); // Removed as it's not used with sample data
  // const [categories, setCategories] = useState([]); // Sử dụng dữ liệu mẫu tạm thời
  const [categories, setCategories] = useState(sampleCategories);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: sampleCategories.length, // Total dựa trên dữ liệu mẫu
  });
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // State để quản lý modal tạo category
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // State để quản lý modal cập nhật category
  const [selectedCategory, setSelectedCategory] = useState(null); // State để lưu category được chọn để cập nhật
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State để quản lý modal xóa category
  const [categoryToDelete, setCategoryToDelete] = useState(null); // State để lưu category cần xóa
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false); // State để quản lý modal xem chi tiết category

  // Debounce search
  const handleSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setPagination((prev) => ({ ...prev, current: 1 }));
      // Khi dùng API thật, gọi fetchCategories ở đây
    }, 500),
    []
  );

  useEffect(() => {
    // Giữ lại logic này nếu dùng API thật
    // fetchCategories(pagination.current, pagination.pageSize, searchText);

    // Filter dữ liệu mẫu theo searchText
    const filtered = sampleCategories.filter(cat =>
      cat.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setCategories(filtered);
    setPagination(prev => ({ ...prev, total: filtered.length }));

  }, [pagination.current, pagination.pageSize, searchText]); // Thêm searchText vào dependency array

  // Hàm này chỉ dùng khi kết nối API thật
  // const fetchCategories = async (page, pageSize, keyword) => {
  //   setLoading(true);
  //   try {
  //     const res = await categoryService.searchCategories?.({
  //       searchCondition: { keyword: keyword || "" },
  //       pageInfo: { pageNum: page, pageSize },
  //     });
  //     if (res?.data?.pageData) {
  //       setCategories(res.data.pageData);
  //       setPagination((prev) => ({
  //         ...prev,
  //         total: res.data.pageInfo?.totalItems || 0,
  //       }));
  //     }
  //   } catch (err) {
  //     toast.error("Không thể tải danh sách category");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCreateSuccess = () => {
    // Logic sau khi tạo category thành công (ví dụ: reload data)
    // Khi dùng API thật, gọi fetchCategories(pagination.current, pagination.pageSize, searchText);
    toast.success("Thêm Category thành công (Giả lập)");
    setIsCreateModalVisible(false);
    // Cập nhật dữ liệu mẫu (tạm thời)
    // Đây là cách đơn giản, bạn có thể thêm logic phức tạp hơn nếu cần
    const newCategory = { 
      _id: (sampleCategories.length + 1).toString(), 
      name: `New Category ${sampleCategories.length + 1}`, 
      image: "https://via.placeholder.com/60x60?text=New", 
      status: true, 
      createdAt: new Date().toISOString() 
    };
    sampleCategories.push(newCategory); // Cập nhật trực tiếp mảng mẫu (không khuyến khích trong app thật)
    setCategories([...sampleCategories]); // Cập nhật state để re-render
    setPagination(prev => ({...prev, total: sampleCategories.length}));
  };

  // Handle opening update modal
  const handleOpenUpdateModal = (category) => {
    setSelectedCategory(category);
    setIsUpdateModalVisible(true);
  };

  // Handle update success (simulated)
  const handleUpdateSuccess = (id, updatedValues) => {
    toast.success(`Cập nhật Category ${id} thành công (Giả lập)`);
    setIsUpdateModalVisible(false);
    setSelectedCategory(null);
    // Cập nhật dữ liệu mẫu (tạm thời)
    const updatedCategories = categories.map(cat => 
      cat._id === id ? { ...cat, ...updatedValues } : cat
    );
    setCategories(updatedCategories);
    // Khi dùng API thật, gọi fetchCategories(pagination.current, pagination.pageSize, searchText);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setSelectedCategory(null);
  };

  // Handle opening delete modal
  const handleOpenDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalVisible(true);
  };

  // Handle delete success (simulated)
  const handleDeleteSuccess = (id) => {
    toast.success(`Xóa Category ${id} thành công (Giả lập)`);
    setIsDeleteModalVisible(false);
    setCategoryToDelete(null);
    // Cập nhật dữ liệu mẫu (tạm thời)
    const remainingCategories = categories.filter(cat => cat._id !== id);
    setCategories(remainingCategories);
    setPagination(prev => ({...prev, total: remainingCategories.length}));
    // Khi dùng API thật, gọi fetchCategories(pagination.current, pagination.pageSize, searchText);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setCategoryToDelete(null);
  };

  // Handle opening view detail modal
  const handleOpenViewDetailModal = (category) => {
    setSelectedCategory(category);
    setIsViewDetailModalVisible(true);
  };

  const handleCloseViewDetailModal = () => {
    setIsViewDetailModalVisible(false);
    setSelectedCategory(null);
  };

  const columns = [
    {
      title: "Tên Category",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (url) => <Image src={url} width={48} height={48} alt="category" />,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => status ? <Tag color="green">Hiển thị</Tag> : <Tag color="red">Ẩn</Tag>
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
          <Button icon={<EyeOutlined />} onClick={() => handleOpenViewDetailModal(record)} />{/* View Detail Button */}
          <Button icon={<EditOutlined />} onClick={() => handleOpenUpdateModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleOpenDeleteModal(record)} /> {/* Chỉnh sửa nút */} 
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto" style={{ paddingLeft: '250px' }}>
      <Card
        className="shadow-md"
        title="Danh sách Category"
      >
        <div className="mb-4 flex justify-between items-center">
          <Input.Search
            placeholder="Tìm kiếm category..."
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}> 
            Thêm Category
          </Button>
        </div>
        <Table
          rowKey="_id"
          // loading={loading} // Comment out loading as it's not used with sample data
          columns={columns}
          dataSource={categories}
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
              // Khi dùng API thật, gọi fetchCategories(page, pageSize, searchText) ở đây
            },
          }}
        />
      </Card>

      {/* Render component CreateCategory */}
      <CreateCategory
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Render component UpdateCategory */}
      {selectedCategory && (
        <UpdateCategory
          visible={isUpdateModalVisible}
          categoryData={selectedCategory}
          onClose={handleCloseUpdateModal}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {/* Render component DeleteCategory */}
      {categoryToDelete && (
         <DeleteCategory
           visible={isDeleteModalVisible}
           categoryData={categoryToDelete}
           onClose={handleCloseDeleteModal}
           onSuccess={handleDeleteSuccess}
         />
       )}

       {/* Render component ViewCategoryDetail */}
       {selectedCategory && (
         <ViewCategoryDetail
           visible={isViewDetailModalVisible}
           categoryData={selectedCategory}
           onClose={handleCloseViewDetailModal}
         />
       )}

    </div>
  );
};

export default CategoryManagement;

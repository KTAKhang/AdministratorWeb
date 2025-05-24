import { useState, useEffect, useCallback } from "react";
import { Card, Table, Button, Tag, Image, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import CreateProduct from "./CreateProduct";
import UpdateProduct from "./UpdateProduct";
import DeleteProduct from "./DeleteProduct";
import ViewProductDetail from "./ViewProductDetail";

// TODO: Import CreateProduct, UpdateProduct, DeleteProduct components here
// import CreateProduct from "./CreateProduct";
// import UpdateProduct from "./UpdateProduct";
// import DeleteProduct from "./DeleteProduct";

// Sample data for products based on the provided schema
const sampleProducts = [
  {
    _id: "p1",
    category_id: "c1", // Sample category ID
    name: "Smartphone X",
    image: "https://via.placeholder.com/60x60?text=Product1",
    price: 10000000,
    detail_desc: "Detailed description for Smartphone X.",
    short_desc: "Short description for Smartphone X.",
    quantity: 50,
    sold: 10,
    factory: "Factory A",
    target: "Consumer",
    status: true,
    createdAt: "2024-06-01T10:00:00Z"
  },
  {
    _id: "p2",
    category_id: "c2", // Sample category ID
    name: "Laptop Y",
    image: "https://via.placeholder.com/60x60?text=Product2",
    price: 15000000,
    detail_desc: "Detailed description for Laptop Y.",
    short_desc: "Short description for Laptop Y.",
    quantity: 30,
    sold: 5,
    factory: "Factory B",
    target: "Business",
    status: true,
    createdAt: "2024-06-02T11:00:00Z"
  },
  {
    _id: "p3",
    category_id: "c1", // Sample category ID
    name: "Tai nghe Z",
    image: "https://via.placeholder.com/60x60?text=Product3",
    price: 500000,
    detail_desc: "Detailed description for Tai nghe Z.",
    short_desc: "Short description for Tai nghe Z.",
    quantity: 120,
    sold: 50,
    factory: "Factory A",
    target: "Consumer",
    status: false,
    createdAt: "2024-06-03T12:00:00Z"
  }
];

const ProductManagement = () => {
  // const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(sampleProducts);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: sampleProducts.length,
  });
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);

  // Debounce search
  const handleSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setPagination((prev) => ({ ...prev, current: 1 }));
      // When using real API, call fetchProducts here
    }, 500),
    []
  );

  useEffect(() => {
    // Filter sample data by searchText
    const filtered = sampleProducts.filter(product =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setProducts(filtered);
    setPagination(prev => ({ ...prev, total: filtered.length }));

  }, [searchText]); // Dependency includes searchText only for local filtering

  // TODO: Implement fetchProducts when using real API
  // const fetchProducts = async (page, pageSize, keyword) => { ... };

  const handleCreateSuccess = (newProductData) => {
    toast.success("Thêm Sản phẩm thành công (Giả lập)");
    setIsCreateModalVisible(false);
    // Update sample data (temporary)
    const newProduct = { 
      _id: `p${sampleProducts.length + 1}`, 
      ...newProductData, // Use data from form
      createdAt: new Date().toISOString(),
      sold: 0 // Default sold to 0
    };
     // Simple way to add to sample data, not recommended for real app
     sampleProducts.push(newProduct);
    setProducts([...sampleProducts]);
    setPagination(prev => ({...prev, total: sampleProducts.length}));
  };

  // Handle opening update modal
  const handleOpenUpdateModal = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalVisible(true);
  };

  // Handle update success (simulated)
  const handleUpdateSuccess = (id, updatedValues) => {
    toast.success(`Cập nhật Sản phẩm ${id} thành công (Giả lập)`);
    setIsUpdateModalVisible(false);
    setSelectedProduct(null);
    // Update sample data (temporary)
    const updatedProducts = products.map(product => 
      product._id === id ? { ...product, ...updatedValues } : product
    );
    setProducts(updatedProducts);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setSelectedProduct(null);
  };

  // Handle opening delete modal
  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalVisible(true);
  };

  // Handle delete success (simulated)
  const handleDeleteSuccess = (id) => {
    toast.success(`Xóa Sản phẩm ${id} thành công (Giả lập)`);
    setIsDeleteModalVisible(false);
    setProductToDelete(null);
    // Update sample data (temporary)
    const remainingProducts = products.filter(product => product._id !== id);
    setProducts(remainingProducts);
    setPagination(prev => ({...prev, total: remainingProducts.length}));
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setProductToDelete(null);
  };

  // Handle opening view detail modal
  const handleOpenViewDetailModal = (product) => {
    setSelectedProduct(product);
    setIsViewDetailModalVisible(true);
  };

  const handleCloseViewDetailModal = () => {
    setIsViewDetailModalVisible(false);
    setSelectedProduct(null);
  };

  const columns = [
    {
      title: "Tên Sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (url) => <Image src={url} width={48} height={48} alt="product" />,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => price?.toLocaleString('vi-VN') + ' VNĐ' // Format price
    },
     {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    // TODO: Add column for category name when fetching real data
    // {
    //   title: "Category",
    //   dataIndex: "category_name", // Need to populate this from category_id
    //   key: "category_name",
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => status ? <Tag color="green">Hiển thị</Tag> : <Tag color="red">Ẩn</Tag>
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

  // TODO: Render CreateProduct, UpdateProduct, DeleteProduct components here
  return (
    <div className="overflow-x-auto" style={{ paddingLeft: '250px' }}>
      <Card
        className="shadow-md"
        title="Danh sách Sản phẩm"
      >
        <div className="mb-4 flex justify-between items-center">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}> 
            Thêm Sản phẩm
          </Button>
        </div>
        <Table
          rowKey="_id"
          // loading={loading}
          columns={columns}
          dataSource={products}
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
              // TODO: When using real API, call fetchProducts(page, pageSize, searchText) here
            },
          }}
        />
      </Card>

      <CreateProduct
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={handleCreateSuccess}
      />

      {selectedProduct && (
        <UpdateProduct
          visible={isUpdateModalVisible}
          productData={selectedProduct}
          onClose={handleCloseUpdateModal}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {productToDelete && (
        <DeleteProduct
          visible={isDeleteModalVisible}
          productData={productToDelete}
          onClose={handleCloseDeleteModal}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {selectedProduct && (
        <ViewProductDetail
          visible={isViewDetailModalVisible}
          productData={selectedProduct}
          onClose={handleCloseViewDetailModal}
        />
      )}
    </div>
  );
};

export default ProductManagement;

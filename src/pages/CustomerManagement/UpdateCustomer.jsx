import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Button,
  Card,
  Switch,
  Upload,
  Modal,
  Space,
  Typography,
  Divider,
  Avatar,
  Spin
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
  MailOutlined,
  UploadOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import {
  updateUserRequest,
  getUserByIdRequest,
  clearUserDetail
} from "../../redux/actions/userActions";

const { Title, Text } = Typography;

const UpdateCustomer = ({ visible, customerData, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  // Redux state
  const {
    updateLoading,
    updateError,
    userDetail,
    detailLoading,
    detailError
  } = useSelector(state => state.user);

  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [avatarError, setAvatarError] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [statusValue, setStatusValue] = useState(true);

  // Fetch user detail khi modal mở
  useEffect(() => {
    if (visible && customerData?._id) {
      dispatch(getUserByIdRequest(customerData._id));
    } else if (!visible) {
      dispatch(clearUserDetail());
    }
  }, [visible, customerData, dispatch]);

  // Set form values khi có userDetail
  useEffect(() => {
    if (visible && userDetail) {

      const currentStatus = userDetail.status !== undefined ? userDetail.status : true;

      const formValues = {
        user_name: userDetail.user_name || '',
        email: userDetail.email || '',
        status: currentStatus,
      };

      form.setFieldsValue(formValues);
      setStatusValue(currentStatus);

      if (userDetail.avatar) {
        setFileList([
          {
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: userDetail.avatar,
          },
        ]);
        setAvatarError(false);
      } else {
        setFileList([]);
        setAvatarError(false);
      }
    } else if (!visible) {
      form.resetFields();
      setFileList([]);
      setPreviewImage("");
      setModalVisible(false);
      setAvatarError(false);
      setHasSubmitted(false);
      setStatusValue(true);
    }
  }, [visible, userDetail, form]);

  const handleFinish = (values) => {
    const updateData = { ...values };

    // Xử lý status như UpdateCategory - đảm bảo boolean value
    updateData.status = Boolean(values.status);
    // Không xử lý avatar file (không gửi avatar mới lên)
    delete updateData.avatar;

    // Set submitted flag
    setHasSubmitted(true);

    // Dispatch update action
    dispatch(updateUserRequest(customerData._id, updateData));
  };

  // Handle update success với debounce để tránh multiple calls
  useEffect(() => {
    // Chỉ trigger success callback khi thực sự cần thiết
    if (hasSubmitted && !updateLoading && !updateError && visible) {
      // Reset form và đóng modal
      const timer = setTimeout(() => {
        setHasSubmitted(false);
        if (onSuccess) {
          onSuccess(customerData._id, {});
        }
      }, 50); // Giảm delay xuống 50ms

      return () => clearTimeout(timer);
    }

    // Reset hasSubmitted nếu có lỗi
    if (hasSubmitted && updateError) {
      setHasSubmitted(false);
    }
  }, [hasSubmitted, updateLoading, updateError, visible, customerData, onSuccess]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setModalVisible(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length === 0) {
      form.setFieldValue('avatar', null);
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <Modal
      open={visible}
      title={
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#0D364C'
        }}>
          <EditOutlined style={{ color: '#13C2C2' }} />
          <Title level={4} style={{ margin: 0, color: '#0D364C' }}>
            Cập nhật Thông tin Khách hàng
          </Title>
        </div>
      }
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={700}
      centered
      style={{
        borderRadius: '12px',
      }}
      styles={{
        header: {
          backgroundColor: '#f8fafc',
          borderBottom: '2px solid #13C2C2',
          borderRadius: '12px 12px 0 0',
          padding: '20px 24px'
        },
        body: {
          padding: '24px'
        }
      }}
    >
      <Card
        bordered={false}
        style={{
          boxShadow: 'none',
          background: 'transparent'
        }}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="Đang tải thông tin chi tiết..." />
          </div>
        ) : detailError ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#ff4d4f' }}>
            <Text type="danger">Lỗi tải thông tin: {detailError}</Text>
          </div>
        ) : userDetail ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            size="large"
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Header with Avatar */}
              <div style={{ textAlign: 'center' }}>
                <Avatar
                  size={120}
                  src={userDetail?.avatar && !avatarError ? userDetail.avatar : null}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: '#13C2C2',
                    border: '3px solid #13C2C2',
                    marginBottom: '16px'
                  }}
                  onError={() => {
                    setAvatarError(true);
                    return false;
                  }}
                />
                <Title level={4} style={{
                  color: '#0D364C',
                  margin: '0 0 8px 0'
                }}>
                  {userDetail?.user_name}
                </Title>
                <Text type="secondary">
                  Cập nhật thông tin khách hàng
                </Text>
              </div>

              <Divider style={{ borderColor: '#13C2C2', opacity: 0.3 }} />

              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <UserOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Tên người dùng
                  </Text>
                }
                name="user_name"
                rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
              >
                <Input
                  disabled={true}
                  placeholder="Nhập tên người dùng"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <MailOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Email
                  </Text>
                }
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: 'email', message: "Email không hợp lệ!" }
                ]}
              >
                <Input
                  disabled={true}
                  placeholder="Nhập email"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    <UploadOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                    Avatar
                  </Text>
                }
                name="avatar"
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  fileList={fileList}
                  className="avatar-upload"
                  disabled={true}
                  showUploadList={{ showRemoveIcon: false }}
                >
                </Upload>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                </Text>
              </Form.Item>

              <Form.Item
                label={
                  <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                    Trạng thái tài khoản
                  </Text>
                }
                name="status"
                valuePropName="checked"
                getValueFromEvent={(checked) => {
                  return checked;
                }}
                normalize={(value) => {
                  return Boolean(value);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Switch
                    checked={statusValue}
                    checkedChildren="Hoạt động"
                    unCheckedChildren="Khóa"
                    onChange={(checked) => {
                      setStatusValue(checked);
                      form.setFieldValue('status', checked);
                    }}
                  />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    {statusValue ? 'Tài khoản đang hoạt động' : 'Tài khoản đã bị khóa'}
                  </Text>
                </div>
              </Form.Item>

              <Divider style={{ margin: '24px 0' }} />

              <Form.Item style={{ marginBottom: 0 }}>
                <Space size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button
                    size="large"
                    onClick={onClose}
                    icon={<CloseOutlined />}
                    style={{
                      borderRadius: '8px',
                      borderColor: '#d1d5db',
                      color: '#6b7280'
                    }}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={updateLoading}
                    icon={<SaveOutlined />}
                    style={{
                      backgroundColor: updateLoading ? '#94a3b8' : '#0D364C',
                      borderColor: updateLoading ? '#94a3b8' : '#0D364C',
                      borderRadius: '8px',
                      fontWeight: '500',
                      minWidth: '140px'
                    }}
                  >
                    {updateLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                  </Button>
                </Space>
              </Form.Item>
            </Space>
          </Form>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text type="secondary">Không có thông tin người dùng</Text>
          </div>
        )}
      </Card>

      {/* Image Preview Modal */}
      <Modal
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        centered
        width={500}
        style={{
          borderRadius: '12px'
        }}
        styles={{
          header: {
            borderBottom: '1px solid #e5e7eb',
            borderRadius: '12px 12px 0 0'
          }
        }}
      >
        <img
          alt="preview"
          style={{
            width: '100%',
            borderRadius: '8px',
            maxHeight: '400px',
            objectFit: 'contain'
          }}
          src={previewImage}
        />
      </Modal>

      <style>
        {`
          .avatar-upload .ant-upload-select {
            border: 2px dashed #13C2C2 !important;
            border-radius: 8px !important;
            background-color: #f0fdfd !important;
            transition: all 0.3s ease;
          }
          
          .avatar-upload .ant-upload-select:hover {
            border-color: #0D364C !important;
            background-color: #ecfeff !important;
          }
          
          .avatar-upload .ant-upload-list-picture-card-container {
            border-radius: 8px !important;
          }
          
          .ant-form-item-label > label {
            font-weight: 600 !important;
          }
          
          .ant-input:focus,
          .ant-input-focused {
            border-color: #13C2C2 !important;
            box-shadow: 0 0 0 2px rgba(19, 194, 194, 0.2) !important;
          }

          .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
            border-color: #13C2C2 !important;
          }

          .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
            border-color: #13C2C2 !important;
            box-shadow: 0 0 0 2px rgba(19, 194, 194, 0.1) !important;
          }

          /* Switch màu xanh khi bật (hoạt động) */
          .ant-switch-checked {
            background-color: #52c41a !important;
          }
          
          /* Switch màu đỏ khi tắt (khóa) */
          .ant-switch:not(.ant-switch-checked) {
            background-color: #ff4d4f !important;
          }
          
          /* Hover effects cho switch */
          .ant-switch-checked:hover:not(.ant-switch-disabled) {
            background-color: #73d13d !important;
          }
          
          .ant-switch:not(.ant-switch-checked):hover:not(.ant-switch-disabled) {
            background-color: #ff7875 !important;
          }
        `}
      </style>
    </Modal>
  );
};

UpdateCustomer.propTypes = {
  visible: PropTypes.bool.isRequired,
  customerData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default UpdateCustomer; 
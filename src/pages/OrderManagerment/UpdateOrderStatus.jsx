import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form, Select, Typography, Card, Space, Divider } from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  ShoppingCartOutlined,
  TagOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { updateOrderRequest } from "../../redux/actions/orderActions";

const { Title, Text } = Typography;

const sampleStatusOptions = [
  { id: '682c6d66f938f5743e9f9361', name: 'Chờ xử lý', color: '#faad14', key: 'PENDING' },
  { id: '682c6e4b03ffc771169ec2ce', name: 'Đang xử lý', color: '#13C2C2', key: 'PROCESSING' },
  { id: '682c6e9b03ffc771169ec2cf', name: 'Đang giao', color: '#1890ff', key: 'SHIPPED' },
  { id: '682c6ec003ffc771169ec2d0', name: 'Đã giao', color: '#52c41a', key: 'DELIVERED' },
  { id: '682c6edc03ffc771169ec2d1', name: 'Đã hủy', color: '#ff4d4f', key: 'CANCELLED' },
  { id: '682c6f0603ffc771169ec2d2', name: 'Trả hàng', color: '#ff4d4f', key: 'RETURNED' },
];

// Định nghĩa luồng trạng thái hợp lệ
const STATUS_FLOW_RULES = {
  'PENDING': ['PROCESSING', 'CANCELLED'], // Chờ xử lý -> Đang xử lý hoặc Đã hủy
  'PROCESSING': ['SHIPPED'], // Đang xử lý -> Đang giao
  'SHIPPED': ['DELIVERED'], // Đang giao -> Đã giao
  'DELIVERED': ['RETURNED'], // Đã giao -> Trả hàng
  'CANCELLED': [], // Đã hủy -> Không thể chuyển đi đâu
  'RETURNED': [], // Trả hàng -> Không thể chuyển đi đâu
};

const UpdateOrderStatus = ({ visible, orderData, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);
  const previousStateRef = useRef({ updateLoading: false, updateError: null });

  // Get loading and error states from Redux
  const { updateLoading, updateError, orders } = useSelector(state => state.order);

  // Debug: Log state changes
  useEffect(() => {
  }, [updateLoading, updateError, isSubmitting, visible, orderData?.order_id]);

  // Reset form when modal opens
  useEffect(() => {
    if (visible && orderData) {
      // Reset form to empty state instead of setting current status
      form.resetFields();
      setIsSubmitting(false);
      setHasShownToast(false);
    }
  }, [visible, orderData, form]);

  // Check if order was actually updated in the store
  const checkOrderUpdated = (orderId, newStatusId) => {
    const updatedOrder = orders.find(order => order.order_id === orderId);
    const wasUpdated = updatedOrder && updatedOrder.order_status_id === newStatusId;
    return wasUpdated;
  };

  // Handle update states with enhanced logic
  useEffect(() => {
    const prevState = previousStateRef.current;
    const newStatusId = form.getFieldValue('order_status_id');
    // Loading finished
    if (prevState.updateLoading && !updateLoading && isSubmitting && visible && !hasShownToast) {
      // Check if order was actually updated in Redux store
      const orderWasUpdated = checkOrderUpdated(orderData.order_id, newStatusId);

      if (orderWasUpdated) {
        // // Order was updated successfully despite error message
        // toast.success("Cập nhật trạng thái đơn hàng thành công");
        setHasShownToast(true);

        onSuccess && onSuccess(orderData.order_id, newStatusId);
        setTimeout(() => {
          handleClose();
        }, 500);
      } else if (updateError) {
        // Actual failure
        toast.error(`Lỗi cập nhật: ${updateError}`);
        setIsSubmitting(false);
      } else {
        // Wait a bit more for store to update
        setTimeout(() => {
          const delayed_orderWasUpdated = checkOrderUpdated(orderData.order_id, newStatusId);
          if (delayed_orderWasUpdated) {
            setHasShownToast(true);
            onSuccess && onSuccess(orderData.order_id, newStatusId);
            setTimeout(() => {
              handleClose();
            }, 300);
          }
        }, 100);
      }
    }

    // Update previous state
    previousStateRef.current = { updateLoading, updateError };
  }, [updateLoading, updateError, isSubmitting, visible, hasShownToast, orders, orderData, form, onSuccess]);

  const handleFinish = (values) => {
    const { order_status_id: newStatusId } = values;
    // Lấy currentStatusId chính xác
    let currentStatusId = orderData.order_status_id;

    // Nếu không có order_status_id, thử lấy từ order_status object
    if (!currentStatusId && orderData?.order_status?._id) {
      currentStatusId = orderData.order_status._id;
    }

    // Nếu vẫn không có, thử lấy từ order_status.id
    if (!currentStatusId && orderData?.order_status?.id) {
      currentStatusId = orderData.order_status.id;
    }

    // Nếu vẫn không có ID nhưng có name, tìm ID từ name
    if (!currentStatusId && orderData?.order_status?.name) {
      const statusByName = sampleStatusOptions.find(status =>
        status.name === orderData.order_status.name
      );
      currentStatusId = statusByName?.id;
    }


    // Kiểm tra validation luồng trạng thái
    if (!isStatusTransitionValid(currentStatusId, newStatusId)) {
      const currentStatus = sampleStatusOptions.find(s => s.id === currentStatusId);
      const newStatus = sampleStatusOptions.find(s => s.id === newStatusId);
      toast.error(
        `Không thể chuyển từ "${currentStatus?.name}" sang "${newStatus?.name}". ` +
        `Vui lòng tuân thủ luồng trạng thái quy định.`
      );
      return;
    }

    // Nếu không có thay đổi trạng thái
    if (currentStatusId === newStatusId) {
      toast.warning('Trạng thái mới giống với trạng thái hiện tại.');
      return;
    }

    

    setIsSubmitting(true);
    setHasShownToast(false);
    dispatch(updateOrderRequest(orderData.order_id, values));
  };

  const handleClose = () => {
    form.resetFields();
    setIsSubmitting(false);
    setHasShownToast(false);
    onClose && onClose();
  };

  // Get current status name for display
  const getCurrentStatusName = () => {
    // Thử nhiều cách để lấy status
    let statusId = orderData?.order_status_id;

    // Nếu không có order_status_id, thử lấy từ order_status object
    if (!statusId && orderData?.order_status?._id) {
      statusId = orderData.order_status._id;
    }

    // Nếu vẫn không có, thử lấy từ order_status.id
    if (!statusId && orderData?.order_status?.id) {
      statusId = orderData.order_status.id;
    }
    // Tìm trong sampleStatusOptions
    let currentStatus = sampleStatusOptions.find(status => status.id === statusId);

    // Nếu không tìm thấy trong sampleStatusOptions, thử trực tiếp từ orderData
    if (!currentStatus && orderData?.order_status?.name) {
      return orderData.order_status.name;
    }

    return currentStatus?.name || 'Không xác định';
  };

  // Get current status key
  const getCurrentStatusKey = () => {
    // Thử nhiều cách để lấy status
    let statusId = orderData?.order_status_id;

    // Nếu không có order_status_id, thử lấy từ order_status object
    if (!statusId && orderData?.order_status?._id) {
      statusId = orderData.order_status._id;
    }

    // Nếu vẫn không có, thử lấy từ order_status.id
    if (!statusId && orderData?.order_status?.id) {
      statusId = orderData.order_status.id;
    }

    const currentStatus = sampleStatusOptions.find(status => status.id === statusId);

    // Nếu không tìm thấy trong sampleStatusOptions, thử map từ name
    if (!currentStatus && orderData?.order_status?.name) {
      const statusByName = sampleStatusOptions.find(status =>
        status.name === orderData.order_status.name
      );

      return statusByName?.key || '';
    }

    return currentStatus?.key || '';
  };

  // Get allowed next statuses based on current status
  const getAllowedStatuses = () => {
    const currentStatusKey = getCurrentStatusKey();
    const allowedKeys = STATUS_FLOW_RULES[currentStatusKey] || [];
    // Return the status options that are allowed
    const allowedStatuses = sampleStatusOptions.filter(status =>
      allowedKeys.includes(status.key)
    );

    return allowedStatuses;
  };

  // Validate if status transition is allowed
  const isStatusTransitionValid = (fromStatusId, toStatusId) => {
    const fromStatus = sampleStatusOptions.find(s => s.id === fromStatusId);
    const toStatus = sampleStatusOptions.find(s => s.id === toStatusId);

    if (!fromStatus || !toStatus) {
      return false;
    }

    const allowedKeys = STATUS_FLOW_RULES[fromStatus.key] || [];
    const isValid = allowedKeys.includes(toStatus.key);

    return isValid;
  };
// const order_status_name = orderData?.order_status.name;
// console.log('🔍 order_status_name:', orderData.order_status.name);
// console.log('🔍 order_status_id:', orderData.order_status.id);
// console.log('🔍 order_status_id:', orderData);
// console.log('🔍 order_description:', orderData.items[0].product_id);
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
            Cập nhật Trạng thái Đơn hàng
          </Title>
        </div>
      }
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      width={500}
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
        <Space direction="vertical" size="large" style={{ width: '100%' }}>


          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#13C2C2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <ShoppingCartOutlined style={{ fontSize: '24px', color: 'white' }} />
            </div>
            <Title level={4} style={{
              color: '#0D364C',
              margin: '0 0 8px 0'
            }}>
              Đơn hàng #{orderData?.order_id?.slice(-8)}
            </Title>
            <Text type="secondary">
              Trạng thái hiện tại: <strong style={{ color: sampleStatusOptions.find(s => s.id === orderData?.order_status_id)?.color }}>{getCurrentStatusName()}</strong>
            </Text>

            {/* Hiển thị thông tin luồng trạng thái */}
            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              backgroundColor: '#f6f8fa',
              borderRadius: '6px',
              border: '1px solid #e1e8ed'
            }}>
              <Text style={{ fontSize: '12px', color: '#666' }}>
                💡 <strong>Quy tắc luồng trạng thái:</strong><br />
                🔄 Chờ xử lý → Đang xử lý → Đang giao → Đã giao<br />
                ❌ Chờ xử lý → Đã hủy | 🔄 Đã giao → Trả hàng
              </Text>
            </div>
          </div>

          <Divider style={{ borderColor: '#13C2C2', opacity: 0.3 }} />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            size="large"
          >
            {/* Info về luồng trạng thái */}
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#e6f7ff',
              border: '1px solid #91d5ff',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '14px', color: '#0050b3', fontWeight: '500', marginBottom: '8px' }}>
                📋 Luồng trạng thái cho phép:
              </div>
              <div style={{ fontSize: '12px', color: '#0050b3', lineHeight: '1.6' }}>
                {(() => {
                  const allowedStatuses = getAllowedStatuses();
                  if (allowedStatuses.length === 0) {
                    return 'Không thể chuyển sang trạng thái nào khác.';
                  }
                  return `Có thể chuyển sang: ${allowedStatuses.map(s => s.name).join(', ')}`;
                })()}
              </div>
            </div>

            <Form.Item
              label={
                <Space>
                  <TagOutlined style={{ color: '#13C2C2' }} />
                  <span style={{ color: '#0D364C', fontWeight: '600' }}>
                    Trạng thái mới
                  </span>
                </Space>
              }
              name="order_status_id"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
                            <Select
                style={{ width: '100%' }}
                disabled={updateLoading}
                showSearch={false}
                placeholder="Chọn trạng thái mới..."
              >
                {(() => {
                  const allowedStatuses = getAllowedStatuses();
                  if (allowedStatuses.length === 0) {
                    return (
                      <Select.Option value={null} disabled>
                        <span style={{ color: '#999', fontStyle: 'italic' }}>
                          Không có trạng thái nào khả dụng
                        </span>
                      </Select.Option>
                    );
                  }
                  return allowedStatuses.map(status => (
                    <Select.Option
                      key={status.id}
                      value={status.id}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}>
                        <div style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: status.color
                        }} />
                        <span style={{ color: status.color, fontWeight: '500' }}>
                          {status.name}
                        </span>
                      </div>
                    </Select.Option>
                  ));
                })()}
              </Select>
            </Form.Item>

            <Divider style={{ borderColor: '#13C2C2', opacity: 0.3 }} />

            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button
                  onClick={handleClose}
                  size="large"
                  icon={<CloseOutlined />}
                  disabled={updateLoading}
                  style={{
                    height: '44px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    minWidth: '120px',
                    borderColor: '#d9d9d9',
                    color: '#666'
                  }}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updateLoading}
                  disabled={updateLoading || getAllowedStatuses().length === 0}
                  icon={<SaveOutlined />}
                  size="large"
                  style={{
                    backgroundColor: updateLoading || getAllowedStatuses().length === 0 ? '#94a3b8' : '#13C2C2',
                    borderColor: updateLoading || getAllowedStatuses().length === 0 ? '#94a3b8' : '#13C2C2',
                    height: '44px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    minWidth: '140px'
                  }}
                >
                  {updateLoading ? 'Đang cập nhật...' :
                    getAllowedStatuses().length === 0 ? 'Không thể cập nhật' : 'Cập nhật'}
                </Button>
              </Space>
            </Form.Item>
          </Form>

          {/* Error display */}
          {updateError && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fff2f0',
              border: '1px solid #ffccc7',
              borderRadius: '6px',
              color: '#cf1322'
            }}>
              <Text type="danger">
                {updateError}
              </Text>
            </div>
          )}
        </Space>
      </Card>

      <style>
        {`
          .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
            border-color: #13C2C2 !important;
          }

          .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
            border-color: #13C2C2 !important;
            box-shadow: 0 0 0 2px rgba(19, 194, 194, 0.1) !important;
          }

          .ant-btn-primary:hover:not(.ant-btn-loading) {
            background-color: #0D364C !important;
            border-color: #0D364C !important;
          }

          .ant-modal-content {
            border-radius: 12px !important;
          }

          .ant-select-dropdown {
            border-radius: 8px !important;
          }
        `}
      </style>
    </Modal>
  );
};

UpdateOrderStatus.propTypes = {
  visible: PropTypes.bool.isRequired,
  orderData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default UpdateOrderStatus;
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
  { id: '682c6d66f938f5743e9f9361', name: 'Chờ xử lý', color: '#faad14' },
  { id: '682c6e4b03ffc771169ec2ce', name: 'Đang xử lý', color: '#13C2C2' },
  { id: '682c6e9b03ffc771169ec2cf', name: 'Đang giao', color: '#1890ff' },
  { id: '682c6ec003ffc771169ec2d0', name: 'Đã giao', color: '#52c41a' },
  { id: '682c6edc03ffc771169ec2d1', name: 'Đã hủy', color: '#ff4d4f' },
  { id: '682c6f0603ffc771169ec2d2', name: 'Trả hàng', color: '#ff4d4f' },
];

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
    console.log('🔍 Redux State Changed:', {
      updateLoading,
      updateError,
      isSubmitting,
      visible,
      orderId: orderData?.order_id
    });
  }, [updateLoading, updateError, isSubmitting, visible, orderData?.order_id]);

  // Reset form when modal opens
  useEffect(() => {
    if (visible && orderData) {
      form.setFieldsValue({ order_status_id: orderData.order_status_id });
      setIsSubmitting(false);
      setHasShownToast(false);
      console.log('🔄 Modal opened, form reset');
    }
  }, [visible, orderData, form]);

  // Check if order was actually updated in the store
  const checkOrderUpdated = (orderId, newStatusId) => {
    const updatedOrder = orders.find(order => order.order_id === orderId);
    const wasUpdated = updatedOrder && updatedOrder.order_status_id === newStatusId;
    console.log('🎯 Order Update Check:', {
      orderId,
      newStatusId,
      currentStatusInStore: updatedOrder?.order_status_id,
      wasUpdated
    });
    return wasUpdated;
  };

  // Handle update states with enhanced logic
  useEffect(() => {
    const prevState = previousStateRef.current;
    const newStatusId = form.getFieldValue('order_status_id');

    console.log('📊 State Transition:', {
      from: prevState,
      to: { updateLoading, updateError },
      isSubmitting,
      visible
    });

    // Loading finished
    if (prevState.updateLoading && !updateLoading && isSubmitting && visible && !hasShownToast) {
      // Check if order was actually updated in Redux store
      const orderWasUpdated = checkOrderUpdated(orderData.order_id, newStatusId);

      if (orderWasUpdated) {
        // // Order was updated successfully despite error message
        // console.log('✅ Order updated successfully (despite error message)');
        // toast.success("Cập nhật trạng thái đơn hàng thành công");
        setHasShownToast(true);

        onSuccess && onSuccess(orderData.order_id, newStatusId);
        setTimeout(() => {
          handleClose();
        }, 500);
      } else if (updateError) {
        // Actual failure
        console.log('❌ Order update failed:', updateError);
        toast.error(`Lỗi cập nhật: ${updateError}`);
        setIsSubmitting(false);
      } else {
        // Success case (no error, no update detected yet - might be timing issue)
        console.log('⚠️ Success case but no update detected in store yet');
        // Wait a bit more for store to update
        setTimeout(() => {
          const delayed_orderWasUpdated = checkOrderUpdated(orderData.order_id, newStatusId);
          if (delayed_orderWasUpdated) {
            // console.log('✅ Order updated successfully (delayed detection)');
            // toast.success("Cập nhật trạng thái đơn hàng thành công");
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
    console.log('🚀 Submitting update:', {
      orderId: orderData.order_id,
      currentStatus: orderData.order_status_id,
      newStatus: values.order_status_id,
      values
    });

    setIsSubmitting(true);
    setHasShownToast(false);
    dispatch(updateOrderRequest(orderData.order_id, values));
  };

  const handleClose = () => {
    console.log('🔒 Closing modal');
    form.resetFields();
    setIsSubmitting(false);
    setHasShownToast(false);
    onClose && onClose();
  };

  // Get current status name for display
  const getCurrentStatusName = () => {
    const currentStatus = sampleStatusOptions.find(
      status => status.id === orderData?.order_status_id
    );
    return currentStatus?.name || 'Không xác định';
  };

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
          {/* Debug Info - Remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{
              padding: '8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              <div>Loading: {updateLoading ? '✓' : '✗'}</div>
              <div>Error: {updateError || 'None'}</div>
              <div>Submitting: {isSubmitting ? '✓' : '✗'}</div>
              <div>Toast Shown: {hasShownToast ? '✓' : '✗'}</div>
            </div>
          )}

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
              Trạng thái hiện tại: <strong>{getCurrentStatusName()}</strong>
            </Text>
          </div>

          <Divider style={{ borderColor: '#13C2C2', opacity: 0.3 }} />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            size="large"
          >
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
                placeholder="Chọn trạng thái đơn hàng"
                style={{ width: '100%' }}
                disabled={updateLoading}
                options={sampleStatusOptions.map(status => ({
                  value: status.id,
                  label: (
                    <span style={{ color: status.color, fontWeight: '500' }}>
                      {status.name}
                    </span>
                  )
                }))}
                optionRender={(option) => (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: sampleStatusOptions.find(s => s.id === option.value)?.color
                    }} />
                    <span>{option.label}</span>
                  </div>
                )}
              />
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
                  icon={<SaveOutlined />}
                  size="large"
                  style={{
                    backgroundColor: updateLoading ? '#94a3b8' : '#13C2C2',
                    borderColor: updateLoading ? '#94a3b8' : '#13C2C2',
                    height: '44px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    minWidth: '140px'
                  }}
                >
                  {updateLoading ? 'Đang cập nhật...' : 'Cập nhật'}
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
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, Form, Switch, Typography, Card, Space, Divider } from "antd";
import {
    EditOutlined,
    SaveOutlined,
    CloseOutlined,
    CommentOutlined,
    EyeOutlined,
    EyeInvisibleOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const UpdateReviewStatus = ({ visible, reviewData, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [switchValue, setSwitchValue] = useState(true);
    const { updateLoading } = useSelector(state => state.review);

    useEffect(() => {
        if (visible && reviewData) {
            const statusValue = reviewData.status !== undefined ? reviewData.status : true;
            form.setFieldsValue({ status: statusValue });
            setSwitchValue(statusValue);
        }
    }, [visible, reviewData, form]);

    const handleFinish = (values) => {
        console.log('Updating review status:', values);
        onSuccess && onSuccess(reviewData?._id, values.status);
        onClose && onClose();
    };

    const handleSwitchChange = (checked) => {
        setSwitchValue(checked);
        form.setFieldsValue({ status: checked });
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
                        Cập nhật Trạng thái Review
                    </Title>
                </div>
            }
            onCancel={onClose}
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
                            <CommentOutlined style={{ fontSize: '24px', color: 'white' }} />
                        </div>
                        <Title level={4} style={{
                            color: '#0D364C',
                            margin: '0 0 8px 0'
                        }}>
                            Review #{reviewData?._id}
                        </Title>
                        <Text type="secondary">
                            Cập nhật trạng thái hiển thị cho review
                        </Text>
                    </div>

                    <Divider style={{ borderColor: '#13C2C2', opacity: 0.3 }} />

                    {/* Review Info */}
                    {reviewData && (
                        <div style={{
                            padding: '16px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <Text strong style={{ color: '#0D364C', display: 'block', marginBottom: '12px' }}>
                                Thông tin review chi tiết:
                            </Text>

                            {/* Thông tin khách hàng */}
                            <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#fff', borderRadius: '6px' }}>
                                <Text strong style={{ color: '#0D364C', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                                    👤 Khách hàng:
                                </Text>
                                <Text style={{ display: 'block', color: '#666', marginBottom: '2px' }}>
                                    Tên: {reviewData.user_id?.user_name || 'N/A'}
                                </Text>
                                <Text style={{ display: 'block', color: '#666', fontSize: '12px' }}>
                                    Email: {reviewData.user_id?.email || 'N/A'}
                                </Text>
                            </div>

                            {/* Thông tin sản phẩm */}
                            <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#fff', borderRadius: '6px' }}>
                                <Text strong style={{ color: '#0D364C', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                                    🛍️ Sản phẩm:
                                </Text>
                                <Text style={{ display: 'block', color: '#666', marginBottom: '2px' }}>
                                    Tên: {reviewData.productDetail?.name || reviewData.product_id?.name || 'N/A'}
                                </Text>
                                {reviewData.productDetail?.price !== undefined && (
                                    <Text style={{ display: 'block', color: '#666', marginBottom: '2px' }}>
                                        Giá: {reviewData.productDetail.price.toLocaleString()}₫
                                    </Text>
                                )}
                                {reviewData.productDetail?.category_name && (
                                    <Text style={{ display: 'block', color: '#666', marginBottom: '2px' }}>
                                        Danh mục: {reviewData.productDetail.category_name}
                                    </Text>
                                )}
                                {reviewData.productDetail?.factory && (
                                    <Text style={{ display: 'block', color: '#666', fontSize: '12px' }}>
                                        Nhà sản xuất: {reviewData.productDetail.factory}
                                    </Text>
                                )}
                            </div>

                            {/* Đánh giá */}
                            <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#fff', borderRadius: '6px' }}>
                                <Text strong style={{ color: '#0D364C', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                                    ⭐ Đánh giá: {reviewData.rating}/5 sao
                                </Text>
                                <Text style={{
                                    color: '#666',
                                    fontStyle: 'italic',
                                    backgroundColor: '#f9f9f9',
                                    padding: '6px',
                                    borderRadius: '4px',
                                    border: '1px solid #e5e7eb',
                                    display: 'block',
                                    fontSize: '13px'
                                }}>
                                    "{reviewData.comment}"
                                </Text>
                            </div>

                            {/* Thời gian */}
                            <div style={{ padding: '8px', backgroundColor: '#fff', borderRadius: '6px' }}>
                                <Text strong style={{ color: '#0D364C', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                                    📅 Thời gian:
                                </Text>
                                <Text style={{ display: 'block', color: '#666', fontSize: '12px', marginBottom: '2px' }}>
                                    Tạo: {new Date(reviewData.createdAt).toLocaleString('vi-VN')}
                                </Text>
                                {reviewData.updatedAt && reviewData.updatedAt !== reviewData.createdAt && (
                                    <Text style={{ display: 'block', color: '#666', fontSize: '12px' }}>
                                        Cập nhật: {new Date(reviewData.updatedAt).toLocaleString('vi-VN')}
                                    </Text>
                                )}
                            </div>
                        </div>
                    )}

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        size="large"
                    >
                        <Form.Item
                            label={
                                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                                    Trạng thái hiển thị
                                </Text>
                            }
                            name="status"
                            valuePropName="checked"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Switch
                                    checked={switchValue}
                                    checkedChildren={<EyeOutlined />}
                                    unCheckedChildren={<EyeInvisibleOutlined />}
                                    onChange={handleSwitchChange}
                                />
                                <Text style={{ color: '#666', fontSize: '14px' }}>
                                    {switchValue ? 'Review sẽ được hiển thị công khai' : 'Review sẽ được ẩn khỏi danh sách'}
                                </Text>
                            </div>
                        </Form.Item>

                        <Divider style={{ borderColor: '#13C2C2', opacity: 0.3 }} />

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Button
                                    onClick={onClose}
                                    size="large"
                                    icon={<CloseOutlined />}
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
                </Space>
            </Card>

            <style>
                {`
          /* Switch màu xanh khi bật (hiển thị) */
          .ant-switch-checked {
            background-color: #52c41a !important;
          }
          
          /* Switch màu đỏ khi tắt (ẩn) */
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

          .ant-btn-primary:hover {
            background-color: #0D364C !important;
            border-color: #0D364C !important;
          }

          .ant-modal-content {
            border-radius: 12px !important;
          }
        `}
            </style>
        </Modal>
    );
};

UpdateReviewStatus.propTypes = {
    visible: PropTypes.bool.isRequired,
    reviewData: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func
};

export default UpdateReviewStatus; 
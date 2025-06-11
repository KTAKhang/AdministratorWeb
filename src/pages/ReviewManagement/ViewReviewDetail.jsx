import { Modal, Button, Tag, Typography, Card, Space, Divider, Avatar, Rate } from "antd";
import {
    EyeOutlined,
    CommentOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    CalendarOutlined,
    StarOutlined,
    CloseOutlined,
    TagOutlined,
    ShoppingOutlined
} from "@ant-design/icons";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const ViewReviewDetail = ({ visible, reviewData, onClose }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return '#52c41a';
        if (rating >= 3) return '#faad14';
        return '#ff4d4f';
    };

    const getRatingText = (rating) => {
        switch (rating) {
            case 5: return 'Rất hài lòng';
            case 4: return 'Hài lòng';
            case 3: return 'Bình thường';
            case 2: return 'Không hài lòng';
            case 1: return 'Rất không hài lòng';
            default: return 'Chưa đánh giá';
        }
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
                    <EyeOutlined style={{ color: '#13C2C2' }} />
                    <Title level={4} style={{ margin: 0, color: '#0D364C' }}>
                        Chi tiết Review
                    </Title>
                </div>
            }
            onCancel={onClose}
            footer={
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
                    Đóng
                </Button>
            }
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
            {reviewData ? (
                <Card
                    bordered={false}
                    style={{
                        boxShadow: 'none',
                        background: 'transparent'
                    }}
                >
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        {/* Header with Rating */}
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '24px'
                        }}>
                            <Avatar
                                size={120}
                                icon={<CommentOutlined />}
                                style={{
                                    backgroundColor: '#13C2C2',
                                    marginBottom: '16px'
                                }}
                            />
                            <Title level={3} style={{
                                margin: '8px 0',
                                color: '#0D364C'
                            }}>
                                Review #{reviewData._id}
                            </Title>
                            <Space direction="vertical" size="small">
                                <Rate
                                    disabled
                                    defaultValue={reviewData.rating}
                                    style={{ fontSize: '20px' }}
                                />
                                <Space size="small">
                                    <Tag
                                        color={getRatingColor(reviewData.rating)}
                                        style={{ borderRadius: '16px', padding: '4px 12px', fontSize: '14px' }}
                                    >
                                        {reviewData.rating}/5 ⭐ - {getRatingText(reviewData.rating)}
                                    </Tag>
                                    <Tag
                                        color={reviewData.status ? '#13C2C2' : '#ff4d4f'}
                                        style={{ borderRadius: '16px', padding: '4px 12px' }}
                                    >
                                        {reviewData.status ? 'Hiển thị' : 'Ẩn'}
                                    </Tag>
                                </Space>
                            </Space>
                        </div>

                        <Divider style={{ margin: '0 0 24px 0' }} />

                        {/* Info Items */}
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <div className="info-item">
                                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                                    <TagOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                                    ID Review
                                </Text>
                                <div style={{ marginTop: '8px' }}>
                                    <Text style={{
                                        fontFamily: 'monospace',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        backgroundColor: '#f3f4f6',
                                        border: '1px solid #e5e7eb',
                                        color: '#374151',
                                        fontSize: '13px',
                                        display: 'inline-block'
                                    }}>
                                        {reviewData._id}
                                    </Text>
                                </div>
                            </div>

                            <div className="info-item">
                                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                                    <ShoppingOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                                    Sản phẩm được đánh giá
                                </Text>
                                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Avatar
                                        src={reviewData.product_id.image}
                                        size={60}
                                        icon={<ShoppingOutlined />}
                                        style={{ backgroundColor: '#13C2C2' }}
                                    />
                                    <div>
                                        <Text style={{ display: 'block', color: '#0D364C', fontSize: '16px', fontWeight: '500' }}>
                                            {reviewData.product_id.name}
                                        </Text>
                                        <Text type="secondary">
                                            ID: {reviewData.product_id._id}
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            <div className="info-item">
                                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                                    <StarOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                                    Đánh giá chi tiết
                                </Text>
                                <div style={{ marginTop: '12px' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        marginBottom: '8px'
                                    }}>
                                        <Rate
                                            disabled
                                            defaultValue={reviewData.rating}
                                            style={{ fontSize: '18px' }}
                                        />
                                        <Tag
                                            color={getRatingColor(reviewData.rating)}
                                            style={{ borderRadius: '16px', padding: '4px 12px' }}
                                        >
                                            {reviewData.rating}/5
                                        </Tag>
                                    </div>
                                    <Text style={{ color: '#666', fontSize: '14px' }}>
                                        {getRatingText(reviewData.rating)}
                                    </Text>
                                </div>
                            </div>

                            <div className="info-item">
                                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                                    <CommentOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                                    Bình luận
                                </Text>
                                <div style={{
                                    marginTop: '12px',
                                    padding: '16px',
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    borderLeft: '4px solid #13C2C2'
                                }}>
                                    <Text style={{
                                        color: '#0D364C',
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        fontStyle: 'italic'
                                    }}>
                                        "{reviewData.comment}"
                                    </Text>
                                </div>
                            </div>

                            <div className="info-item">
                                <Text strong style={{ color: '#0D364C', fontSize: '14px' }}>
                                    <CalendarOutlined style={{ color: '#13C2C2', marginRight: '8px' }} />
                                    Thời gian đánh giá
                                </Text>
                                <Text style={{
                                    display: 'block',
                                    color: '#0D364C',
                                    marginTop: '8px'
                                }}>
                                    {formatDate(reviewData.createdAt)}
                                </Text>
                            </div>
                        </Space>
                    </Space>
                </Card>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 0'
                }}>
                    <Text type="secondary">Đang tải thông tin review...</Text>
                </div>
            )}

            <style>
                {`
          .info-item {
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
        `}
            </style>
        </Modal>
    );
};

ViewReviewDetail.propTypes = {
    visible: PropTypes.bool.isRequired,
    reviewData: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default ViewReviewDetail; 
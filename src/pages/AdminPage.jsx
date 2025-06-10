import { useState } from "react";
import { Card, Row, Col, Statistic, Typography, Progress, Badge, Avatar } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  HeartOutlined,
  TeamOutlined,
  GiftOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

export default function AdminPage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

  const areaData = [
    { month: "Tháng 1", doanhSo: 255, loiNhuan: 180 },
    { month: "Tháng 2", doanhSo: 180, loiNhuan: 100 },
    { month: "Tháng 3", doanhSo: 280, loiNhuan: 200 },
    { month: "Tháng 4", doanhSo: 350, loiNhuan: 250 },
    { month: "Tháng 5", doanhSo: 420, loiNhuan: 300 },
    { month: "Tháng 6", doanhSo: 500, loiNhuan: 350 },
    { month: "Tháng 7", doanhSo: 500, loiNhuan: 280 },
    { month: "Tháng 8", doanhSo: 310, loiNhuan: 200 },
    { month: "Tháng 9", doanhSo: 360, loiNhuan: 600 },
    { month: "Tháng 10", doanhSo: 270, loiNhuan: 180 },
    { month: "Tháng 11", doanhSo: 400, loiNhuan: 300 },
    { month: "Tháng 12", doanhSo: 480, loiNhuan: 350 },
  ];

  const cardStats = [
    {
      title: "Doanh thu hôm nay",
      value: 53000,
      icon: <DollarOutlined style={{ fontSize: 28 }} />,
      suffix: "+5.5%",
      trend: "up",
      bgColor: "linear-gradient(135deg, #13C2C2 0%, #0D364C 100%)",
    },
    {
      title: "Khách hàng mới",
      value: 33,
      icon: <UserOutlined style={{ fontSize: 28 }} />,
      suffix: "-47.2%",
      trend: "down", 
      bgColor: "linear-gradient(135deg, #0D364C 0%, #13C2C2 100%)",
    },
    {
      title: "Doanh số",
      value: 173000,
      icon: <ShoppingCartOutlined style={{ fontSize: 28 }} />,
      suffix: "+8.3%",
      trend: "up",
      bgColor: "linear-gradient(135deg, #13C2C2 0%, #0D364C 100%)",
    },
  ];

  const summaryStats = [
    {
      label: 'Tổng người dùng',
      value: '32,984',
      icon: <TeamOutlined style={{ fontSize: 20 }} />,
      trend: '+12.5%',
      color: '#13C2C2'
    },
    {
      label: 'Tổng doanh số',
      value: '2,400 SP',
      icon: <ShoppingCartOutlined style={{ fontSize: 20 }} />,
      trend: '+8.2%',
      color: '#52C41A'
    },
    {
      label: 'Tổng doanh thu',
      value: '2.42m',
      icon: <DollarOutlined style={{ fontSize: 20 }} />,
      trend: '+15.3%',
      color: '#FA8C16'
    },
    {
      label: 'Tổng sản phẩm',
      value: '320',
      icon: <GiftOutlined style={{ fontSize: 20 }} />,
      trend: '+5.7%',
      color: '#722ED1'
    }
  ];

  const StatCard = ({ stat, index }) => (
    <Card
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
      style={{
        borderRadius: 20,
        border: "none",
        background: stat.bgColor,
        boxShadow: hoveredCard === index
          ? "0 20px 40px rgba(13, 54, 76, 0.3)"
          : "0 8px 24px rgba(13, 54, 76, 0.15)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hoveredCard === index ? "translateY(-8px)" : "translateY(0)",
        overflow: "hidden",
        position: "relative",
      }}
      bodyStyle={{ padding: "24px" }}
    >
      <div style={{ 
        position: "absolute", 
        top: -50, 
        right: -50, 
        width: 100, 
        height: 100, 
        background: "rgba(255,255,255,0.1)", 
        borderRadius: "50%" 
      }} />
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500 }}>
            {stat.title}
          </Text>
          <div style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            color: "white", 
            marginTop: 8,
            marginBottom: 12
          }}>
            {stat.value.toLocaleString()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {stat.trend === "up" ? (
              <ArrowUpOutlined style={{ color: "#52c41a", fontSize: 16 }} />
            ) : (
              <ArrowDownOutlined style={{ color: "#ff4d4f", fontSize: 16 }} />
            )}
            <Text style={{ 
              color: stat.trend === "up" ? "#52c41a" : "#ff4d4f", 
              fontSize: 14,
              fontWeight: 600 
            }}>
              {stat.suffix}
            </Text>
          </div>
        </div>
        <div style={{ 
          color: "rgba(255,255,255,0.9)",
          background: "rgba(255,255,255,0.2)",
          padding: "12px",
          borderRadius: "12px",
          backdropFilter: "blur(10px)"
        }}>
          {stat.icon}
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f7fa 100%)",
      padding: "24px"
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ color: "#0D364C", marginBottom: 8 }}>
          Dashboard Quản Trị
        </Title>
        <Text style={{ color: "#13C2C2", fontSize: 16 }}>
          Tổng quan hoạt động kinh doanh hôm nay
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {cardStats.map((stat, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <div
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                animation: `slideInUp 0.6s ease-out ${index * 0.1}s forwards`,
              }}
            >
              <StatCard stat={stat} index={index} />
            </div>
          </Col>
        ))}
      </Row>

      {/* Chart Section */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            style={{
              borderRadius: 20,
              border: `2px solid #13C2C2`,
              boxShadow: "0 8px 32px rgba(19, 194, 194, 0.1)",
              background: "white",
            }}
            bodyStyle={{ padding: "32px" }}
          >
            <div style={{ marginBottom: 24 }}>
              <Title level={4} style={{ color: "#0D364C", marginBottom: 8 }}>
                Tổng quan doanh thu
              </Title>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Badge color="#13C2C2" text="Doanh thu" />
                <Text style={{ color: "#13C2C2", fontSize: 14 }}>
                 Năm 2024
                </Text>
              </div>
            </div>

            {/* Simple Chart Visualization */}
            <div style={{ height: 300, position: "relative" }}>
              {areaData.map((item, index) => (
                <div key={index} style={{
                  position: "absolute",
                  bottom: 0,
                  left: `${(index / (areaData.length - 1)) * 90}%`,
                  width: "8px",
                  height: `${(item.doanhSo / 500) * 100}%`,
                  background: "linear-gradient(to top, #0D364C, #13C2C2)",
                  borderRadius: "4px 4px 0 0",
                  transition: "all 0.3s ease",
                  marginRight: "4px"
                }}>
                  <div style={{
                    position: "absolute",
                    top: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "10px",
                    color: "#0D364C",
                    fontWeight: "600"
                  }}>
                    {item.doanhSo}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 20,
              border: "none",
              boxShadow: "0 12px 40px rgba(13, 54, 76, 0.12)",
              background: "white",
              height: "100%",
              overflow: "hidden"
            }}
            bodyStyle={{ padding: 0 }}
          >
            {/* Enhanced Header */}
            <div style={{
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
              padding: "32px 32px 24px 32px",
              borderBottom: "1px solid #e2e8f0"
            }}>
              <Title level={4} style={{ color: "#0D364C", marginBottom: 8 }}>
                Tổng thống kê
              </Title>
              <Text style={{ color: "#64748b", fontSize: 14 }}>
                Cập nhật theo thời gian thực
              </Text>
            </div>

            {/* Enhanced Stats Content */}
            <div style={{ padding: "24px 32px 32px 32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {summaryStats.map((stat, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredStat(index)}
                    onMouseLeave={() => setHoveredStat(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      borderRadius: "16px",
                      background: hoveredStat === index ? `${stat.color}08` : "transparent",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: hoveredStat === index ? "translateX(4px)" : "translateX(0)",
                      border: `1px solid ${hoveredStat === index ? `${stat.color}20` : "transparent"}`,
                      animation: `fadeInLeft 0.6s ease-out ${index * 0.1}s forwards`,
                      opacity: 0
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        background: `${stat.color}15`,
                        color: stat.color,
                        transition: "all 0.3s ease",
                        transform: hoveredStat === index ? "scale(1.1)" : "scale(1)"
                      }}>
                        {stat.icon}
                      </div>
                      <div>
                        <Text style={{ 
                          color: "#374151", 
                          fontSize: 15, 
                          fontWeight: 500,
                          display: "block",
                          lineHeight: 1.2
                        }}>
                          {stat.label}
                        </Text>
                        <div style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 4,
                          padding: "2px 8px",
                          borderRadius: "6px",
                          background: `${stat.color}15`,
                          fontSize: 12,
                          fontWeight: 600,
                          color: stat.color
                        }}>
                          <ArrowUpOutlined style={{ fontSize: 10 }} />
                          {stat.trend}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Text style={{
                        color: stat.color,
                        fontSize: 24,
                        fontWeight: 700,
                        transition: "all 0.3s ease",
                        transform: hoveredStat === index ? "scale(1.05)" : "scale(1)",
                        display: "inline-block"
                      }}>
                        {stat.value}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom accent line */}
            <div style={{
              height: 4,
              background: "linear-gradient(90deg, #13C2C2 0%, #52C41A 25%, #FA8C16 50%, #722ED1 75%, #13C2C2 100%)"
            }} />
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
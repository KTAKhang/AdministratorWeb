import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Row, Col, Statistic, Typography, Progress, Badge, Avatar, Spin, Input, Button } from "antd";
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
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  getRevenueByMonthRequest,
  getCompleteDashboardRequest,
} from "../redux/actions/dashboardActions";

const { Text, Title } = Typography;

export default function AdminPage() {
  const dispatch = useDispatch();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

  // Redux selectors
  const {
    overview,
    revenueByMonth,
    revenueByMonthLoading,
    revenueByDate,
    newCustomers,
    salesByDate,
    topProducts,
    completeDashboardLoading,
    dashboardLoading,
  } = useSelector((state) => state.dashboard);

  // State for year selection
  const [selectedYear, setSelectedYear] = useState(2025);

  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Load dashboard data on component mount
  useEffect(() => {
    const today = getCurrentDate();

    // Use complete dashboard API to get most data in one call
    dispatch(getCompleteDashboardRequest(today, today));

    // Only get revenue by month separately since it needs year parameter
    dispatch(getRevenueByMonthRequest(selectedYear));
  }, [dispatch, selectedYear]);

  // Function to handle year change
  const handleYearChange = () => {
    dispatch(getRevenueByMonthRequest(selectedYear));
  };

  // Transform API data for chart
  const areaData = revenueByMonth.length > 0
    ? revenueByMonth.map((item, index) => ({
      month: `Tháng ${item.month}`,
      doanhSo: item.totalRevenue / 1000, // Convert to thousands
      loiNhuan: item.totalRevenue * 0.7 / 1000, // Estimated profit margin
    }))
    : [
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

  // Get today's actual data from API
  const getTodayRevenue = () => {
    if (revenueByDate && revenueByDate.length > 0) {
      return revenueByDate[0].totalRevenue || 0;
    }
    return 0;
  };

  const getTodayNewCustomers = () => {
    if (newCustomers && newCustomers.length > 0) {
      return newCustomers[0].newCustomers || 0;
    }
    return 0;
  };

  const getTodaySales = () => {
    if (salesByDate && salesByDate.length > 0) {
      return salesByDate[0].totalOrders || 0;
    }
    return 0;
  };



  const cardStats = [
    {
      title: "Doanh thu hôm nay",
      value: getTodayRevenue(),
      icon: <DollarOutlined style={{ fontSize: 28 }} />,
      bgColor: "linear-gradient(135deg, #13C2C2 0%, #0D364C 100%)",
    },
    {
      title: "Khách hàng mới hôm nay",
      value: getTodayNewCustomers(),
      icon: <UserOutlined style={{ fontSize: 28 }} />,
      bgColor: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
    },
    {
      title: "Doanh số hôm nay",
      value: getTodaySales(),
      icon: <ShoppingCartOutlined style={{ fontSize: 28 }} />,
      bgColor: "linear-gradient(135deg, #fa8c16 0%, #d4380d 100%)",
    },
    {
      title: "Đơn hàng chờ xử lý",
      value: 0, // Sẽ được cập nhật từ API sau
      icon: <ClockCircleOutlined style={{ fontSize: 28 }} />,
      bgColor: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
    },
  ];

  const summaryStats = [
    {
      label: 'Tổng người dùng',
      value: overview.totalUsers ? overview.totalUsers.toLocaleString() : '5',
      icon: <TeamOutlined style={{ fontSize: 20 }} />,
      color: '#13C2C2'
    },
    {
      label: 'Tổng đơn hàng',
      value: overview.totalOrders ? overview.totalOrders.toLocaleString() : '2',
      icon: <ShoppingCartOutlined style={{ fontSize: 20 }} />,
      color: '#52C41A'
    },
    {
      label: 'Tổng doanh thu',
      value: overview.totalRevenue ? overview.totalRevenue.toLocaleString() : '1,568,000',
      icon: <DollarOutlined style={{ fontSize: 20 }} />,
      color: '#FA8C16'
    },
    {
      label: 'Tổng sản phẩm',
      value: overview.totalProducts ? overview.totalProducts.toLocaleString() : '10',
      icon: <GiftOutlined style={{ fontSize: 20 }} />,
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
          <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 700 }}>
            {stat.title}
          </Text>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: "white",
            marginTop: 8,
            marginBottom: 10
          }}>
            {stat.value.toLocaleString()}
          </div>
        </div>
        <div style={{
          color: "rgba(255,255,255,0.9)",
          background: "rgba(255,255,255,0.2)",
          padding: "12px",
          borderRadius: "12px",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{ fontSize: "24px" }}>
            {stat.icon}
          </div>
        </div>
      </div>
    </Card>
  );

  // Show loading spinner if data is being fetched
  if (dashboardLoading || completeDashboardLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f7fa 100%)",
        padding: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Spin size="large" />
      </div>
    );
  }

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
          <Col xs={24} sm={12} md={12} lg={6} xl={6} key={index}>
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
              height: "480px",
            }}
            bodyStyle={{ padding: "32px" }}
          >
            <div style={{ marginBottom: 24 }}>
              <Title level={4} style={{ color: "#0D364C", marginBottom: 8 }}>
                Tổng quan doanh thu
              </Title>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <Badge color="#13C2C2" text="Doanh thu" />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Text style={{ color: "#13C2C2", fontSize: 14 }}>Năm:</Text>
                  <Input
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value) || 2025)}
                    style={{ width: 80 }}
                    min={2020}
                    max={2030}
                  />
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleYearChange}
                    style={{
                      background: "#13C2C2",
                      borderColor: "#13C2C2"
                    }}
                  >
                    Cập nhật
                  </Button>
                </div>
              </div>
            </div>

            {/* Simple Chart Visualization */}
            <div style={{
              height: "calc(480px - 200px)", // Trừ đi height của header, padding và month labels
              position: "relative",
              minHeight: "200px"
            }}>
              {revenueByMonthLoading || completeDashboardLoading ? (
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%"
                }}>
                  <Spin />
                </div>
              ) : (
                <>
                  {areaData.map((item, index) => (
                    <div key={index} style={{
                      position: "absolute",
                      bottom: 30, // Để chỗ cho month labels
                      left: `${(index / (areaData.length - 1)) * 90}%`,
                      width: "8px",
                      height: `${Math.min((item.doanhSo / 500) * 100, 100)}%`,
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
                        {Math.round(item.doanhSo)}
                      </div>
                    </div>
                  ))}
                  {/* Month Labels */}
                  {areaData.map((item, index) => (
                    <div key={`month-${index}`} style={{
                      position: "absolute",
                      bottom: 5,
                      left: `${(index / (areaData.length - 1)) * 90}%`,
                      transform: "translateX(-50%)",
                      fontSize: "11px",
                      color: "#13C2C2",
                      fontWeight: "500",
                      textAlign: "center"
                    }}>
                      T{index + 1}
                    </div>
                  ))}
                </>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 20,
              border: `2px solid #13C2C2`,
              boxShadow: "0 8px 32px rgba(19, 194, 194, 0.15)",
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0f7fa 100%)",
              height: "480px",
              overflow: "hidden"
            }}
            bodyStyle={{ padding: 0 }}
          >
            {/* Enhanced Header */}
            <div style={{
              background: "linear-gradient(135deg, #13C2C2 0%, #0D364C 100%)",
              padding: "32px 32px 24px 32px",
              borderBottom: "none"
            }}>
              <Title level={4} style={{ color: "white", marginBottom: 8 }}>
                Tổng thống kê
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
                Cập nhật theo thời gian thực
              </Text>
            </div>

            {/* Enhanced Stats Content */}
            <div style={{
              padding: "24px 32px 32px 32px",
              background: "white",
              flex: 1,
              overflowY: "auto",
              height: "calc(480px - 120px)" // Trừ đi height của header
            }}>
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
                      padding: "20px 24px",
                      borderRadius: "16px",
                      background: hoveredStat === index
                        ? `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}08 100%)`
                        : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: hoveredStat === index ? "translateY(-2px) scale(1.02)" : "translateY(0) scale(1)",
                      border: `2px solid ${hoveredStat === index ? stat.color : "rgba(13, 54, 76, 0.1)"}`,
                      boxShadow: hoveredStat === index
                        ? `0 8px 25px ${stat.color}20`
                        : "0 2px 8px rgba(13, 54, 76, 0.08)",
                      animation: `fadeInLeft 0.6s ease-out ${index * 0.1}s forwards`,
                      opacity: 0
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 52,
                        height: 52,
                        borderRadius: "16px",
                        background: hoveredStat === index
                          ? `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}cc 100%)`
                          : `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}15 100%)`,
                        color: hoveredStat === index ? "white" : stat.color,
                        transition: "all 0.3s ease",
                        transform: hoveredStat === index ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)",
                        boxShadow: hoveredStat === index
                          ? `0 4px 15px ${stat.color}40`
                          : "0 2px 8px rgba(0,0,0,0.1)"
                      }}>
                        {stat.icon}
                      </div>
                      <div>
                        <Text style={{
                          color: "#0D364C",
                          fontSize: 16,
                          fontWeight: 600,
                          display: "block",
                          lineHeight: 1.3
                        }}>
                          {stat.label}
                        </Text>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Text style={{
                        color: hoveredStat === index ? stat.color : "#0D364C",
                        fontSize: 28,
                        fontWeight: 700,
                        transition: "all 0.3s ease",
                        transform: hoveredStat === index ? "scale(1.1)" : "scale(1)",
                        display: "inline-block",
                        textShadow: hoveredStat === index ? `0 2px 4px ${stat.color}20` : "none"
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
              height: 6,
              background: "linear-gradient(90deg, #13C2C2 0%, #52C41A 25%, #FA8C16 50%, #722ED1 75%, #13C2C2 100%)",
              borderRadius: "0 0 18px 18px"
            }} />
          </Card>
        </Col>
      </Row>

      {/* Top Selling Products Section */}
      {topProducts && topProducts.length > 0 && (
        <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
          <Col span={24}>
            <Card
              style={{
                borderRadius: 20,
                border: `2px solid #13C2C2`,
                boxShadow: "0 8px 32px rgba(19, 194, 194, 0.15)",
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f7fa 100%)",
              }}
              bodyStyle={{ padding: "32px", background: "white", margin: "4px", borderRadius: "16px" }}
            >
              <div style={{ marginBottom: 32 }}>
                <Title level={4} style={{ color: "#0D364C", marginBottom: 8, fontSize: 22, fontWeight: 700 }}>
                  Sản phẩm bán chạy nhất
                </Title>
                <Text style={{ color: "#13C2C2", fontSize: 16, fontWeight: 500 }}>
                  Top sản phẩm có doanh thu cao nhất
                </Text>
              </div>

              <Row gutter={[16, 16]}>
                {topProducts.map((product, index) => (
                  <Col xs={24} sm={12} lg={8} key={product.productId}>
                    <Card
                      style={{
                        borderRadius: 20,
                        border: `2px solid ${index === 0 ? '#13C2C2' : index === 1 ? '#52C41A' : '#FA8C16'}`,
                        boxShadow: `0 8px 25px ${index === 0 ? 'rgba(19, 194, 194, 0.15)' : index === 1 ? 'rgba(82, 196, 26, 0.15)' : 'rgba(250, 140, 22, 0.15)'}`,
                        background: `linear-gradient(135deg, ${index === 0 ? '#f0f9ff' : index === 1 ? '#f6ffed' : '#fff7e6'} 0%, ${index === 0 ? '#e0f7fa' : index === 1 ? '#f6ffed' : '#fff2e8'} 100%)`,
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        ":hover": {
                          transform: "translateY(-8px) scale(1.02)",
                          boxShadow: `0 12px 40px ${index === 0 ? 'rgba(19, 194, 194, 0.25)' : index === 1 ? 'rgba(82, 196, 26, 0.25)' : 'rgba(250, 140, 22, 0.25)'}`
                        }
                      }}
                      bodyStyle={{ padding: "24px", background: "white", margin: "3px", borderRadius: "16px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{
                          width: 70,
                          height: 70,
                          borderRadius: 20,
                          background: `linear-gradient(135deg, ${index === 0 ? '#13C2C2' : index === 1 ? '#52C41A' : '#FA8C16'} 0%, ${index === 0 ? '#0D364C' : index === 1 ? '#389e0d' : '#d4380d'} 100%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 28,
                          fontWeight: "bold",
                          color: "white",
                          boxShadow: `0 4px 15px ${index === 0 ? 'rgba(19, 194, 194, 0.4)' : index === 1 ? 'rgba(82, 196, 26, 0.4)' : 'rgba(250, 140, 22, 0.4)'}`,
                          border: "3px solid rgba(255,255,255,0.3)"
                        }}>
                          #{index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#0D364C",
                            display: "block",
                            marginBottom: 6
                          }}>
                            {product.productName}
                          </Text>
                          <Text style={{ color: "#13C2C2", fontSize: 14, fontWeight: 500 }}>
                            Đã bán: {product.totalQuantitySold.toLocaleString()} sản phẩm
                          </Text>
                        </div>
                      </div>

                      <div style={{
                        marginTop: 20,
                        paddingTop: 20,
                        borderTop: `2px solid ${index === 0 ? '#13C2C220' : index === 1 ? '#52C41A20' : '#FA8C1620'}`,
                        background: `linear-gradient(135deg, ${index === 0 ? '#13C2C205' : index === 1 ? '#52C41A05' : '#FA8C1605'} 0%, transparent 100%)`,
                        borderRadius: 12,
                        padding: "16px"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <Text style={{
                              color: index === 0 ? "#13C2C2" : index === 1 ? "#52C41A" : "#FA8C16",
                              fontSize: 14,
                              display: "block",
                              fontWeight: 600,
                              marginBottom: 4
                            }}>
                              Doanh thu
                            </Text>
                            <Text style={{
                              fontSize: 20,
                              fontWeight: 700,
                              color: "#0D364C"
                            }}>
                              {product.totalRevenue.toLocaleString()}
                            </Text>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <Text style={{
                              color: index === 0 ? "#13C2C2" : index === 1 ? "#52C41A" : "#FA8C16",
                              fontSize: 14,
                              display: "block",
                              fontWeight: 600,
                              marginBottom: 4
                            }}>
                              Đơn hàng
                            </Text>
                            <Text style={{
                              fontSize: 20,
                              fontWeight: 700,
                              color: "#0D364C"
                            }}>
                              {product.orderCount.toLocaleString()}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      )}

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
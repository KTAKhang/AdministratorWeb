import React, { useState } from "react";
import { Card, Row, Col, Statistic, Typography } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Area } from "@ant-design/charts";
import Sidebar from "../components/Sidebar/Sidebar";
import { motion } from 'framer-motion';

const { Text } = Typography;

export default function AdminPage() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const areaData = [
    { month: "Tháng 1", value: 200 },
    { month: "Tháng 2", value: 100 },
    { month: "Tháng 3", value: 250 },
    { month: "Tháng 4", value: 300 },
    { month: "Tháng 5", value: 400 },
    { month: "Tháng 6", value: 500 },
    { month: "Tháng 7", value: 350 },
    { month: "Tháng 8", value: 300 },
    { month: "Tháng 9", value: 320 },
    { month: "Tháng 10", value: 250 },
    { month: "Tháng 11", value: 400 },
    { month: "Tháng 12", value: 450 },
  ];

  const areaConfig = {
    data: areaData,
    xField: "month",
    yField: "value",
    smooth: true,
    height: 300,
    autoFit: true,
    areaStyle: {
      fill: 'l(270) 0:#13c2c2 1:#ffffff',
    },
    line: {
      style: {
        stroke: "#13c2c2",
        lineWidth: 2,
      },
    },
    xAxis: {
      label: {
        style: {
          fill: "#8c8c8c",
        },
      },
      grid: null,
    },
    yAxis: {
      label: {
        style: {
          fill: "#8c8c8c",
        },
      },
      grid: null,
    },
    tooltip: {
      showCrosshairs: true,
      shared: true,
      formatter: (datum) => ({
        name: "Doanh Thu",
        value: `${datum.value}`,
      }),
    },
    animation: {
      appear: {
        animation: "path-in",
        duration: 2000,
      },
    },
  };

  const cardStats = [
    {
      title: "Doanh thu hôm nay",
      value: 53000,
      icon: <DollarOutlined style={{ fontSize: 24, color: "#13c2c2" }} />,
      suffix: "+5.5%",
      suffixColor: "#13c2c2",
    },
    {
      title: "Khách hàng mới",
      value: 33,
      icon: <UserOutlined style={{ fontSize: 24, color: "#13c2c2" }} />,
      suffix: "-47.2%",
      suffixColor: "#ff4d4f",
    },
    {
      title: "Doanh số",
      value: 173000,
      icon: <ShoppingCartOutlined style={{ fontSize: 24, color: "#13c2c2" }} />,
      suffix: "+8.3%",
      suffixColor: "#13c2c2",
    },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar isAdmin isOpen />
      <div className="flex-1 ml-[260px] bg-white">
        <div className="p-8 mt-1">
          <Row gutter={24}>
            {cardStats.map((stat, index) => (
              <Col span={8} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      borderRadius: 16,
                      border: "none",
                      background: "#ffffff",
                      boxShadow:
                        hoveredCard === index
                          ? "0 8px 32px rgba(0,0,0,0.06)"
                          : "0 4px 16px rgba(0,0,0,0.03)",
                      transition: "box-shadow 0.3s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {stat.icon}
                      <div>
                        <Text type="secondary">{stat.title}</Text>
                        <div style={{ fontSize: 20, fontWeight: 600 }}>
                          {stat.value.toLocaleString()} {" "}
                          <span style={{ color: stat.suffixColor, fontSize: 14 }}>
                            {stat.suffix}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: cardStats.length * 0.1 + 0.2 }}
          >
            <Card
              style={{
                marginTop: 24,
                borderRadius: 16,
                border: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                background: "#ffffff",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                Tổng quan doanh số{" "}
                <span style={{ color: "#13c2c2", fontWeight: 400 }}>(+5) nhiều hơn trong năm 2024</span>
              </div>
              <Area {...areaConfig} />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: cardStats.length * 0.1 + 0.4 }}
          >
            <Card
              style={{
                marginTop: 24,
                borderRadius: 16,
                border: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                background: "#ffffff",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                Người dùng hoạt động{" "}
                <span style={{ color: "#13c2c2", fontWeight: 400 }}>
                  (+23) so với tuần trước
                </span>
              </div>
              <Row gutter={24} style={{ marginTop: 16 }}>
                <Col span={6}>
                  <Statistic
                    title="Người Dùng"
                    value={32984}
                    prefix={<UserOutlined style={{ color: "#13c2c2" }} />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Tổng Doanh Thu"
                    value={2.42}
                    precision={2}
                    suffix="m"
                    prefix={<DollarOutlined style={{ color: "#13c2c2" }} />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Tổng Doanh Số"
                    value={2400}
                    suffix="SP"
                    prefix={<ShoppingCartOutlined style={{ color: "#13c2c2" }} />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Sản Phẩm"
                    value={320}
                    prefix={<ShoppingOutlined style={{ color: "#13c2c2" }} />}
                  />
                </Col>
              </Row>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

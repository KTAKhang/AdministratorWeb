import React, { useState } from "react";
import { Card, Row, Col, Statistic, Typography } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Area } from "@ant-design/charts";

const { Text } = Typography;

export default function AdminPage() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const areaData = [
    { month: "Jan", value: 200 },
    { month: "Feb", value: 100 },
    { month: "Mar", value: 250 },
    { month: "Apr", value: 300 },
    { month: "May", value: 400 },
    { month: "Jun", value: 500 },
    { month: "Jul", value: 350 },
    { month: "Aug", value: 300 },
    { month: "Sep", value: 320 },
    { month: "Oct", value: 250 },
    { month: "Nov", value: 400 },
    { month: "Dec", value: 450 },
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
        name: "Sales",
        value: `$${datum.value}`,
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
      title: "Today's Money",
      value: 53000,
      icon: <DollarOutlined style={{ fontSize: 24, color: "#13c2c2" }} />,
      suffix: "+5.5%",
      suffixColor: "#13c2c2",
    },
    {
      title: "New Clients",
      value: 3052,
      icon: <UserOutlined style={{ fontSize: 24, color: "#13c2c2" }} />,
      suffix: "-14%",
      suffixColor: "#ff4d4f",
    },
    {
      title: "Total Sales",
      value: 173000,
      icon: <ShoppingCartOutlined style={{ fontSize: 24, color: "#13c2c2" }} />,
      suffix: "+8.3%",
      suffixColor: "#13c2c2",
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <Row gutter={24}>
        {cardStats.map((stat, index) => (
          <Col span={8} key={index}>
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
                    ${stat.value.toLocaleString()}{" "}
                    <span style={{ color: stat.suffixColor, fontSize: 14 }}>
                      {stat.suffix}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

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
          Sales overview{" "}
          <span style={{ color: "#13c2c2", fontWeight: 400 }}>(+5) more in 2021</span>
        </div>
        <Area {...areaConfig} />
      </Card>

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
          Active Users{" "}
          <span style={{ color: "#13c2c2", fontWeight: 400 }}>
            (+23) than last week
          </span>
        </div>
        <Row gutter={24} style={{ marginTop: 16 }}>
          <Col span={6}>
            <Statistic
              title="Users"
              value={32984}
              prefix={<UserOutlined style={{ color: "#13c2c2" }} />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Clicks"
              value={2.42}
              precision={2}
              suffix="m"
              prefix={<ArrowUpOutlined style={{ color: "#13c2c2" }} />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Sales"
              value={2400}
              suffix="$"
              prefix={<DollarOutlined style={{ color: "#13c2c2" }} />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Items"
              value={320}
              prefix={<ShoppingOutlined style={{ color: "#13c2c2" }} />}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

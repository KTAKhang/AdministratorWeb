import { Card, Avatar, Row, Col } from 'antd';
import { 
  UserOutlined, 
  MailOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";

const UserProfile = () => {
  // Sample user data - replace with actual data fetching
  const [userData] = useState({
    user_name: 'Sample User',
    email: 'sample.user@example.com',
    avatar: '',
    role_id: 'A004',
    status: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  });

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
       return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  // Update the role name display to use proper mapping
  const getRoleDisplayName = (roleCode) => {
    switch (roleCode) {
      case 'A002':
        return 'Finance';
      case 'A003':
        return 'BUL, PM';
      case 'A004':
        return 'Admin';
      case 'A001':
        return 'Admin';
      default:
        return roleCode;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar isAdmin isOpen={true} />
      <div className="flex-1 ml-[260px] bg-white">
        <div className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10"></div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Thông tin cá nhân
              </h1>
              <p className="text-gray-500 mt-2">Quản lý thông tin và cài đặt cá nhân của bạn</p>
            </motion.div>

            <Row gutter={[24, 24]} className="items-start">
              {/* Left Column - Personal Info */}
              <Col xs={24} md={8}>
                <div className="sticky top-24 space-y-6">
                  <Card 
                    className="rounded-3xl border-0 shadow-2xl hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-lg overflow-visible"
                  >
                    <div className="text-center relative">
                      {/* Avatar Container with animation */}
                      <div className="relative inline-block group">
                        {/* Animated rings */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-20 group-hover:opacity-30 animate-pulse"></div>
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-20 group-hover:opacity-30 animate-spin-slow"></div>
                        
                        {/* Online status indicator */}
                        <div className="absolute bottom-3 right-3 z-30">
                          <div className="relative">
                            <div className={`w-4 h-4 rounded-full ${userData.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            {userData.status && (
                              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
                            )}
                          </div>
                        </div>

                        <Avatar 
                          size={160} 
                          src={userData?.avatar}
                          icon={!userData?.avatar && <UserOutlined />} 
                          className="ring-8 ring-white shadow-2xl border-4 border-gray-100 group-hover:scale-105 transition-all duration-500 relative z-10"
                        />
                        
                        {/* Role Badge with animation */}
                        <motion.div 
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-20"
                        >
                          <div 
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                          >
                            {getRoleDisplayName(userData.role_id)}
                          </div>
                        </motion.div>
                      </div>

                      {/* User Info with animation */}
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12 space-y-3"
                      >
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {userData.user_name}
                        </h2>
                        <p className="text-gray-500 font-medium">{userData.email}</p>
                      </motion.div>
                    </div>
                  </Card>
                </div>
              </Col>

              {/* Right Column - User Details */}
              <Col xs={24} md={16}>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card 
                    className="rounded-3xl border-0 shadow-2xl hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-lg"
                    title={
                      <div className="flex items-center space-x-3 py-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Thông tin tài khoản
                        </h3>
                      </div>
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: "Tên người dùng", value: userData.user_name, icon: <UserOutlined className="text-blue-500" /> },
                        { label: "Email", value: userData.email, icon: <MailOutlined className="text-green-500" /> },
                        { label: "Vai trò", value: getRoleDisplayName(userData.role_id), icon: <TeamOutlined className="text-purple-500" /> },
                        { label: "Trạng thái", value: userData.status ? 'Hoạt động' : 'Không hoạt động', icon: <CheckCircleOutlined className="text-emerald-500" /> },
                        { label: "Ngày tạo", value: formatDate(userData.createdAt), icon: <UserOutlined className="text-orange-500" /> },
                        { label: "Cập nhật lần cuối", value: formatDate(userData.updatedAt), icon: <UserOutlined className="text-yellow-500" /> },
                      ].map((item, index) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          key={item.label}
                          className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-gray-100 hover:border-gray-200 shadow-lg hover:shadow-md p-4"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          <div className="relative flex items-center space-x-4">
                            <div className="p-3 rounded-lg bg-white shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-300">
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                              <p className="text-base text-gray-900 font-semibold mt-1 group-hover:text-blue-600 transition-colors duration-300">
                                {item.value || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

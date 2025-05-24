import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  ProfileOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  LogoutOutlined,
  DownOutlined,
  RightOutlined,
  PlusOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isFinance, isAdmin, isApprover, isClaimer, isOpen }) => {
  const [isClaimsOpen, setIsClaimsOpen] = useState(false);
  const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const financeMenuItems = [
    { 
      title: "Dashboard", 
      path: "/finance", 
      icon: <HomeOutlined /> 
    }
  ];

  const claimsItems = [
    { 
      title: "Approved", 
      path: "/finance/approved", 
      icon: <CheckCircleOutlined /> 
    },
    { 
      title: "Paid", 
      path: "/finance/paid", 
      icon: <DollarOutlined /> 
    },
  ];

  const adminMenuItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: <HomeOutlined />
    },
    {
      title: "Quản Lý Kho",
      icon: <AppstoreOutlined />,
      children: [
        {
          title: "Quản Lý Category",
          path: "/admin/category",
          icon: <DatabaseOutlined />
        },
        {
          title: "Quản Lý Sản Phẩm",
          path: "/admin/product",
          icon: <AppstoreOutlined />
        }
      ]
    },
    {
      title: "Quản Lý Khách Hàng",
      path: "/admin/customer",
      icon: <UserOutlined />
    },
    {
      title: "Quản Lý Đơn Hàng",
      path: "/admin/order",
      icon: <ShoppingCartOutlined />
    },
    {
      title: "Quản Lý Hồ Sơ",
      path: "/admin/profile",
      icon: <ProfileOutlined />
    }
  ];

  const approverMenuItems = [
    {
      title: "Approver Dashboard",
      path: "/approver",
      icon: <HomeOutlined />
    },
    {
      title: "For my Vetting",
      path: "/approver/vetting",
      icon: <ProjectOutlined />
    },
    {
      title: "Claims History",
      path: "/approver/history",
      icon: <FileTextOutlined />
    }
  ];

  const claimerMenuItems = [
    {
      title: "Create Claim",
      path: "/claimer/create-claim",
      icon: <PlusOutlined />
    },
    {
      title: "Draft Claims",
      path: "/claimer/draft",
      icon: <FileTextOutlined />
    },
    {
      title: "Pending Claims",
      path: "/claimer/pending",
      icon: <FileTextOutlined />
    },
    {
      title: "Approved Claims",
      path: "/claimer/approved",
      icon: <FileTextOutlined />
    },
    {
      title: "Paid Claims",
      path: "/claimer/paid",
      icon: <FileTextOutlined />
    },
    {
      title: "Rejected Claims",
      path: "/claimer/rejected",
      icon: <FileTextOutlined />
    }
  ];

  const generalMenuItems = [
    {
      title: "Home",
      path: "/",
      icon: <HomeOutlined />
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <UserOutlined />
    }
  ];

  const renderAdminMenuItems = () => (
    <div className="space-y-1">
      {adminMenuItems.map((item, idx) =>
        !item.children ? (
          <Link
            key={idx}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-[#13C2C2] text-white font-medium shadow-sm'
                : 'text-gray-300 hover:bg-[#13C2C2]/50 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && <span>{item.title}</span>}
          </Link>
        ) : (
          <div key={idx}>
            <button
              onClick={() => setIsWarehouseOpen((open) => !open)}
              className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isWarehouseOpen ? 'bg-[#13C2C2] text-white' : 'text-gray-300 hover:bg-[#13C2C2]/50 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                {isOpen && <span>{item.title}</span>}
              </span>
              {isOpen && (isWarehouseOpen ? <DownOutlined /> : <RightOutlined />)}
            </button>
            {isWarehouseOpen && isOpen && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                {item.children.map((child, cidx) => (
                  <Link
                    key={cidx}
                    to={child.path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium ${
                      location.pathname === child.path
                        ? 'bg-white text-[#13C2C2] shadow'
                        : 'text-gray-300 hover:bg-white hover:text-[#13C2C2]'
                    }`}
                  >
                    <span className="text-xl">{child.icon}</span>
                    <span>{child.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );

  const renderMenuItems = (items) => (
    <div className="space-y-1">
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
            location.pathname === item.path
              ? 'bg-[#13C2C2] text-white font-medium shadow-sm'
              : 'text-gray-300 hover:bg-[#13C2C2]/50 hover:text-white'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          {isOpen && <span>{item.title}</span>}
        </Link>
      ))}
    </div>
  );

  const renderClaimsSection = () => (
    <div>
      <button
        onClick={() => setIsClaimsOpen(!isClaimsOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 ${
          isClaimsOpen ? 'bg-[#13C2C2] text-white' : 'text-gray-300 hover:bg-[#13C2C2]/50 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <FileTextOutlined className="text-xl" />
          {isOpen && <span className="font-medium">Claims</span>}
        </div>
        {isOpen && (
          isClaimsOpen ? 
            <DownOutlined className="text-xs opacity-60" /> : 
            <RightOutlined className="text-xs opacity-60" />
        )}
      </button>

      {isClaimsOpen && isOpen && (
        <div className="mt-2 ml-4">
          {renderMenuItems(claimsItems)}
        </div>
      )}
    </div>
  );

  const getMenuItems = () => {
    if (isFinance) {
      return (
        <>
          {renderMenuItems(financeMenuItems)}
          {renderClaimsSection()}
        </>
      );
    } else if (isAdmin) {
      return renderAdminMenuItems();
    } else if (isApprover) {
      return renderMenuItems(approverMenuItems);
    } else if (isClaimer) {
      return renderMenuItems(claimerMenuItems);
    } else {
      return renderMenuItems(generalMenuItems);
    }
  };

  return (
    <div className={`bg-[#1A202C] min-h-screen ${isOpen ? 'w-[260px]' : 'w-16'} fixed left-0 top-0 text-gray-200 z-50 transition-all duration-300`}>
      <div className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="text-xl font-bold mb-8 text-center tracking-wide border-b border-gray-700 pb-4 text-white">
          {isOpen && "Dashboard"}
        </div>

        {/* Main Menu */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Menu Items Container */}
          <div className="space-y-4">
            {getMenuItems()}
          </div>

          {/* Logout Section */}
          <div className="mt-auto pt-4">
            <div className="border-t border-gray-700"></div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-gray-300 hover:bg-[#13C2C2]/50 hover:text-white transition-all duration-200 mt-4"
            >
              <LogoutOutlined className="text-lg" />
              {isOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isFinance: PropTypes.bool,
  isAdmin: PropTypes.bool,
  isApprover: PropTypes.bool,
  isClaimer: PropTypes.bool,
  isOpen: PropTypes.bool
};

Sidebar.defaultProps = {
  isFinance: false,
  isAdmin: false,
  isApprover: false,
  isClaimer: false,
  isOpen: true
};

export default Sidebar;

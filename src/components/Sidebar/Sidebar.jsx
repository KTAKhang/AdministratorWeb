import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaChevronDown, FaChevronUp, FaUserCog, FaShoppingCart, FaSignOutAlt, FaCheckCircle, FaMoneyCheckAlt } from "react-icons/fa";
import { GoProjectRoadmap } from "react-icons/go";
import { HiUserGroup } from "react-icons/hi";
import { RiFileList2Line } from "react-icons/ri";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const Sidebar = ({ isFinance, isAdmin, isApprover, isClaimer, isOpen }) => {
  const [isClaimsOpen, setIsClaimsOpen] = useState(false);
  const location = useLocation();

  const toggleClaimsDropdown = () => {
    setIsClaimsOpen(!isClaimsOpen);
  };

  const financeMenuItems = [{ name: "Dashboard", path: "/finance", icon: <FaHome /> }];
  const claimsItems = [
    { name: "Approved", path: "/finance/approved", icon: <FaCheckCircle /> },
    { name: "Paid", path: "/finance/paid", icon: <FaMoneyCheckAlt /> },
  ];

  const generalMenuItems = isAdmin
    ? [
      { name: "Dashboard", path: "/admin", icon: <FaHome /> },
      { name: "Staff Management", path: "/admin/staff", icon: <HiUserGroup /> },
      { name: "Project Management", path: "/admin/project", icon: <GoProjectRoadmap /> },
    ]
    : isApprover
      ? [
        { name: "Approver Dashboard", path: "/approver", icon: <FaHome /> },
        { name: "For my Vetting", path: "/approver/vetting", icon: <GoProjectRoadmap /> },
        { name: "Claims History", path: "/approver/history", icon: <FaShoppingCart /> },
      ]
      : isClaimer
        ? [
          { name: "Create Claim", path: "/claimer/create-claim", icon: <HiOutlinePencilSquare /> },
          { name: "Draft Claims", path: "/claimer/draft", icon: <RiFileList2Line /> },
          { name: "Pending Claims", path: "/claimer/pending", icon: <RiFileList2Line /> },
          { name: "Approved Claims", path: "/claimer/approved", icon: <RiFileList2Line /> },
          { name: "Paid Claims", path: "/claimer/paid", icon: <RiFileList2Line /> },
          { name: "Rejected Claims", path: "/claimer/rejected", icon: <RiFileList2Line /> },
        ]
        : [
          { name: "Home", path: "/", icon: <FaHome /> },
          { name: "Orders", path: "/orders", icon: <FaShoppingCart /> },
          { name: "Profile", path: "/profile", icon: <FaUserCog /> },
        ];

  return (
    <div className={`h-screen sticky top-0  bg-white shadow-lg transition-all duration-300 ${isOpen ? "w-64" : "w-16 flex items-center"} flex flex-col justify-between`}>
      <ul className="space-y-2 flex-1 mt-4">
        {isFinance ? (
          <>
            {financeMenuItems.map((item, index) => (
              <li
                key={index}
                className={`p-2 rounded-md hover:shadow-lg ${location.pathname === item.path ? "bg-blue-100 border-r-4 border-blue-500" : ""}`}
              >
                <Link to={item.path} className="flex items-center space-x-3">
                  <span className="text-xl text-black">{item.icon}</span>
                  {isOpen && <span className="text-black">{item.name}</span>}
                </Link>
              </li>
            ))}

            <li className="p-2 rounded-md hover:shadow-lg">
              <button onClick={toggleClaimsDropdown} className="flex items-center w-full space-x-3 text-black">
                <span className="text-xl">{isClaimsOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
                {isOpen && <span className="text-black">Claims</span>}
              </button>
            </li>

            {isClaimsOpen &&
              claimsItems.map((item, index) => (
                <li
                  key={index}
                  className={`p-2 rounded-md hover:shadow-lg ${location.pathname === item.path ? "bg-blue-100 border-r-4 border-blue-500" : ""}`}
                >
                  <Link to={item.path} className="flex items-center space-x-3">
                    <span className="text-xl text-black">{item.icon}</span>
                    {isOpen && <span className="text-black">{item.name}</span>}
                  </Link>
                </li>
              ))}
          </>
        ) : (
          generalMenuItems.map((item, index) => (
            <li
              key={index}
              className={`p-2 rounded-md hover:shadow-lg ${location.pathname === item.path ? "bg-blue-100 border-r-4 border-blue-500" : ""}`}
            >
              <Link to={item.path} className="flex items-center space-x-3">
                <span className="text-xl text-black">{item.icon}</span>
                {isOpen && <span className="text-black">{item.name}</span>}
              </Link>
            </li>
          ))
        )}
      </ul>

      <div className="flex items-center justify-center mb-6">
        <Link to="/logout" className="flex items-center space-x-4 text-black px-3 py-2 hover:shadow-lg hover:border-r-4 hover:border-red-500 transition-all duration-200">
          <span className="text-xl">
            <FaSignOutAlt />
          </span>
          {isOpen && <span className="text-md text-black">Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

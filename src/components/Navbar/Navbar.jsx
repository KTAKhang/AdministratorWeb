import React, { useState } from "react";
import { RxTextAlignJustify } from "react-icons/rx";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import cat from '../../assets/img/cat.png';

const Navbar = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="w-full bg-white shadow-md">
      <div className="flex justify-between items-center p-4">
        {/* Left Section: Sidebar Toggle & Logo */}
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="text-3xl">
            <RxTextAlignJustify />
          </button>
          <button onClick={handleHome}>
            <img
              alt="FPT Software Logo"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/FPT_Software_logo.svg/512px-FPT_Software_logo.svg.png?20230121075219"
              decoding="async"
              className="w-28 h-10"
              srcSet="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/FPT_Software_logo.svg/768px-FPT_Software_logo.svg.png?20230121075219 1.5x, 
                      https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/FPT_Software_logo.svg/1024px-FPT_Software_logo.svg.png?20230121075219 2x"
            />
          </button>
        </div>

        {/* Center Section: Search Bar */}
        {/* <div className="flex items-center">
          <input
            type="text"
            className="w-[500px] h-[40px] border rounded-l-full focus:outline-none px-4"
            placeholder="Search"
          />
          <button className="h-[40px] bg-white border rounded-r-full flex items-center px-4">
            <FaMagnifyingGlass />
          </button>
        </div> */}

        {/* Right Section: User Info */}
        <div className="flex items-center space-x-4 relative">
          <span className="text-lg font-normal text-black">Hello User</span>
          <div className="w-15 h-15 rounded-full overflow-hidden cursor-pointer" onClick={toggleDropdown}>
            <img src={cat} alt="User Avatar" className="w-[50px] h-[50px] object-cover" />
          </div>
          {isDropdownOpen && (
            <div className="absolute top-4 right-0 mt-12 bg-white shadow-lg rounded-lg w-48">
              <Link to="/profile" className="block px-4 py-2 text-black hover:bg-gray-200">Profile Page</Link>
              <Link to="/change-password" className="block px-4 py-2 text-black hover:bg-gray-200">Change Password</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

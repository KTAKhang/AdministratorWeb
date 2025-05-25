import { useState, useMemo } from "react";
import { RxTextAlignJustify } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import cat from '../../assets/img/cat.png';
import { debounce } from "lodash";
import { useSidebar } from "../../contexts/SidebarContext";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  const debouncedToggleSidebar = useMemo(() => {
    return debounce(toggleSidebar, 300); // 300ms debounce time
  }, [toggleSidebar]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="w-full bg-[#0D364C] shadow-md">
      <div className="flex justify-between items-center p-4">
        {/* Left Section: Sidebar Toggle & Logo */}
        <div className="flex items-center space-x-4">
          <button onClick={debouncedToggleSidebar} className="text-3xl">
            <RxTextAlignJustify />
          </button>
          <button onClick={handleHome}>
            <img
              alt="Toy Shop Logo"
              src="https://images-platform.99static.com/1_9hhxdHPqAoIOKFOW0erbmIBtM=/0x2050:2000x4050/fit-in/99designs-contests-attachments/124/124456/attachment_124456078"
              decoding="async"
              className="w-28 h-10"
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
          <span className="text-lg font-normal text-white">Hello User</span>
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

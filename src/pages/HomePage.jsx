"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";

// Modal Component
function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md w-full"
            >
              Sign In
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
      </div>
    </div>
  );
}

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* <Sidebar className="w-[250px]" /> */}
      <div className="flex flex-col items-center justify-center flex-1">
        <img
          src="https://career.fpt-software.com/wp-content/uploads/2020/07/fville-hanoi.jpg"
          className="mx-auto block"
          alt="FPT Software Hanoi"
        />
        <button
          onClick={handleOpenModal}
          className="mt-6 px-6 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <span>Get Started</span>
        </button>
      </div>

      {/* Modal */}
      <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default HomePage;

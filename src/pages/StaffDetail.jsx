import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import profileImage from "../assets/img/profile.png";

const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [staffDetail, setStaffDetail] = useState(location.state?.staff || {});

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg border">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Staff Detailed Information
        </h2>
        <div className="text-sm text-gray-600 font-medium">Staff ID: {id}</div>
      </div>
      <div className="flex flex-wrap mt-4 gap-6">
        <div className="w-20 h-20 bg-gray-300 rounded-full">
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
          <InfoCard label="Name" value={staffDetail.name} />
          <InfoCard label="Rank" value={staffDetail.rank} />
          <InfoCard label="Department" value={staffDetail.department} />
          <InfoCard
            label="Total Working Hours"
            value={`${staffDetail.hours} hours`}
          />
          <InfoCard
            label="Salary (VND)"
            value={staffDetail.salary?.toLocaleString() || "N/A"}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">
            File Attachments/Supporting Documents
          </h3>
          <FileAttachment fileName="Contract.pdf" />
          <div className="flex flex-wrap gap-4 mt-4 py-[40px]">
            <ActionButton
              label="Exit"
              color="blue"
              onClick={() => navigate(-1)}
            />
            <ActionButton label="Update" color="green" />
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">
            Remarks
          </h3>
          <textarea
            className="w-full border p-2 rounded-lg min-h-[100px] sm:min-h-[130px] text-sm"
            placeholder="Enter your remarks..."
          />
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-700 font-semibold">{label}</p>
    <p className="text-base font-medium text-gray-900">{value || "N/A"}</p>
  </div>
);

const FileAttachment = ({ fileName }) => (
  <div className="flex items-center gap-2 border p-2 rounded-lg w-fit cursor-pointer bg-gray-100 px-4 py-2">
    <FaFileAlt className="text-blue-500" />
    <p className="text-sm text-blue-600 font-medium">{fileName}</p>
  </div>
);

const ActionButton = ({ label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium bg-${color}-400 text-indigo-900 opacity-90 hover:opacity-100 transition text-sm`}
  >
    {label}
  </button>
);

export default StaffDetail;

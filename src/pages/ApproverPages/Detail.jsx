import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import ApproverModal from "../../components/Modal/Modal";
import profileImage from "../../assets/img/profile.png";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState(location.state?.mode || "vetting");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    setMode(pathSegments.includes("history") ? "history" : "vetting");
  }, [location.pathname]);

  const claims = [
    { id: "0000000001", staff: "John Doe", project: "Android Tracker App", duration: "From 12/3/2024 To 18/6/2024", hours: 520, amount: "21,000,000 VND", status: "Pending Approval", file: "AndroidTracker.pdf", reason: "" },
    { id: "0000000002", staff: "Jane Doe", project: "Blockchain Contract Management", duration: "From 12/3/2024 To 18/6/2024", hours: 635, amount: "18,540,000 VND", status: "Pending Approval", file: "BlockChainContractManagement.pdf", reason: "" },
    { id: "0000000003", staff: "John Doe", project: "Bank Beacon App", duration: "From 12/3/2024 To 18/6/2024", hours: 420, amount: "12,000,000 VND", status: "Approved", file: "BankBeacon.pdf", reason: "The claim has been reviewed and all working hours are verified." },
    { id: "0000000004", staff: "John Doe", project: "Bank Beacon App", duration: "From 12/3/2024 To 18/6/2024", hours: 420, amount: "12,000,000 VND", status: "Paid", file: "BankBeacon.pdf", reason: "Payment has been processed successfully. The claim is now completed." },
  ];

  const claim = claims.find((c) => c.id === id);

  // Ensure only Vetting can open Pending, and History can open Approved/Paid
  if (!claim || (mode === "vetting" && claim.status !== "Pending Approval") || (mode === "history" && claim.status === "Pending Approval")) {
    return <div className="text-center text-red-500 font-bold">Claim Not Found</div>;
  }

  const handleOpenModal = (action) => {
    setSelectedAction(action);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    console.log(`${selectedAction} confirmed`);
    setIsModalOpen(false);
  };

  return (
    <div className="px-3 bg-white">
      <div className="text-gray-500 text-sm mb-4">
        Pages &gt; <span className="text-black font-semibold">{mode === "vetting" ? "Vetting" : "History"}</span> &gt; Claims Detail
      </div>

      <div className="p-4 rounded-md shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Claim Detailed Information</h1>
          <p className="text-gray-500 text-sm">Claim ID: {claim.id}</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md grid grid-cols-3 gap-6">
          <div className="flex justify-start items-start">
            <img src={profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
          </div>
          <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
            <InfoRow label="Staff Name" value={claim.staff} />
            <InfoRow label="Project Name" value={claim.project} />
            <InfoRow label="Project Duration" value={claim.duration} />
            <InfoRow label="Total Working Hours" value={`${claim.hours} hours`} />
            <InfoRow label="Total Claim Amount (in VND)" value={claim.amount} />
            <InfoRow label="Status" value={claim.status} status={claim.status} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="flex flex-col h-full">
            <p className="text-black font-bold text-sm mb-2">File Attachments/Supporting Documents</p>
            <div className="flex items-center bg-white border p-3 rounded-lg shadow-sm w-fit cursor-pointer hover:bg-gray-50">
              <FaFileAlt className="text-gray-500 mr-2" />
              <span className="text-blue-600 text-sm font-normal">{claim.file}</span>
            </div>
            <div className="mt-auto flex space-x-4">
              <ActionButton label="Exit" color="bg-blue-500" hover="hover:bg-blue-600" onClick={() => navigate(-1)} />
              {mode === "vetting" ? (
                <>
                  <ActionButton label="Approve" color="bg-green-500" hover="hover:bg-green-600" onClick={() => handleOpenModal("Approve")} />
                  <ActionButton label="Reject" color="bg-red-500" hover="hover:bg-red-600" onClick={() => handleOpenModal("Reject")} />
                  <ActionButton label="Return" color="bg-yellow-500" hover="hover:bg-yellow-600" onClick={() => handleOpenModal("Return")} />
                </>
              ) : (
                <ActionButton label="Delete" color="bg-red-500" hover="hover:bg-red-600" onClick={() => handleOpenModal("Delete")} />
              )}
            </div>
          </div>

          <div>
            <p className="text-black font-bold text-sm mb-2">Reasons</p>
            <textarea
              className="w-full border p-3 rounded-lg bg-white shadow-sm resize-none overflow-auto"
              rows="7"
              placeholder="Enter reasons..."
              readOnly={mode !== "vetting"}
              value={mode === "vetting" ? undefined : claim.reason || "No specific reason provided."}
            />
          </div>

        </div>
      </div>

      <ApproverModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirm} actionType={selectedAction} />
    </div>
  );
}

// Reusable Components
// eslint-disable-next-line react/prop-types
const InfoRow = ({ label, value, status }) => (
  <div>
    <p className="text-black font-bold text-sm">
      {label}
      {status && (
        <span
          className={`ml-1 inline-block w-2 h-2 rounded-full
            ${status === "Pending Approval" ? "bg-yellow-500" : "bg-green-500"}`}
        ></span>
      )}
    </p>
    <p className={`text-gray-600 ${label === "Status" ? "font-bold" : "font-normal"} 
      ${value === "Pending Approval" ? "text-yellow-500" : (value === "Approved" || value === "Paid") ? "text-green-500" : ""}`}>
      {value}
    </p>
  </div>
);

// eslint-disable-next-line react/prop-types
const ActionButton = ({ label, color, hover, onClick }) => (
  <button onClick={onClick} className={`px-6 py-2 rounded-lg font-semibold text-white shadow w-32 text-center ${color} ${hover}`}>
    {label}
  </button>
);

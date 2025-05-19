import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import profileImage from "../../assets/img/profile.png";
import FinanceModal from "./FinanceModal";

export default function FinanceDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Ưu tiên lấy mode từ location.state, sau đó kiểm tra URL params hoặc pathname
    const [mode, setMode] = useState(location.state?.mode || searchParams.get("mode") || "approved");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);

    useEffect(() => {
        console.log("Location State:", location.state);
        console.log("Search Params:", searchParams.get("mode"));

        if (location.state?.mode) {
            setMode(location.state.mode);
        } else if (searchParams.get("mode")) {
            setMode(searchParams.get("mode"));
        } else {
            const pathSegments = location.pathname.split("/");
            if (pathSegments.includes("approved")) {
                setMode("approved");
            } else if (pathSegments.includes("paid")) {
                setMode("paid");
            }
        }
    }, [location, searchParams]);

    const claims = [
        { id: "0000000001", staff: "John Doe", project: "Android Tracker App", duration: "From 12/3/2024 To 18/6/2024", hours: 520, amount: "21,000,000 VND", status: "Paid", file: "AndroidTracker.pdf", reason: "The claim has been reviewed and all working hours are verified." },
        { id: "0000000002", staff: "Jane Doe", project: "Blockchain Contract Management", duration: "From 12/3/2024 To 18/6/2024", hours: 635, amount: "18,540,000 VND", status: "Approved", file: "BlockChainContractManagement.pdf", reason: "The claim has been reviewed and all working hours are verified." },
        { id: "0000000003", staff: "John Doe", project: "Bank Beacon App", duration: "From 12/3/2024 To 18/6/2024", hours: 420, amount: "12,000,000 VND", status: "Approved", file: "BankBeacon.pdf", reason: "The claim has been reviewed and all working hours are verified." },
        { id: "0000000004", staff: "John Doe", project: "Bank Beacon App", duration: "From 12/3/2024 To 18/6/2024", hours: 420, amount: "12,000,000 VND", status: "Paid", file: "BankBeacon.pdf", reason: "Payment has been processed successfully. The claim is now completed." },
        { id: "0000000005", staff: "John Doe", project: "Bank Beacon App", duration: "From 12/3/2024 To 18/6/2024", hours: 420, amount: "12,000,000 VND", status: "Paid", file: "BankBeacon.pdf", reason: "The claim has been reviewed and all working hours are verified." },
    ];

    const filteredClaims = claims.filter((claim) => {
        if (mode === "approved") return claim.status === "Approved";
        if (mode === "paid")
            return claim.status === "Paid";
        return false;
    });

    const claim = filteredClaims.find((c) => c.id === id);

    if (!claim) {
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
            <div className="text-[#707EAE] text-sm mb-4">
                Pages &gt; <span className="text-[#707EAE] font-semibold">{claim.status}</span> &gt; Claims Detail
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
                        <ClaimInfoCard label="Staff Name" value={claim.staff} />
                        <ClaimInfoCard label="Project Name" value={claim.project} />
                        <ClaimInfoCard label="Project Duration" value={claim.duration} />
                        <ClaimInfoCard label="Total Working Hours" value={`${claim.hours} hours`} />
                        <ClaimInfoCard label="Total Claim Amount (in VND)" value={claim.amount} />
                        <ClaimInfoCard label="Status" value={claim.status} status />
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
                            <ActionButton label="Exit" color="blue" onClick={() => navigate(-1)} />
                            {mode === "approved" ? (
                                <ActionButton label="Paid" color="green" onClick={() => handleOpenModal("Paid")} />
                            ) : (
                                <ActionButton label="Download" color="green" onClick={() => handleOpenModal("Download")} />
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-black font-bold text-sm mb-2">Reasons</p>
                        <textarea
                            readOnly
                            value={claim.reason || "ko có"}
                            className="w-full border p-3 rounded-lg bg-white shadow-sm resize-none overflow-auto"
                            rows="7"
                        ></textarea>
                    </div>
                </div>
            </div>
            <FinanceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
                actionType={selectedAction}
            />
        </div>
    );
}

const ClaimInfoCard = ({ label, value, status }) => {
    const statusColors = { Approved: "text-green-500 font-bold  ", Paid: "text-green-500  font-bold " };
    return (
        <div>
            <p className="text-md font-semibold text-black font-bold">{label}</p>
            <p className={`text-md   ${status ? statusColors[value] || "text-gray-800" : "text-gray-800 "}`}>{value}</p>
        </div>
    );
};

// const FileAttachment = ({ fileName }) => (
//     <div className="flex items-center gap-2 border p-3 rounded-lg w-fit cursor-pointer bg-gray-100 px-5 py-2">
//         <FaFileAlt className="text-blue-500" />
//         <p className="text-sm text-blue-600">{fileName}</p>
//     </div>
// );

const ActionButton = ({ label, color, onClick }) => (
    <button onClick={onClick} className={`px-6 py-2 rounded-lg font-semibold bg-${color}-500 text-white opacity-90 hover:opacity-100 transition`}>
        {label}
    </button>
);





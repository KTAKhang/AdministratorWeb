import { useParams } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import profileImage from "../assets/img/profile.png";

const RejectedDetail = () => {
    const { id } = useParams();

    const claimDetail = {
        staffName: "Jane Doe",
        projectName: "Contract Management",
        projectDuration: "From 12/3/2024 To 18/6/2024",
        workingHours: 635,
        claimAmount: 18540000,
        status: "Rejected",
        statusColor: "text-red-500",
        fileName: "ContractManagement.pdf",
    };

    return (
        <div className="px-3 bg-white ">
            <div className="text-gray-500 text-sm mb-4">
                Pages &gt; <span className="text-black font-semibold">Pending</span> &gt; Claims Detail
            </div>
            <div className="p-4 rounded-md shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Claim Detailed Information</h1>
                    <p className="text-gray-500 text-sm">Claim ID: {id}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-md grid grid-cols-3 gap-6">
                    <div className="flex justify-start items-start">
                        <img src={profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
                    </div>
                    <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-black font-bold text-sm">Staff Name</p>
                            <p className="text-gray-600 font-normal">{claimDetail.staffName}</p>
                        </div>
                        <div>
                            <p className="text-black font-bold text-sm">Project Name</p>
                            <p className="text-gray-600 font-normal">{claimDetail.projectName}</p>
                        </div>
                        <div>
                            <p className="text-black font-bold text-sm">Project Duration</p>
                            <p className="text-gray-600 font-normal">{claimDetail.projectDuration}</p>
                        </div>
                        <div>
                            <p className="text-black font-bold text-sm">Total Working Hours</p>
                            <p className="text-gray-600 font-normal">{claimDetail.workingHours} hours</p>
                        </div>
                        <div>
                            <p className="text-black font-bold text-sm">Total Claim Amount (in VND)</p>
                            <p className="text-gray-600 font-normal">{claimDetail.claimAmount.toLocaleString()} VND</p>
                        </div>
                        <div>
                            <p className="text-black font-bold text-sm">
                                Status <span className={claimDetail.statusColor}>●</span>
                            </p>
                            <p className={`font-semibold ${claimDetail.statusColor}`}>{claimDetail.status}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-6">
                    <div className="flex flex-col h-full">
                        <p className="text-black font-bold text-sm mb-2">File Attachments/Supporting Documents</p>
                        <div className="flex items-center bg-white border p-3 rounded-lg shadow-sm w-fit cursor-pointer hover:bg-gray-50">
                            <FaFileAlt className="text-gray-500 mr-2" />
                            <span className="text-blue-600 text-sm font-normal">{claimDetail.fileName}</span>
                        </div>
                        <div className="mt-auto flex space-x-4">
                            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 w-32 text-center">
                                Exit
                            </button>

                        </div>
                    </div>
                    <div>
                        <p className="text-black font-bold text-sm mb-2">Reasons</p>
                        <textarea
                            className="w-full border p-3 rounded-lg bg-white shadow-sm resize-none overflow-auto"
                            rows="7"
                            placeholder="Enter reasons..."
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RejectedDetail;

import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import ClaimsTable from "../components/Table/ClaimsTable";

const PendingClaims = () => {
    const claims = [
        {
            id: "0000000001",
            staff: "John Doe",
            project: "Android Investment Tracker App",
            duration: "From 12/3/2024 To 18/6/2024",
            hours: 520,
            amount: "21,000,000",
            status: "Pending"
        },
        {
            id: "0000000002",
            staff: "Jane Doe",
            project: "Blockchain Contract Management",
            duration: "From 12/3/2024 To 18/6/2024",
            hours: 635,
            amount: "18,540,000",
            status: "Pending"
        },
        {
            id: "0000000003",
            staff: "John Doe",
            project: "Bank Beacon App",
            duration: "From 12/3/2024 To 18/6/2024",
            hours: 420,
            amount: "12,000,000",
            status: "Pending"
        }
    ];

    return (
        <div className="p-0 bg-white">
            <div className="mb-4 text-gray-600">Pages &gt; Pending</div>
            <ClaimsTable
                title="Summary of Pending Claims"
                claimsData={claims}
                filterCondition="Pending"
            />
        </div>
    );
};

export default PendingClaims;

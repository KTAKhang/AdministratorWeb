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
            status: "Draft"
        },
        {
            id: "0000000002",
            staff: "Jane Doe",
            project: "Blockchain Contract Management",
            duration: "From 12/3/2024 To 18/6/2024",
            hours: 635,
            amount: "18,540,000",
            status: "Draft"
        },
        {
            id: "0000000003",
            staff: "John Doe",
            project: "Bank Beacon App",
            duration: "From 12/3/2024 To 18/6/2024",
            hours: 420,
            amount: "12,000,000",
            status: "Draft"
        }
    ];

    const [sortField, setSortField] = useState("id");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const handleSort = (key) => {
        if (sortField === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(key);
            setSortOrder("asc");
        }
    };

    const sortedClaims = [...claims].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedClaims.length / itemsPerPage);
    const paginatedClaims = sortedClaims.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-0 bg-white">
            <div className="mb-4 text-gray-600">Pages &gt; Draft</div>
            <ClaimsTable
                title="Summary of Draft Claims"
                claimsData={claims}
                filterCondition="Draft"
            />
        </div>
    );
};

export default PendingClaims;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaSortUp, FaSortDown } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
export default function ClaimsTable({ title, claimsData, filterCondition }) {
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  const navigate = useNavigate();

  // Filtering claims based on status
  const filteredClaims =
    statusFilter === "All"
      ? claimsData
      : // eslint-disable-next-line react/prop-types
        claimsData.filter((claim) => claim.status === statusFilter);

  // Sorting function
  const sortedClaims = [...filteredClaims].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const key = sortConfig.key;
    if (a[key] < b[key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Handle sorting when clicking headers
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Pagination logic
  const totalPages = Math.ceil(sortedClaims.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClaims = sortedClaims.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const emptyRows = Array(itemsPerPage - paginatedClaims.length).fill(null);

  // Navigate to details with mode
  const handleViewDetail = (id) => {
    
    // const mode = filterCondition === "ClaimsHistory" ? "history" : "vetting";
    // const path =
    //   mode === "history"
    //     ? `/approver/history/${id}`
    //     : `/approver/vetting/${id}`;
    // navigate(path, { state: { mode } });

    let path;
    switch (filterCondition) {
      case "ClaimsHistory":
        path = `/approver/history/${id}`;
        navigate(path, { state: { mode: "history" } });
        break;
      
      case "ForMyVetting":
        path = `/approver/vetting/${id}`;
        navigate(path, { state: { mode: "vetting" } });
        break;
      
      case "Draft":
        path = `/claimer/draft/${id}`;
        navigate(path);
        break;
        
      case "Pending":
        path = `/claimer/pending/${id}`;
        navigate(path);
        break;
        
      case "Approved":
        path = `/claimer/approved/${id}`;
        navigate(path);
        break;
        
      case "Paid":
        path = `/claimer/paid/${id}`;
        navigate(path);
        break;
        
      case "Rejected":
        path = `/claimer/rejected/${id}`;
        navigate(path);
        break;
        
      default:
        path = `/approver/history/${id}`;
        navigate(path, { state: { mode: "history" } });
    }
  };

  return (
    <div className="px-2 min-h-screen flex flex-col items-center">
      <div className="w-full bg-white shadow-lg border rounded-xl p-8 overflow-hidden">
        {/* Header and Controls Row */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>

          {/* Status Filter & Pagination */}
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 w-32 text-sm border rounded-lg bg-white shadow-sm"
            >
              <option value="All">All</option>
              {filterCondition === "ClaimsHistory" && (
                <>
                  <option value="Approved">Approved</option>
                  <option value="Paid">Paid</option>
                </>
              )}
            </select>

            {/* Pagination Buttons */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 text-sm py-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full min-h-[420px]">
          <table className="w-full border-collapse text-gray-700 text-sm min-w-full table-fixed">
            <thead className="bg-gray-200 text-gray-600">
              <tr className="border-b">
                {[
                  // Column headers
                  { label: "Claim ID", key: "id" },
                  { label: "Staff Name", key: "staff" },
                  { label: "Project Name", key: "project" },
                  { label: "Project Duration", key: "duration" },
                  { label: "Total Working Hours", key: "hours" },
                  { label: "Total Claim Amount", key: "amount" },
                  { label: "Status", key: "" },
                  { label: "Action", key: "" },
                ].map(({ label, key }, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left font-medium whitespace-nowrap"
                  >
                    <div className="flex items-center cursor-pointer">
                      {label}
                      {/* Show sorting icon only for sortable columns */}
                      {key && (
                        <span className="ml-1" onClick={() => handleSort(key)}>
                          {sortConfig.key === key ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp className="inline-block text-blue-500" />
                            ) : (
                              <FaSortDown className="inline-block text-blue-500" />
                            )
                          ) : (
                            <FaSortDown className="inline-block text-gray-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedClaims.map((claim, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition min-h-[48px]"
                >
                  <td className="px-6 py-4">{claim.id}</td>
                  <td className="px-6 py-4">{claim.staff}</td>
                  <td className="px-6 py-4">{claim.project}</td>
                  <td className="px-6 py-4">{claim.duration}</td>
                  <td className="px-6 py-4">{claim.hours} hours</td>
                  <td className="px-6 py-4">{claim.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        claim.status === "Approved" || claim.status === "Paid"
                          ? "bg-green-200 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <FaEye
                      className="h-5 w-5 text-gray-500 cursor-pointer hover:text-blue-600 transition"
                      onClick={() => handleViewDetail(claim.id)}
                    />
                  </td>
                </tr>
              ))}
              {emptyRows.map((_, index) => (
                <tr key={`empty-${index}`} className="border-b min-h-[48px]">
                  <td colSpan="8" className="px-6 py-4">
                    &nbsp;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

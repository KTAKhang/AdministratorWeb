import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaSortUp, FaSortDown } from "react-icons/fa";
import projectData from "../pages/ProjectData";

const ProjectManagementTable = () => {
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const navigate = useNavigate();

  // Sorting function
  const sortedProjects = [...projectData].sort((a, b) => {
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
  const totalPages = Math.max(
    1,
    Math.ceil(sortedProjects.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = sortedProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const emptyRows = Array(itemsPerPage - paginatedProjects.length).fill(null);

  // Navigate to details
  const handleViewDetail = (id) => {
    navigate(`/project/detail/${id}`);
  };

  return (
    <div className="px-2 min-h-screen flex flex-col items-center">
      <div className="w-full bg-white shadow-lg border rounded-xl p-8 overflow-hidden">
        <div className="flex justify-between">
          <div className="flex justify-start items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Project Management
            </h3>
          </div>

          <div className="flex items-center justify-end space-x-2 mb-4">
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
              Page {currentPage} of {totalPages}
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
        <div className="overflow-x-auto w-full min-h-[420px]">
          <table className="w-full border-collapse text-gray-700 text-sm min-w-full table-fixed">
            <thead className="bg-gray-200 text-gray-600">
              <tr className="border-b">
                {[
                  "Project ID",
                  "technical Lead",
                  "Project Name",
                  "status",
                  "total Dev Hours",
                ].map((key, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 font-medium whitespace-nowrap cursor-pointer text-left"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center">
                      {key.toUpperCase()}
                      <span className="ml-1">
                        {sortConfig.key === key ? (
                          sortConfig.direction === "asc" ? (
                            <FaSortUp className="text-blue-500" />
                          ) : (
                            <FaSortDown className="text-blue-500" />
                          )
                        ) : (
                          <FaSortDown className="text-gray-400 opacity-50" />
                        )}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 font-medium whitespace-nowrap text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedProjects.map((project, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition min-h-[48px]"
                >
                  {Object.values(project).map((value, idx) => (
                    <td key={idx} className="px-6 py-4 text-left">
                      {value}
                    </td>
                  ))}
                  <td className="px-8 py-4 text-left">
                    <FaEye
                      className="h-5 w-5 text-gray-500 cursor-pointer hover:text-blue-600 transition"
                      onClick={() => handleViewDetail(project.id)}
                    />
                  </td>
                </tr>
              ))}
              {emptyRows.map((_, index) => (
                <tr key={`empty-${index}`} className="border-b min-h-[48px]">
                  <td colSpan="6" className="px-6 py-4">
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
};

export default ProjectManagementTable;

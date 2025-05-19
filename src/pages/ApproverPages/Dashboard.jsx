import { FaClipboardCheck, FaClock, FaMoneyCheckAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // Sample claim data (to be replaced with API data)
  const pendingClaims = [
    { id: "0000000001", name: "John Doe", amount: "500,000 VND", date: "Feb 20, 2025" },
    { id: "0000000002", name: "Jane Smith", amount: "750,000 VND", date: "Feb 21, 2025" },
    { id: "0000000003", name: "Michael Brown", amount: "300,000 VND", date: "Feb 22, 2025" },
  ];

  return (
    <div className="p-6 min-h-screen">
      {/* Welcome Message */}
      <div className="text-3xl text-center font-bold text-gray-800 mb-6">
        Welcome, Approver!
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        {[
          { icon: <FaClipboardCheck className="text-blue-600 text-4xl" />, label: "Total Claims", value: "145" },
          { icon: <FaClock className="text-yellow-500 text-4xl" />, label: "Pending Approvals", value: "23" },
          { icon: <FaMoneyCheckAlt className="text-green-600 text-4xl" />, label: "Total Approved", value: "12,400,000 VND" }
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 shadow-lg rounded-xl flex items-center space-x-4 border hover:shadow-xl transition"
          >
            {stat.icon}
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Approvals Section */}
      <div className="mt-8 bg-white p-6 shadow-lg rounded-xl border">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Pending Approvals</h3>
        
        {/* No pending claims message */}
        {pendingClaims.length === 0 ? (
          <p className="text-gray-500 text-center">No pending approvals at the moment.</p>
        ) : (
          <div className="space-y-4">
            {pendingClaims.map((claim) => (
              <div
                key={claim.id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm border hover:bg-gray-100 transition"
              >
                <div>
                  <p className="text-gray-800 font-medium">{claim.name}</p>
                  <p className="text-sm text-gray-500">Claim Amount: {claim.amount}</p>
                  <p className="text-xs text-gray-400">Submitted: {claim.date}</p>
                </div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                  onClick={() => navigate(`/approver/vetting/${claim.id}`)}
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import ClaimsTable from "../components/Table/ClaimsTable";

export default function RejectedClaims() {
  const claims = [
    {
      id: "0000000001",
      staff: "John Doe",
      project: "Android Investment Tracker App",
      duration: "From 12/3/2024 To 18/6/2024",
      hours: 520,
      amount: "21,000,000",
      status: "Rejected"
    },
    {
      id: "0000000002",
      staff: "Jane Doe",
      project: "Blockchain Contract Management",
      duration: "From 12/3/2024 To 18/6/2024",
      hours: 635,
      amount: "18,540,000",
      status: "Rejected"
    },
    {
      id: "0000000003",
      staff: "John Doe",
      project: "Bank Beacon App",
      duration: "From 12/3/2024 To 18/6/2024",
      hours: 420,
      amount: "12,000,000",
      status: "Rejected"
    }
  ];

  return (
    <div className="p-0 bg-white">
      <div className="mb-4 text-gray-600">Pages &gt; Rejected</div>
      <ClaimsTable
        title="Summary of Rejected Claims"
        claimsData={claims}
        filterCondition="Rejected"
      />
    </div>
  );
} 
import ClaimsTable from "../../components/Table/ClaimsTable";

export default function ForMyVetting() {
  const claims = [
    {
      id: "0000000001",
      staff: "John Doe",
      project: "Investment App",
      duration: "From 12/3/2024 To 18/6/2024",
      hours: 520,
      amount: "21,000,000",
      status: "Pending",
    },
    {
      id: "0000000002",
      staff: "Jane Doe",
      project: "Contract Management",
      duration: "From 12/3/2024 To 18/6/2024",
      hours: 635,
      amount: "18,540,000",
      status: "Pending",
    },
    ...Array(18).fill({
      id: "0000000005",
      staff: "John Doe",
      project: "Bank Beacon App",
      duration: "From 12/3/2024 To 18/6/2024",
      hours: 420,
      amount: "12,000,000",
      status: "Pending",
    }),
  ];

  return (
    <ClaimsTable
      title="Summary of Claims for Approval"
      claimsData={claims}
      filterCondition="ForMyVetting"
    />
  );
}

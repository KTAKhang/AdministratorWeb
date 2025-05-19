const projectData = [
  {
    id: "P001",
    technicalLead: "Nguyen Van A",
    name: "Investment App",
    status: "Ongoing",
    totalDevHours: 520,
  },
  {
    id: "P002",
    technicalLead: "Tran Thi B",
    name: "Contract Management",
    status: "Completed",
    totalDevHours: 635,
  },
  {
    id: "P003",
    technicalLead: "Le Van C",
    name: "E-commerce Platform",
    status: "Pending",
    totalDevHours: 420,
  },
  {
    id: "P004",
    technicalLead: "Pham Thi D",
    name: "AI Chatbot",
    status: "Ongoing",
    totalDevHours: 680,
  },
  {
    id: "P005",
    technicalLead: "Hoang Van E",
    name: "CRM System",
    status: "Completed",
    totalDevHours: 490,
  },
  ...Array(10).fill({
    id: "P999",
    technicalLead: "John Doe",
    name: "Placeholder Project",
    status: "Pending",
    totalDevHours: 400,
  }),
];

export default projectData;

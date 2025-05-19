import { useState } from "react";

export default function CreateClaim() {
    const [form, setForm] = useState({
        staffName: "",
        projectName: "",
        dateFrom: "",
        timeFrom: "09:00",
        dateTo: "",
        timeTo: "09:00",
        totalHours: "564 Hours",
        claimAmount: "18,000,000 VND",
        reason: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="py-0 px-6 w-full">
            <p className="text-gray-500 mb-2">Pages &gt; Create Claim</p>
            <h2 className="text-2xl font-semibold mb-4 mt-4">Create Claim</h2>
            <div className="grid grid-cols-2 gap-6">
                {[
                    { label: "Staff name", name: "staffName", type: "text", required: true },
                    { label: "Project name", name: "projectName", type: "text", required: true },
                    { label: "Date from", name: "dateFrom", type: "date", required: true, style: { textTransform: 'uppercase' } },
                    { label: "Time from", name: "timeFrom", type: "time", required: true },
                    { label: "Date to", name: "dateTo", type: "date", required: true, style: { textTransform: 'uppercase' } },
                    { label: "Time to", name: "timeTo", type: "time", required: true },
                    { label: "Total working hours", name: "totalHours", type: "text", required: true },
                    { label: "Total Claim Amount", name: "claimAmount", type: "text", required: true },
                ].map(({ label, name, type, required }) => (
                    <div key={name} className="grid grid-cols-[200px_1fr] items-center gap-4">
                        <label className="font-bold whitespace-nowrap min-w-[200px]">
                            {label} {required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type={type}
                            name={name}
                            value={form[name]}
                            onChange={handleChange}
                            className="border rounded p-3 w-full h-12"
                        />
                    </div>
                ))}
                <div className="col-span-2">
                    <label className="block font-bold">Reason for refund <span className="text-red-500">*</span></label>
                    <textarea name="reason" value={form.reason} onChange={handleChange} className="w-full border rounded p-3 h-32"></textarea>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 w-32 text-center">
                    SAVE
                </button>
                <button className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 w-32 text-center">
                    SUBMIT
                </button>
                <button className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 w-32 text-center">
                    CANCEL
                </button>
            </div>
        </div>
    );
}

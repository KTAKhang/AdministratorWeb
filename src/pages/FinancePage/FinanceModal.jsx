// eslint-disable-next-line react/prop-types
export default function FinanceModal({ isOpen, onClose, onConfirm, actionType }) {

    if (!isOpen) return null;

    const actionMessages = {
        Download: "download this claim",
        Paid: "paid this claim",
    };

    const colors = {
        Download: "bg-green-400",
        Paid: "bg-green-400",
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                {/* Icon */}
                <div className="text-blue-900 text-5xl mb-2">ℹ️</div>
                <h2 className="text-lg font-bold text-blue-900">CONFIRMATION</h2>
                <p className="mt-2 text-gray-700">
                    Are you sure you want to <b>{actionMessages[actionType]}?</b>
                    <br />
                    This action cannot be undone.
                </p>

                {/* Buttons */}
                <div className="mt-4 flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className={`px-6 py-2 rounded-lg text-white font-semibold ${colors[actionType]}`}
                    >
                        Yes
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-red-200 text-red-600 font-semibold"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}
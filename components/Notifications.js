"use client";

import { useUI } from "@/context/UIContext";

export default function Notifications() {
    const { notifications, removeNotification } = useUI();

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
                        notification.type === "success"
                            ? "bg-green-600"
                            : notification.type === "error"
                            ? "bg-red-600"
                            : "bg-magic-blue"
                    }`}
                >
                    <span>{notification.message}</span>
                    <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-white hover:text-gray-200"
                    >
                        ×
                    </button>
                </div>
            ))}

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

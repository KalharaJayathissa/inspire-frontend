import React from "react";
import { ToastSystemProps } from "./types";

export const ToastSystem: React.FC<ToastSystemProps> = ({
  toasts,
  onRemoveToast,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md
            transform transition-all duration-300 ease-in-out
            ${
              toast.type === "success"
                ? "bg-green-500 text-white dark:bg-green-600"
                : toast.type === "error"
                ? "bg-red-500 text-white dark:bg-red-600"
                : "bg-blue-500 text-white dark:bg-blue-600"
            }
          `}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => onRemoveToast(toast.id)}
              className="ml-2 text-white hover:text-gray-200 transition-colors"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
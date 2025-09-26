import React from "react";
import { NicNotFoundModalProps } from "./types";

const NicNotFoundModal: React.FC<NicNotFoundModalProps> = ({
  isOpen,
  onClose,
  onTryAgain,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 max-w-md mx-auto border border-white/20 dark:border-gray-700/50 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="text-4xl">❌</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            NIC Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The NIC number you entered is not found in our records. Please check
            your NIC number or register first.
          </p>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onTryAgain}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/register")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NicNotFoundModal;

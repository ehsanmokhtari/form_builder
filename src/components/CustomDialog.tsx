import React, { useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface CustomDialogProps {
  isOpen: boolean;
  type?: "modal" | "toast"; // New prop to specify type
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left"; // Toast position
  autoCloseDuration?: number; // Auto-close duration for toast
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void; // Required for toast dismissal
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  isOpen,
  type = "modal",
  position = "bottom-left",
  autoCloseDuration,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const handleClose = () => onCancel?.();

  const getPositionStyles = (position: string) => {
    // For RTL layout, swap left and right positions
    if (language === "fa") {
      switch (position) {
        case "top-right":
          return "top-4 left-4";
        case "top-left":
          return "top-4 right-4";
        case "bottom-left":
          return "bottom-4 right-4";
        default:
          return "bottom-4 left-4";
      }
    } else {
      switch (position) {
        case "top-right":
          return "top-4 right-4";
        case "top-left":
          return "top-4 left-4";
        case "bottom-left":
          return "bottom-4 left-4";
        default:
          return "bottom-4 right-4";
      }
    }
  };

  useEffect(() => {
    if (type === "toast" && autoCloseDuration && onCancel) {
      const timer = setTimeout(() => {
        onCancel();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [type, autoCloseDuration, onCancel]);

  if (type === "modal") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
          <h2 className="text-lg font-bold mb-4">{title}</h2>
          <p className="mb-6 whitespace-pre-line line-clamp-5 overflow-y-auto">
            {message}
          </p>
          <div className="flex justify-end gap-4">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                {t("cancel")}
              </button>
            )}
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              {t("confirm")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Toast implementation
  const positionStyles = getPositionStyles(position);
  const containerClasses = `fixed ${positionStyles} p-4 z-50`;

  return (
    <div className={containerClasses}>
      <div className="bg-white rounded shadow p-4 flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CustomDialog;

import React, { useEffect } from "react";

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
  if (!isOpen) return null;

  const handleClose = () => onCancel?.();

  const getPositionStyles = (position: string) => {
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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
          <h2 className="text-lg font-bold mb-4">{title}</h2>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end gap-4">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Confirm
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
      <div className="bg-white rounded shadow p-4 flex items-start space-x-4">
        <div>
          <h3 className="text-sm font-medium mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        {onConfirm && (
          <button
            onClick={onConfirm}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Confirm
          </button>
        )}
        <button
          onClick={handleClose}
          className="ml-auto text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default CustomDialog;

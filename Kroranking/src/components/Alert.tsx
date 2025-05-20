import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <div className="alert-message">{message}</div>
        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="alert-close"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Alert;

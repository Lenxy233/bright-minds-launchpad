
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface PurchaseNotificationProps {
  onClose: () => void;
}

const PurchaseNotification = ({ onClose }: PurchaseNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const customerNames = [
    "Sarah M.", "John D.", "Emma L.", "Michael R.", "Lisa K.", 
    "David W.", "Jennifer P.", "Mark T.", "Ashley H.", "Ryan C.",
    "Maria G.", "Chris B.", "Amanda S.", "Kevin J.", "Nicole F."
  ];

  const getRandomCustomer = () => {
    return customerNames[Math.floor(Math.random() * customerNames.length)];
  };

  const getRandomHours = () => {
    return Math.floor(Math.random() * 6) + 1; // 1-6 hours ago
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={`fixed bottom-4 left-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className="bg-white/95 backdrop-blur-sm border-2 border-green-300 rounded-2xl p-4 shadow-xl max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                🎉 {getRandomCustomer()} just purchased!
              </p>
              <p className="text-xs text-gray-600">
                Bright Minds Academy Bundle • {getRandomHours()} hours ago
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseNotification;

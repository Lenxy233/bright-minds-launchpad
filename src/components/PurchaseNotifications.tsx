
import { useState, useEffect } from "react";
import PurchaseNotification from "./PurchaseNotification";

const PurchaseNotifications = () => {
  const [notifications, setNotifications] = useState<{ id: number }[]>([]);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    // Show first notification after 5 seconds
    const initialTimer = setTimeout(() => {
      showNotification();
    }, 5000);

    // Then show notifications every 15-25 seconds
    const intervalTimer = setInterval(() => {
      showNotification();
    }, Math.random() * 10000 + 15000); // Random between 15-25 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const showNotification = () => {
    const newNotification = { id: nextId };
    setNotifications(prev => [...prev, newNotification]);
    setNextId(prev => prev + 1);

    // Auto-remove after 8 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 8000);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ bottom: `${16 + index * 80}px` }}
          className="fixed left-4"
        >
          <PurchaseNotification
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </>
  );
};

export default PurchaseNotifications;

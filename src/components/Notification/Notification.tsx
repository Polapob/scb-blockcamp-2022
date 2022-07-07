import { Notification as MantineNotification } from "@mantine/core";
import { ReactNode, useEffect } from "react";
import { Check, X } from "tabler-icons-react";
import { useNotification } from "../../context/NotificationContext";

export type NotificationResultTypes = "success" | "failure";

interface INotificationProps {
  title: string;
  type: NotificationResultTypes;
  duration: number;
  children?: ReactNode;
}

const Notification = ({ title, type, duration, children }: INotificationProps) => {
  const { removeNotification } = useNotification();
  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(title, type, duration);
    }, duration * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [title, type, duration, removeNotification]);
  return (
    <MantineNotification
      icon={type === "success" ? <Check size={18} /> : <X size={18} />}
      color={type === "success" ? "teal" : "red"}
      title={title}
      onClick={() => {
        removeNotification(title, type, duration);
      }}
      sx={{
        position: "fixed",
        top: "5rem",
        right: "20px",
        zIndex: 50,
        minWidth: "300px",
      }}
    >
      {children}
    </MantineNotification>
  );
};

export default Notification;

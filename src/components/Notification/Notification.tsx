import { Notification as MantineNotification } from "@mantine/core";
import { ReactNode, useEffect, useRef } from "react";
import { Check, X } from "tabler-icons-react";
import { useNotification } from "../../context/NotificationContext";
import { Transition } from "@mantine/core";
import debounce from "lodash.debounce";
import { DebouncedFunc } from "lodash";
export type NotificationResultTypes = "success" | "failure";

interface INotificationProps {
  title: string;
  type: NotificationResultTypes;
  duration: number;
  children?: ReactNode;
}

const Notification = ({ title, type, duration, children }: INotificationProps) => {
  const notificationRef = useRef<HTMLDivElement>(null);
  const { removeNotification } = useNotification();
  useEffect(() => {
    let debounceFn: DebouncedFunc<() => void>;
    const timer = setTimeout(() => {
      if (notificationRef.current) {
        notificationRef.current.className = `${notificationRef.current.className} notification-hide-transition`;
      }
      debounceFn = debounce(() => {
        removeNotification(title, type, duration);
      }, 1000);
      debounceFn();
    }, duration * 1000);
    return () => {
      clearTimeout(timer);
      if (debounceFn) {
        console.log("check3");
        debounceFn.cancel();
      }
    };
  }, [title, type, duration, removeNotification]);

  return (
    <MantineNotification
      ref={notificationRef}
      className="notification-transition"
      icon={type === "success" ? <Check size={18} /> : <X size={18} />}
      color={type === "success" ? "teal" : "red"}
      title={title}
      onClick={() => {
        if (notificationRef.current) {
          notificationRef.current.className = `${notificationRef.current.className} notification-hide-transition`;
        }
        debounce(() => {
          removeNotification(title, type, duration);
        }, 1000);
      }}
      sx={{
        position: "fixed",
        top: "5rem",
        right: "4rem",
        zIndex: 50,
        minWidth: "300px",
      }}
    >
      {children}
    </MantineNotification>
  );
};

export default Notification;

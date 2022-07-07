import { createContext, ReactNode, useContext, useState } from "react";
import { NotificationResultTypes } from "../components/Notification/Notification";
import Notification from "../components/Notification/Notification";

type NotificationTypes = {
  title: string;
  type: NotificationResultTypes;
  duration: number;
};

interface INotificationContext {
  notifications: NotificationTypes[];
  addNotification: (title: string, type: NotificationResultTypes, duration: number) => void;
  removeNotification: (title: string, type: NotificationResultTypes, duration: number) => void;
}

export const NotificationContext = createContext<INotificationContext>({
  notifications: [] as NotificationTypes[],
  addNotification: (title: string, type: NotificationResultTypes, duration: number) => {},
  removeNotification: (title: string, type: NotificationResultTypes, duration: number) => {},
});

interface INotificationProviderInterface {
  children: ReactNode;
}

const NotificationProvider = ({ children }: INotificationProviderInterface) => {
  const [notifications, setNotifications] = useState<NotificationTypes[]>([]);
  const addNotification = (title: string, type: NotificationResultTypes, duration: number) => {
    setNotifications((prevNotification) => [...prevNotification, { title, type, duration }]);
  };
  const removeNotification = (title: string, type: NotificationResultTypes, duration: number) => {
    let isFind: boolean;
    setNotifications((prevNotification) =>
      prevNotification.filter((eachNotification) => {
        if (isFind) {
          return true;
        }
        if (JSON.stringify(eachNotification) === JSON.stringify({ title, type, duration })) {
          console.log("pass-this!");
          return false;
        }
        return true;
      })
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {notifications.map(({ title, type, duration }, index) => (
        <Notification key={index} title={title} type={type} duration={duration} />
      ))}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  return context;
};

export default NotificationProvider;

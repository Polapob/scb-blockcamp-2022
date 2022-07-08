import { NotificationResultTypes } from "../components/Notification/Notification";

const handleNotificationFromResponse = async (
  response: any,
  addNotification: (title: string, type: NotificationResultTypes, duration: number) => void,
  successText: string
) => {
  if (response.wait) {
    await response.wait();
    addNotification(successText, "success", 5);
    return;
  }

  if (response?.error?.data?.message) {
    addNotification(response.error.data.message, "failure", 5);
    return;
  }

  if (response?.message) {
    addNotification(response.message, "failure", 5);
    return;
  }
};

export default handleNotificationFromResponse;

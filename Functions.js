import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Picker,
  AsyncStorage,
  Button
} from "react-native";
import { PushNotificationIOS } from "./App";
export const _storeData = async data => {
  try {
    data = JSON.stringify(data);
    await AsyncStorage.setItem("CalendarAlarm", data);
  } catch (error) {
    // Error saving data
  }
};

export const _retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem("CalendarAlarm");
    if (value !== null) {
      // We have data!!
      console.log("data", value);
      return JSON.parse(value);
    }
  } catch (error) {
    // Error retrieving data
  }
};
export const formatHourMinute = number => {
  if (number.length == 1) {
    return "0" + number;
  }
  return number;
};

export const stopNotification = clickedNotification => {
  PushNotificationIOS.getDeliveredNotifications(notifications => {
    const ids = notifications.map(elem => elem.identifier);
    PushNotificationIOS.removeDeliveredNotifications([...ids.slice(1)]);
    PushNotificationIOS.cancelLocalNotifications(clickedNotification._data);
  });
};

export const deleteNotification = async (key, value) => {
  PushNotificationIOS.cancelLocalNotifications(value);
  try {
    const data = await _retrieveData();
    delete data[key];
    await _storeData(data);
  } catch (err) {}
};

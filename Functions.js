import {
  Platform,
  StyleSheet,
  Text,
  View,
  PushNotificationIOS,
  TouchableOpacity,
  TextInput,
  Picker,
  AsyncStorage,
  Button
} from "react-native";

export const _storeData = async data => {
  try {
    await AsyncStorage.setItem("CalendarAlarm", data);
    console.log("store data was run");
  } catch (error) {
    // Error saving data
  }
};

export const _retrieveData = async () => {
  try {
    console.log("inside retrieve data");
    const value = await AsyncStorage.getItem("CalendarAlarm");
    if (value !== null) {
      // We have data!!
      console.log("data", value);
      return value;
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

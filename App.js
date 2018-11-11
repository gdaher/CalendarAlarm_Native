/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
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
import { Calendar, CalendarList, Agenda } from "react-native-calendars";

// import BackgroundTask from "react-native-background-task";
// import queueFactory from "react-native-queue";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

//REQUEST PERMISSION TO USE PUSH NOTIFICATIONS
PushNotificationIOS.requestPermissions();

// //ADD EVENT LISTENER CALLBACK FOR WHEN NOTIFICATION IS DELIVERED- this doesn't work unless the applicaiton is running.
// PushNotificationIOS.addEventListener("localNotification", eventCallback);
// let alerts = 0;

const userInfo2 = { alert: "alert2" };

//CANCEL FIRST NOTIFICATION

// while (alerts < 10) {
//   setTimeout(() => {
//     PushNotificationIOS.presentLocalNotification({
//       alertBody: "hello I am alertBody"
//     });
//     alerts++;
//   }, interval);
// }

_storeData = async data => {
  try {
    await AsyncStorage.setItem("CalendarAlarm", data);
    console.log("store data was run");
  } catch (error) {
    // Error saving data
  }
};

_retrieveData = async key => {
  try {
    console.log("inside retrieve data");
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      console.log("data", value);
      return value;
    }
  } catch (error) {
    // Error retrieving data
  }
};

_storeData("{}");

type Props = {};
export default class App extends Component<Props> {
  constructor() {
    super();

    //I had to put month/day/year etc. directly onto state in stead of an object. If you put them
    //inside a larger object, you cannot change a picker without the others resetting.
    this.state = {
      title: "",
      month: "1",
      day: "1",
      year: "2017",
      hour: "1",
      minute: "0",
      AmPm: "AM"
    };
  }
  stop = () => {
    PushNotificationIOS.getDeliveredNotifications(notifications => {
      const ids = notifications.map(elem => elem.identifier);
      PushNotificationIOS.removeDeliveredNotifications([...ids.slice(1)]);
      console.log("notifications will mount", notifications);
      if (notifications.length > 0) {
        PushNotificationIOS.cancelLocalNotifications(notifications[0].userInfo);
      }
    });
  };
  submit = async () => {
    PushNotificationIOS.scheduleLocalNotification({
      fireDate: Date.now() + 60000,
      alertBody: "hello I am alertBody #2",
      repeatInterval: "minute",
      userInfo: userInfo2
    });
    let data = await _retrieveData("CalendarAlarm");
    // prettier-ignore
    const key = `${this.state.month}-${this.state.day}-${this.state.year}-${this.state.hour}-${this.state.minute}}`;

    const dataSubmission = JSON.parse(data);
    dataSubmission[key] = this.state;
    console.log("dataSubmission", dataSubmission);
    const stringDataSubmission = JSON.stringify(dataSubmission);
    await _storeData(stringDataSubmission);
    let val = await _retrieveData("CalendarAlarm");
    //SCHEDULE  SECOND NOTIFICATION TO REPEAT
  };
  render() {
    return (
      // <View style={styles.container}>
      //   <Text style={styles.welcome}>Welcome to React Native!</Text>
      //   <Text style={styles.instructions}>To get started, edit App.js</Text>
      //   <Text style={styles.instructions}>{instructions}</Text>
      // </View>
      <View style={styles.container}>
        <View style={styles.picker} key={1}>
          <Text>Title:</Text>
          <TextInput
            style={{
              height: 50,
              width: 200,
              borderColor: "gray",
              borderWidth: 1
            }}
          />
        </View>
        <View style={styles.picker} key={2}>
          <Text>Month:</Text>
          <Picker
            selectedValue={this.state.month}
            itemStyle={{ height: 100, width: 50 }}
            style={{
              height: 100,
              width: 50,
              padding: 5,
              margins: 0
            }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ month: itemValue })
            }
          >
            {Array(12)
              .fill()
              .map((elem, idx) => idx + 1)
              .map(number => {
                return (
                  <Picker.Item
                    key={number}
                    label={"" + number}
                    value={"" + number}
                  />
                );
              })}
          </Picker>
        </View>
        <View style={styles.picker} key={3}>
          <Text>Day:</Text>
          <Picker
            selectedValue={this.state.day}
            itemStyle={{ height: 100, width: 50 }}
            style={{
              height: 100,
              width: 50,
              padding: 5,
              margins: 0
            }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ day: itemValue })
            }
          >
            {Array(31)
              .fill()
              .map((elem, idx) => idx + 1)
              .map(number => {
                return <Picker.Item label={"" + number} value={"" + number} />;
              })}
          </Picker>
        </View>
        <View style={styles.picker} key={4}>
          <Text> Year: </Text>
          <Picker
            selectedValue={this.state.year}
            itemStyle={{ height: 100, width: 80 }}
            style={{
              height: 100,
              width: 80,
              padding: 5,
              margins: 0
            }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ year: itemValue })
            }
          >
            {Array(30)
              .fill(new Date().getFullYear() - 1)
              .map((elem, idx) => idx + elem)
              .map(number => {
                return <Picker.Item label={"" + number} value={"" + number} />;
              })}
          </Picker>
        </View>
        <View style={styles.picker} key={5}>
          <Text> Time: </Text>
          <Picker
            selectedValue={this.state.hour}
            itemStyle={{ height: 100, width: 80 }}
            style={{
              height: 100,
              width: 80,
              padding: 5,
              margins: 0
            }}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ hour: itemValue + "" });
            }}
          >
            {Array(12)
              .fill()
              .map((elem, idx) => idx + 1)
              .map(number => {
                return (
                  <Picker.Item
                    key={number}
                    label={"" + number}
                    value={"" + number}
                  />
                );
              })}
          </Picker>
          <Text> : </Text>
          <Picker
            selectedValue={this.state.minute}
            itemStyle={{ height: 100, width: 80 }}
            style={{
              height: 100,
              width: 80,
              padding: 5,
              margins: 0
            }}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ minute: itemValue });
              console.log(
                "minutes",
                this.state.minute,
                "itemValue",
                itemValue,
                this.state.AmPm
              );
            }}
          >
            {Array(12)
              .fill()
              .map((elem, idx) => idx * 5)
              .map(number => {
                return <Picker.Item label={"" + number} value={"" + number} />;
              })}
          </Picker>
          <Picker
            selectedValue={this.state.AmPm}
            itemStyle={{ height: 100, width: 80 }}
            style={{
              height: 100,
              width: 80,
              padding: 5,
              margins: 0
            }}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ AmPm: itemValue });
            }}
          >
            <Picker.Item label="AM" value="AM" />
            <Picker.Item label="PM" value="PM" />
          </Picker>
        </View>
        <Button onPress={this.submit} title="Remind Me" color="#841584" />
        <Button onPress={this.stop} title="Stop Reminding Me" color="#841584" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F5FCFF",
    padding: 20
  },
  picker: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

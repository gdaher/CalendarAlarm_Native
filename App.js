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
import { _storeData, _retrieveData, formatHourMinute } from "./Functions";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

//REQUEST PERMISSION TO USE PUSH NOTIFICATIONS
PushNotificationIOS.requestPermissions();

// //ADD EVENT LISTENER CALLBACK FOR WHEN NOTIFICATION IS DELIVERED- this doesn't work unless the application is running. Could potentially be used to cancel notifications.
// PushNotificationIOS.addEventListener("localNotification", eventCallback);
// let alerts = 0;

//initialize data local data store for our app to an object, if nothing has been stored yer
if (!_retrieveData()) {
  _storeData("{}");
}

type Props = {};
export default class App extends Component<Props> {
  constructor() {
    super();

    //I had to put month/day/year etc. directly onto state in stead of an object. If you put them
    //inside a larger object, you cannot change a picker without the others resetting.
    this.state = {
      title: "An event",
      month: "1",
      day: "1",
      year: "2017",
      hour: "01",
      minute: "00",
      AmPm: "AM"
    };
  }
  stop = () => {
    console.log("reminders should stop");
    PushNotificationIOS.getDeliveredNotifications(notifications => {
      const ids = notifications.map(elem => elem.identifier);
      PushNotificationIOS.removeDeliveredNotifications([...ids.slice(1)]);
      if (notifications.length > 0) {
        PushNotificationIOS.cancelLocalNotifications(notifications[0].userInfo);
      }
    });
  };
  submit = async () => {
    //convert to military time
    let militaryHour = this.state.hour;

    if (this.state.AmPm === "PM") {
      const numHour = parseInt(this.state.hour) + 12;
      militaryHour = numHour.toString();
    }

    //make key
    // prettier-ignore
    const key = `${this.state.year}-${this.state.month}-${this.state.day}T${militaryHour}:${this.state.minute}:00`;

    //schedule a notification
    PushNotificationIOS.scheduleLocalNotification({
      fireDate: new Date(key),
      alertBody: this.state.title,
      repeatInterval: "minute",
      userInfo: this.state
    });

    //make object to and add it to the CalendarAlarm object in AsyncStorage

    const data = await _retrieveData();
    //parse retreieved string data into JSON
    const dataSubmission = JSON.parse(data);
    dataSubmission[key] = this.state;
    //convert back to string so you can add the updated version to AsyncStorage
    const stringDataSubmission = JSON.stringify(dataSubmission);
    await _storeData(stringDataSubmission);
    //check if data were added
    let val = await _retrieveData();
    console.log("updated notifications inside submit", val);
  };

  render() {
    return (
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
            placeholder="An event"
            onChangeText={(itemValue, itemIndex) => {
              this.setState({ title: itemValue });
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
              padding: 5
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
              padding: 5
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
              padding: 5
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
              padding: 5
            }}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ hour: itemValue + "" });
            }}
          >
            {Array(12)
              .fill()
              .map((elem, idx) => idx + 1)
              .map(number => {
                number = formatHourMinute(number.toString());
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
              padding: 5
            }}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ minute: itemValue });
            }}
          >
            {Array(12)
              .fill()
              .map((elem, idx) => idx * 5)
              .map(number => {
                number = formatHourMinute(number.toString());
                return <Picker.Item label={number} value={number} />;
              })}
          </Picker>
          <Picker
            selectedValue={this.state.AmPm}
            itemStyle={{ height: 100, width: 80 }}
            style={{
              height: 100,
              width: 80,
              padding: 5
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

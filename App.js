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
  Button,
  ScrollView
} from "react-native";
import {
  _storeData,
  _retrieveData,
  stopNotification,
  formatHourMinute
} from "./Functions";
import ListView from "./components/ListView";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

//REQUEST PERMISSION TO USE PUSH NOTIFICATIONS
PushNotificationIOS.requestPermissions();

//ADD EVENT LISTENER CALLBACK FOR WHEN NOTIFICATION IS DELIVERED- this doesn't work unless the application is running. Could potentially be used to cancel notifications.
PushNotificationIOS.addEventListener("localNotification", stopNotification);

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
      month: "01",
      day: "01",
      year: "2018",
      hour: "01",
      minute: "00",
      AmPm: "AM",
      events: {}
    };
    this.replenishList = this.replenishList.bind(this);
  }

  replenishList = async () => {
    const data = await _retrieveData();
    this.setState({
      events: data
    });
  };

  componentDidMount() {
    this.replenishList();
  }
  submit = async () => {
    //replenish list view

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
    let data = await _retrieveData();
    //parse retreieved string data into JSON

    data[key] = this.state;
    //convert back to string so you can add the updated version to AsyncStorage
    await _storeData(data);
    //check if data were added
    this.replenishList();
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.picker} key={1}>
            <Text style={{ flexBasis: 60 }}>Title:</Text>
            <TextInput
              style={{
                height: 50,
                width: 200,
                borderColor: "white",
                borderWidth: 1,
                flexBasis: 250
              }}
              placeholder="An event"
              onChangeText={(itemValue, itemIndex) => {
                this.setState({ title: itemValue });
              }}
            />
          </View>
          <View style={styles.picker} key={2}>
            <Text style={{ flexBasis: 60 }}>Month:</Text>
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
          </View>
          <View style={styles.picker} key={3}>
            <Text style={{ flexBasis: 60 }}>Day:</Text>
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
          </View>
          <View style={styles.picker} key={4}>
            <Text style={{ flexBasis: 60 }}> Year: </Text>
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
                .fill(new Date().getFullYear())
                .map((elem, idx) => idx + elem)
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
          <View style={styles.picker} key={5}>
            <Text style={{ flexBasis: 60 }}> Time: </Text>
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
            <Text style={{ flexBasis: 60 }}> : </Text>
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
                  return (
                    <Picker.Item key={number} label={number} value={number} />
                  );
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

          <ListView
            events={this.state.events}
            replenishList={this.replenishList}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    margin: 20
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

export { PushNotificationIOS };

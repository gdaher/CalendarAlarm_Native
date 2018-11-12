import React from "react";
import { Text, View, PushNotificationIOS, Button } from "react-native";
import {
  _storeData,
  _retrieveData,
  deleteNotification,
  formatHourMinute
} from "../Functions";
const ListView = props => {
  return (
    <View>
      <Text>Scheduled Events:</Text>
      {Object.keys(props.events)
        .sort()
        .map((key, idx) => {
          const elem = props.events[key];
          return (
            <View
              key={idx}
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              {/*prettier-ignore*/}
              <Text>{`${elem.title}:${elem.month}/${elem.day}/${elem.year}@${elem.hour}:${elem.minute}`}</Text>
              <Button
                onPress={async () => {
                  await deleteNotification(key, elem);
                  props.replenishList();
                }}
                title="Cancel"
              />
            </View>
          );
        })}
    </View>
  );
};

export default ListView;

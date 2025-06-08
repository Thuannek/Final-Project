import { Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Hello Worls</Text>
      <MapView
        style={{ width: "100%", height: "100%" }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title={"Marker Title"}
          description={"Marker Description"}
        />
        <MapViewDirections
          origin={{ latitude: 37.78825, longitude: -122.4324 }}
          destination={{ latitude: 37.78825, longitude: -122.4324 }}
          apikey="AIzaSyD5WrXj8BLWwCb65V4uvQlLsVRrVTtLGP8"
          strokeWidth={3}
          strokeColor="hotpink"
        ></MapViewDirections>
      </MapView>
    </View>
  );
}

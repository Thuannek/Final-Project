import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
// Platform-specific imports
import { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const MapView = Platform.select({
  web: () => require("react-native-web-maps").default,
  default: () => require("react-native-maps").default,
})();

const GOOGLE_MAPS_APIKEY = "";

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  type Toilet = {
    id: number;
    latitude: number;
    longitude: number;
    tags: { [key: string]: any };
  };

  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [selectedToilet, setSelectedToilet] = useState<Toilet | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Query Overpass API for toilets
      const bbox = `${loc.coords.latitude - 0.01},${
        loc.coords.longitude - 0.01
      },${loc.coords.latitude + 0.01},${loc.coords.longitude + 0.01}`;
      const query = `[out:json];nwr[amenity=toilets](${bbox});out center;`;
      fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
          query
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          interface OverpassElement {
            id: number;
            lat?: number;
            lon?: number;
            center?: {
              lat: number;
              lon: number;
            };
            tags?: { [key: string]: any };
          }

          interface OverpassResponse {
            elements: OverpassElement[];
          }

          const toiletData: Toilet[] = (data as OverpassResponse).elements.map(
            (element: OverpassElement) => ({
              id: element.id,
              latitude: element.lat ?? element.center?.lat ?? 0,
              longitude: element.lon ?? element.center?.lon ?? 0,
              tags: element.tags || {},
            })
          );
          setToilets(toiletData);
        })
        .catch((error) => console.error("Error fetching toilets:", error));
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
        >
          {toilets.map((toilet) => (
            <Marker
              key={toilet.id}
              coordinate={{
                latitude: toilet.latitude,
                longitude: toilet.longitude,
              }}
              title={toilet.tags.name || "Public Toilet"}
              description={toilet.tags.fee ? `Fee: ${toilet.tags.fee}` : "Free"}
              onPress={() => setSelectedToilet(toilet)}
            />
          ))}
          {selectedToilet && (
            <MapViewDirections
              origin={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              destination={{
                latitude: selectedToilet.latitude,
                longitude: selectedToilet.longitude,
              }}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="blue"
            />
          )}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
      <Button
        title="Filter Toilets"
        onPress={() => Alert.alert("Filter", "Implement filtering UI here.")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

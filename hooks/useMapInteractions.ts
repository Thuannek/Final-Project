import { useCallback } from "react";
import MapView from "react-native-maps";

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function useMapInteractions(mapRef: React.RefObject<MapView>) {
  /**
   * Centers the map on a specific location with animation
   */
  const centerMapOnLocation = useCallback(
    (coordinates: Coordinates, zoomLevel: number = 0.005) => {
      if (!mapRef.current || !coordinates) return;

      mapRef.current.animateToRegion(
        {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        },
        1000
      );
    },
    [mapRef]
  );

  return {
    centerMapOnLocation,
  };
}

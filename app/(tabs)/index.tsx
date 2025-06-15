import { IconSymbol } from "@/components/ui/IconSymbol";
import { useEffect, useRef, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { toiletsData } from "../../dummyData/toilet";

// Import custom hooks
import { useLocation } from "@/hooks/useLocation";
import { FilterOptions, useToiletFilters } from "@/hooks/useToiletFilters";
import { useToiletSorting } from "@/hooks/useToiletSorting";

// Import components
import { FilterView } from "@/components/toiletFinder/FilterView";
import { LoadingView } from "@/components/toiletFinder/LoadingView";
import { ResultsListView } from "@/components/toiletFinder/ResultsListView";
import { ToiletDetailView } from "@/components/toiletFinder/ToiletDetailView";

import MapViewDirections from "react-native-maps-directions";

// View state types
type ViewState = "FILTER" | "LOADING" | "RESULTS" | "DETAIL";

export default function HomeScreen() {
  const [expanded, setExpanded] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>("LOADING");
  const [toilets, setToilets] = useState(toiletsData);
  const [selectedToiletId, setSelectedToiletId] = useState<number | null>(null);
  const mapRef = useRef<MapView>(null);

  // Use custom hooks
  const {
    userLocation,
    isLoading: locationLoading,
    calculateDistance,
  } = useLocation();
  const { filterOptions, setFilterOptions, applyFilters } = useToiletFilters();
  const { sortOption, handleSortChange, sortToiletsByDistance } =
    useToiletSorting();

  // Effect to calculate distances when user location is available
  useEffect(() => {
    if (userLocation) {
      const updatedToilets = toiletsData.map((toilet) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          toilet.coordinates.latitude,
          toilet.coordinates.longitude
        );
        return { ...toilet, distance };
      });

      setToilets(sortToiletsByDistance(updatedToilets));
      setCurrentView("RESULTS"); // Show results immediately after getting location
      setExpanded(true); // Expand the bottom sheet
    }
  }, [userLocation]);

  const handleSearch = () => {
    // Check if at least one toilet type and one gender designation is selected
    const hasToiletTypeSelected =
      filterOptions.types.public || filterOptions.types.private;
    const hasGenderDesignationSelected =
      filterOptions.genderDesignation.unisex ||
      filterOptions.genderDesignation.genderSeparated;

    if (!hasToiletTypeSelected || !hasGenderDesignationSelected) {
      // Show alert or feedback that filters are required
      Alert.alert(
        "Filter Selection Required",
        "Please select at least one toilet type and one gender designation."
      );
      return;
    }

    setCurrentView("LOADING");

    // Simulate loading
    setTimeout(() => {
      // Apply filters to toilets
      const filteredToilets = applyFilters(toiletsData);

      // Calculate distances for filtered toilets
      if (userLocation) {
        const updatedToilets = filteredToilets.map((toilet) => {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            toilet.coordinates.latitude,
            toilet.coordinates.longitude
          );
          return { ...toilet, distance };
        });

        // Sort by current sort option
        const sortedToilets = handleSortChange(sortOption, updatedToilets);
        setToilets(sortedToilets);
      } else {
        setToilets(filteredToilets);
      }

      setCurrentView("RESULTS");
    }, 1000);
  };

  const handleSelectToilet = (toiletId: number) => {
    const selectedToilet = toilets.find((t) => t.id === toiletId);
    setSelectedToiletId(toiletId);
    setExpanded(false); // Collapse the bottom sheet when showing details

    // Animate map to the selected toilet position
    if (selectedToilet && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: selectedToilet.coordinates.latitude,
          longitude: selectedToilet.coordinates.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    }

    setCurrentView("DETAIL");
  };

  const handleFilterPress = () => {
    setCurrentView("FILTER");
  };

  const handleBackToList = () => {
    setCurrentView("RESULTS");
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };

  const handleSortOptionChange = (option: "nearest" | "rating") => {
    const sortedToilets = handleSortChange(option, toilets);
    setToilets(sortedToilets);
  };

  return (
    <>
      <View className="flex-1 justify-center items-center bg-white">
        <MapView
          ref={mapRef}
          style={{ width: "100%", height: "100%" }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: userLocation?.latitude || 37.78825,
            longitude: userLocation?.longitude || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title={"Your Location"}
              description={"You are here"}
            >
              <IconSymbol name="location.fill" size={24} color="#37f" />
            </Marker>
          )}

          {currentView !== "FILTER" &&
            toilets.map((toilet) => (
              <Marker
                key={toilet.id}
                coordinate={toilet.coordinates}
                title={toilet.name}
                description={toilet.address}
              >
                <View className="bg-white w-10 h-10 rounded-full">
                  <View className="flex items-center justify-center h-full">
                    {toilet.type === "PUBLIC" ? (
                      <IconSymbol
                        name="globe.desk.fill"
                        size={24}
                        color="#059669"
                      />
                    ) : (
                      <IconSymbol name="lock.fill" size={24} color="#db2777" />
                    )}
                  </View>
                </View>
              </Marker>
            ))}
          <Marker
            coordinate={{
              latitude: userLocation?.latitude || 37.78825,
              longitude: userLocation?.longitude || -122.4324,
            }}
            title={"Your Location"}
            description={"You are here"}
          />

          <MapViewDirections
            origin={userLocation}
            destination={
              selectedToiletId !== null
                ? toilets.find((t) => t.id === selectedToiletId)?.coordinates
                : userLocation
            }
            apikey="<YOUR_GOOGLE_MAPS_API_KEY>"
          />
        </MapView>
      </View>

      <View
        className={`absolute left-0 right-0 bg-white shadow-lg rounded-t-3xl ${
          expanded ? "h-[710px] bottom-0" : "h-[350px] bottom-0"
        }`}
      >
        {/* Drag Indicator */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setExpanded(!expanded)}
          className="w-full items-center pt-2 pb-4"
        >
          <View className="w-16 h-1.5 bg-gray-300 rounded-full"></View>
        </TouchableOpacity>

        {/* Content based on current view */}
        <View className="flex-1">
          {currentView === "FILTER" && (
            <FilterView
              onBack={
                currentView === "FILTER" && toilets !== toiletsData
                  ? handleBackToList
                  : undefined
              }
              onFilterChange={handleFilterChange}
              initialFilters={filterOptions}
            />
          )}

          {currentView === "LOADING" && <LoadingView />}

          {currentView === "RESULTS" && (
            <ResultsListView
              onSelectToilet={handleSelectToilet}
              onFilterPress={handleFilterPress}
              sortOption={sortOption}
              onSortChange={handleSortOptionChange}
              toilets={toilets}
            />
          )}

          {currentView === "DETAIL" && (
            <ToiletDetailView
              onBackToList={handleBackToList}
              toilet={toilets.find((t) => t.id === selectedToiletId)}
            />
          )}
        </View>
      </View>

      {/* Find Button (shown only in filter view) */}
      {currentView === "FILTER" && (
        <View className="w-full px-6 py-4 absolute bottom-0 bg-white">
          <TouchableOpacity
            className="p-4 rounded-xl flex-row justify-center items-center gap-2 bg-blue-900"
            onPress={handleSearch}
          >
            <Text className="text-white text-lg font-semibold">Apply</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

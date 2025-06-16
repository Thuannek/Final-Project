import { IconSymbol } from "@/components/ui/IconSymbol";
import { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { toiletsData } from "../../dummyData/toilet";

import { PanGestureHandler } from "react-native-gesture-handler";

// Import custom hooks
import { useLocation } from "@/hooks/useLocation";
import { useMapInteractions } from "@/hooks/useMapInteractions";
import { FilterOptions, useToiletFilters } from "@/hooks/useToiletFilters";
import { useToiletSorting } from "@/hooks/useToiletSorting";

// Import components
import { FilterView } from "@/components/toiletFinder/FilterView";
import { LoadingView } from "@/components/toiletFinder/LoadingView";
import { ResultsListView } from "@/components/toiletFinder/ResultsListView";
import { ToiletDetailView } from "@/components/toiletFinder/ToiletDetailView";

// View state types
type ViewState = "FILTER" | "LOADING" | "RESULTS" | "DETAIL";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MIN_SHEET_HEIGHT = 350;
const MAX_SHEET_HEIGHT = 760;

export default function HomeScreen() {
  const [currentView, setCurrentView] = useState<ViewState>("LOADING");
  const [toilets, setToilets] = useState(toiletsData);
  const [selectedToiletId, setSelectedToiletId] = useState<number | null>(null);
  const mapRef = useRef<MapView>(null) as React.RefObject<MapView>;

  // Animated values for bottom sheet - using positive values for proper positioning
  const translateY = useSharedValue(SCREEN_HEIGHT - MIN_SHEET_HEIGHT);
  const lastTranslateY = useSharedValue(SCREEN_HEIGHT - MIN_SHEET_HEIGHT);

  const { centerMapOnLocation } = useMapInteractions(mapRef);

  const handleShowToiletPosition = (coordinates: {
    latitude: number;
    longitude: number;
  }) => {
    centerMapOnLocation(coordinates);
  };

  // Use custom hooks
  const {
    userLocation,
    isLoading: locationLoading,
    calculateDistance,
  } = useLocation();
  const { filterOptions, setFilterOptions, applyFilters } = useToiletFilters();
  const { sortOption, handleSortChange, sortToiletsByDistance } =
    useToiletSorting();

  // Function to expand bottom sheet programmatically
  const expandBottomSheet = () => {
    translateY.value = withSpring(SCREEN_HEIGHT - MAX_SHEET_HEIGHT, {
      damping: 20,
      stiffness: 90,
      mass: 0.7,
    });
    lastTranslateY.value = SCREEN_HEIGHT - MAX_SHEET_HEIGHT;
  };

  // Function to collapse bottom sheet programmatically
  const collapseBottomSheet = () => {
    translateY.value = withSpring(SCREEN_HEIGHT - MIN_SHEET_HEIGHT, {
      damping: 20,
      stiffness: 90,
      mass: 0.7,
    });
    lastTranslateY.value = SCREEN_HEIGHT - MIN_SHEET_HEIGHT;
  };

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
      setCurrentView("RESULTS");
      expandBottomSheet(); // Expand when results are ready
    }
  }, [userLocation]);

  // Handle gesture events for bottom sheet
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.y = translateY.value;
    },
    onActive: (event, ctx) => {
      // Constrain movement between collapsed and expanded positions
      translateY.value = Math.max(
        Math.min(ctx.y + event.translationY, SCREEN_HEIGHT - MIN_SHEET_HEIGHT),
        SCREEN_HEIGHT - MAX_SHEET_HEIGHT
      );
    },
    onEnd: (event) => {
      // Calculate midpoint for snapping decision
      const midPoint =
        SCREEN_HEIGHT - (MIN_SHEET_HEIGHT + MAX_SHEET_HEIGHT) / 2;

      // Determine whether to snap to collapsed or expanded based on position and velocity
      const shouldCollapse =
        translateY.value > midPoint || event.velocityY > 500;

      const finalPosition = shouldCollapse
        ? SCREEN_HEIGHT - MIN_SHEET_HEIGHT
        : SCREEN_HEIGHT - MAX_SHEET_HEIGHT;

      translateY.value = withSpring(finalPosition, {
        damping: 20,
        stiffness: 90,
        mass: 0.7,
      });

      lastTranslateY.value = finalPosition;
    },
  });

  // Animated styles for bottom sheet
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Indicator opacity (gets darker as sheet is pulled up)
  const indicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SCREEN_HEIGHT - MAX_SHEET_HEIGHT, SCREEN_HEIGHT - MIN_SHEET_HEIGHT],
      [0.8, 0.4],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  const handleSearch = () => {
    // Check if at least one toilet type and one gender designation is selected
    const hasToiletTypeSelected =
      filterOptions.types.public || filterOptions.types.private;
    const hasGenderDesignationSelected =
      filterOptions.genderDesignation.unisex ||
      filterOptions.genderDesignation.genderSeparated;

    if (!hasToiletTypeSelected || !hasGenderDesignationSelected) {
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
      expandBottomSheet();
    }, 1000);
  };

  const handleSelectToilet = (toiletId: number) => {
    const selectedToilet = toilets.find((t) => t.id === toiletId);
    setSelectedToiletId(toiletId);
    collapseBottomSheet(); // Collapse when showing details

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
        </MapView>
      </View>

      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            backgroundColor: "white",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            height: MAX_SHEET_HEIGHT,
          },
          animatedStyle,
        ]}
      >
        {/* Drag Indicator - ONLY this area responds to pan gestures */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View className="w-full items-center pt-2 pb-4">
            <Animated.View
              style={[
                {
                  width: 64,
                  height: 6,
                  backgroundColor: "#D0D0D0",
                  borderRadius: 3,
                },
                indicatorStyle,
              ]}
            />
          </Animated.View>
        </PanGestureHandler>

        {/* Content based on current view - NO gesture interference */}
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
              onShowPosition={handleShowToiletPosition}
            />
          )}
        </View>
      </Animated.View>

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

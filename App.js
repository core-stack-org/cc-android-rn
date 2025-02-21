import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LocationSelection from "./LocationSelection/LocationSelection";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Maps from "./Maps/Maps";
import { StyleSheet, TouchableOpacity, Text, View, Animated } from 'react-native';
import Splashscreen from "./Splashscreen";
import syncStorage from 'sync-storage';

const Stack = createNativeStackNavigator();

const App = () => {
  const [showSplash, setShowSplash] = React.useState(true);
  const animationValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      startAnimation();
    }, 5000); // adjust 

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    // Initialize sync storage
    async function initStorage() {
      await syncStorage.init();
    }
    initStorage();
  }, []);

  const startAnimation = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  if (showSplash) {
    return <Splashscreen />;
  }

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          transform: [
            {
              translateX: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1000, 0],
              }),
            },
          ],
        },
      ]}
    >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={LocationSelection}
            options={{
              title: "Select a location",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: "black",
              },
              headerTintColor: "white",
            }}
          />
         
          <Stack.Screen
            name="Maps"
            component={Maps}
            options={({ navigation }) => ({
              headerBackVisible: true,
              title: "Commons Connect",
              headerTitleAlign: "center",
              headerTitleStyle: { fontSize: 15 },
              headerStyle: { backgroundColor: "black" },
              headerTintColor: "white",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Home")}
                  style={{ padding: 10 }}
                >
                  {/* Add any custom left header content */}
                </TouchableOpacity>
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default App;
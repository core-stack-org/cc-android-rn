import React, { Component } from "react";
import { StatusBar, View, StyleSheet, Animated } from "react-native";
import Video from "react-native-video";

class Splashscreen extends Component {
  state = {
    opacity: new Animated.Value(0),
  };

  componentDidMount() {
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }

  render() {
    const { opacity } = this.state;

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.videoContainer, { opacity }]}>
          <Video
            source={require("./../assets/crop_video.mp4")}
            style={styles.video}
            resizeMode="cover"
            repeat
          />
        </Animated.View>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  videoContainer: {
    width: 400,
    height: 400,
    overflow: "hidden",
    // borderRadius: 10,
  },
  video: {
    flex: 1,
  },
});

export default Splashscreen;
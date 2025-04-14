import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, ActivityIndicator } from 'react-native';

import { StyleSheet, View, Button, Text, PermissionsAndroid } from 'react-native';
import { request, PERMISSIONS } from 'react-native-permissions';
import WebView from 'react-native-webview';

import { getWebviewUrl } from '../helper/utils';


const Maps = props => {
  const webViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {

    const requestLocationPermission = async () => {
      try {
        const granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (granted === 'granted') {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();

    const onAndroidBackPress = () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript('window.history.back();');
        return true;
      }
      return false;
    };

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    }

    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onAndroidBackPress,
        );
      }
    };
  }, []);

  console.log(props.route.params.geoserver_url);
  const block_name = props.route.params.block_name;
  const block_id = props.route.params.block_id;
  console.log(block_name);
  const dist_name = props.route.params.dist_name;
  console.log(dist_name);
  const geoserver_url = props.route.params.geoserver_url;
  console.log(geoserver_url);
  const web_uri = getWebviewUrl('maps/', dist_name, block_name, geoserver_url, block_id);

  const handleLoadProgress = event => {
    setLoadingProgress(event.nativeEvent.progress);
    if (event.nativeEvent.progress === 1) {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#592941" />
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: web_uri }}
        style={{ flex: 1 }}
        onLoadProgress={handleLoadProgress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1,
  },
  debugContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  debugText: {
    fontSize: 12,
    color: '#333',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
  },
});


Maps.navigationOptions = ({ navigation }) => ({
  title: 'Commons Connect',
  headerRight: () => (
    <Button
      title="< Location"
      onPress={() => {
        navigation.goBack();
      }}
    />
  ),
});

export default Maps;

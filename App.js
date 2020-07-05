import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import FetchLocation from './components/FetchLocation';
import UserMap from './components/UserMap';

export default function App() {
  let lat = 0;
  let long = 0;
  let state = false;

  const handleGetLocation = () => {
    console.log("Button Clicked");
    navigator.geolocation.getCurrentPosition(position => {console.log(position); lat = position.coords.latitude; long = position.coords.longitude; state = true}, err => {console.log(err);});
  };

  return (
    <View style={styles.container}>
      {/* {!state && (<Text>No Latitude, No Longitude</Text>)}
      {state && (<Text>Latitude: {lat}, Longitude: {long}</Text>)} */}

      {/* <Image source={require('./assets/favicon.png')} />
      <FetchLocation onGetLocation={handleGetLocation} />
      <Text>Open up App.js to start working on your app!!</Text> */}

      {/* <Image source={{ 
        width: 200,
        height: 300,
        uri: "https://picsum.photos/200/300" 
      }} /> */}
      
      <UserMap />
      
      {/* <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      /> */}

      <StatusBar style="auto" />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'coral',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

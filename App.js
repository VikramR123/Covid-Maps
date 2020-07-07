import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import FetchLocation from './components/FetchLocation';
import UserMap from './components/UserMap';

export default function App() {
  const [userLoc, setUserLoc] = useState(null);

  const [test, setTest] = useState('initial word');


  function handleTest() {
    setTest('second word');
  }

  const handleGetLocation = () => {
    console.log("Button Clicked");
    navigator.geolocation.getCurrentPosition(position => {
      setUserLoc({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.00422,
        longitudeDelta: 0.00121,
      }); 
    }, err => {console.log(err);});
  };

  return (
    <View style={styles.container}>
      
      {/*
      
        <button onClick={() => setUserLoc({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0622,
          longitudeDelta: 0.0421
        })}>
    
      */}

      {/* <Image source={require('./assets/favicon.png')} />
      
      <Text>Open up App.js to start working on your app!!</Text> */}

      {/* <Image source={{ 
        width: 200,
        height: 300,
        uri: "https://picsum.photos/200/300" 
      }} /> */}

      <UserMap userLocation={userLoc}/>
      
      <FetchLocation onGetLocation={handleGetLocation} />

      <Text> Something </Text>

      <Text> {test} </Text>

      <Button title="Click to Change Text" onPress={handleTest}/>       
      
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

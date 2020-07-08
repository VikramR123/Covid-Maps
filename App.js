import { StatusBar, setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Button, Dimensions, Platform } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';
import FetchLocation from './components/FetchLocation';
import UserMap from './components/UserMap';
//import { SearchBar } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
//import Icon from 'react-native-ionicons';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
//import Ionicons from 'react-native-vector-icons/Ionicons';
//import SearchBar from 'react-native-search-bar';

const { width, height } = Dimensions.get('screen');
export default function App() {
  const [userLoc, setUserLoc] = useState(null);
  const [userPlace, setUserPlace] = useState([]);
  const [search, setSearch] = useState('');

  //const search2 = React.createRef();

  const updateSearch = (input) => {
    setSearch({ input });
  };

  
  const handleGetLocation = () => {
    console.log("Button Clicked");
    navigator.geolocation.getCurrentPosition(position => {
      setUserLoc({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.00422,
        longitudeDelta: 0.00121,
      }); 
      fetch('https://able-bedrock-282408.firebaseio.com/places.json', {
        method: 'POST',
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
      .then(res => console.log(res.json()))
      .catch(err => console.log(err));
    }, err => {console.log(err);});
  };

  const getUserPlacesHandler = () => {
    fetch('https://able-bedrock-282408.firebaseio.com/places.json')
      .then(res => res.json())
      .then(parsedRes => {
        const placesArray = [];
        for (const key in parsedRes) {
          placesArray.push({
            latitude: parsedRes[key].latitude,
            longitude: parsedRes[key].longitude,
            id: key
          });
        }
        setUserPlace(placesArray);
        console.log("Places array: ", placesArray)
      })
      .catch(err => console.log(err));
  };


  const handleStates = () => {
    console.log("Handling states");
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    fetch('https://health-api.com/api/v1/covid-19/US/full', requestOptions)
      .then(res => res.text())
      .then(parsedRes => console.log(parsedRes))
      .catch(err => console.log(err));
    console.log("Done with states");
  };



  return (
    <View style={styles.container}>
      

      <UserMap userLocation={userLoc} usersPlaces={userPlace}/>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search Here"
          placeholderTextColor="#000"
          autoCapitalize="none"
          style={{flex:1,padding:0}}
        />
        <Icon name="md-menu" size={20} color='black' />
      </View>
      
      <FetchLocation onGetLocation={handleGetLocation} />

      <Text> somethings </Text>

  
      <View style={{marginTop: 80}}>
        <Button title="Click to get Places" onPress={getUserPlacesHandler}/>  
      </View>

      <Button title="Click to get States" onPress={handleStates}/>

      <SwipeUpDown		
        itemMini={
          <View style={{ alignItems: 'center' }}>
            <Text>This is the mini view, swipe up!</Text>
          </View>
        } // Pass props component when collapsed
        itemFull={
          <View style={styles.panelContainer}>
            {/* <SearchBar
              placeholder="Type Here..."
              onChangeText={updateSearch}
              value={search}
            /> */}
            {/* <SearchBar platform='ios' cancelButtonTitle='Cancel' onChangeText={(search) => { updateSearch(search) }} value={search} /> */}
            <Text style={styles.instructions}>
              Swipe down to close
            </Text>
            {/* <Text style={styles.instructions}> The search was: {search} </Text> */}
          </View>
        } // Pass props component when show full
        onShowMini={() => console.log('mini')}
        onShowFull={() => console.log('full')}
        onMoveDown={() => console.log('down')}
        onMoveUp={() => console.log('up')}
        disablePressToShow={false} // Press item mini to show full
        style={{ backgroundColor: 'lavender' }} // style for swipe
        animation={'easeInEaseOut'}
        swipeHeight={60}
      />
      
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
  header: {
    flex: 1,
    justifyContent: 'center',
  },
  searchBar: {
    flex:3,
    height: .1 * height,
    width: width,
    color: 'black',
  },
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10
  }
});

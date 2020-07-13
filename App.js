import { StatusBar, setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, Dimensions, Platform, SafeAreaView, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';
import UserMap from './components/UserMap';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { config } from './config.js';
import Geocoder from 'react-native-geocoding';
import { ListItem, Thumbnail, Left, Body, Right, Button as Button1, Container, Content, List } from 'native-base';
import NewsArticle from './components/NewArticle';
import { getArticles } from './service/news';


const { width, height } = Dimensions.get('screen');

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

// To protect API key
var PLACES_API_KEY = config.PLACES_AUTOCOMPLETE_KEY;
var NEWS__API = config.NEWS_API;


export default function App() {
  const [userLoc, setUserLoc] = useState(null);
  const [searchLoc, setSearchLoc] = useState(null);

  const [userPlace, setUserPlace] = useState([]);

  const [searchVal, setSearchVal] = useState('');

  const [active, setActive] = useState('first');

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null); // The news article list

  // The functional component version of componentDidMount() - runs every render, except only once because []
  useEffect(() => {
    setLoading(true);
    getArticles().then(data => setData(data));
  }, [])

  Geocoder.init(config.PLACES_AUTOCOMPLETE_KEY);


  
  
  const handleGetLocation = () => {
    console.log("Button Clicked");
    navigator.geolocation.getCurrentPosition(position => {
      setUserLoc({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.00422,
        longitudeDelta: 0.00121,
      }); 
      // BELOW : Post to Firebase DB

    //   fetch('https://able-bedrock-282408.firebaseio.com/places.json', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //     })
    //   })
    //   .then(res => console.log(res.json()))
    //   .catch(err => console.log(err));
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

  
  const handleGoToAddress = (address) => {
    Geocoder.from(address)
      .then(json => {
          var location = json.results[0].geometry.location;
          //console.log("Lat: ", location.lat);
          setSearchLoc({
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: 0.0422,
            longitudeDelta: 0.0121,
          }); 
      })
      .catch(error => console.warn(error));
  };


  function switchToSearch() { // This will switch the active tab to second when searching
    if (active != 'second') {
      //alert('Marker clicked');
      setActive('second');
    }
  }
  

  function pressMarker() {  // This will handle exclusively tapping the marker
    if (active != 'second') {
      setActive('second');
    }
    alert('Marker clicked');
  };





  function returnScrollView() {  // This returns the correct scroll view based on the selected tab
    if (active == 'first') {
      return(
        <Container>
          {/* <Content> */}
            <List 
              dataArray={data}
              renderRow={(item) => {
                return <NewsArticle article={item}/>
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          {/* </Content> */}
        </Container>
      )


      // <ScrollView contentContainerStyle={{marginVertical: 10}}>
      //   <View style={styles.newsArticle}>
      //     {/* <Image style={{width: 90, height: 90, top: 10, left: 10}} source={{uri: 'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/aw2yhexoukminlsbrk94.jpg'}}/> 
      //     <Text> SOmething </Text> */}

          

      //     {/* <View style={{backgroundColor: 'red', width: '20%', height: '100%'}}>
      //       <Image style={{width: 60, height: 60, top: 10, left: 10}} source={{uri: 'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/aw2yhexoukminlsbrk94.jpg'}}/> 
      //     </View>
      //     <View style={{flex: 1, backgroundColor: 'pink', width: '60%', height: '100%', left: 80}}>
      //       <Text> SOmething </Text>
      //     </View> */}
      //   </View>
      //   <View style={styles.newsArticle}>
      //     <Text> SOmething </Text>
      //   </View>
        
      // </ScrollView>

    }
    else if (active == 'second') {
      return(
        <ScrollView>
          <Text> This is the second scroll view </Text>
        </ScrollView>
      )
    }
    else if (active == 'third') {
      return(
        <ScrollView>
          <Text> This is the third scroll view </Text>
          <Text> NeededL General News section, Go TO current loc button and get stats, then County, State, Country,  </Text>
        </ScrollView>
      )
    }
  }








  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.StatusBar}>
      </View>

      <View style={{position: 'absolute', top: (Platform.OS === 'ios') ? 18 : 0, flex:1, height: height*0.50, width: width }}>
        <UserMap userLocation={userLoc} searchLocation={searchLoc} usersPlaces={userPlace} activeTab={active} getLocation={handleGetLocation} onPressMarker={pressMarker}/>
      </View>

      
      <View style={styles.searchBar}>
        <GooglePlacesAutocomplete
          placeholder='Search'
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
          listViewDisplayed='auto'    // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            //console.log("Data: ", data, " ,Details: ", details);
            setSearchVal(details.formatted_address);
            handleGoToAddress(details.formatted_address);
            switchToSearch();
          }}
    
          getDefaultValue={() => ''}
    
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: PLACES_API_KEY,
            language: 'en', // language of the results
            types: '(cities)' // default: 'geocode'
          }}
    
          styles={{
            textInputContainer: {
              width: '100%'
            },
            description: {
              fontWeight: 'bold'
            },
            predefinedPlacesDescription: {
              color: '#1faadb'
            }
          }}
    
          currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
          nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }}
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            type: 'cafe'
          }}
          
          GooglePlacesDetailsQuery={{
            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
            fields: 'formatted_address',
          }}
    
          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          //predefinedPlaces={[homePlace, workPlace]}
    
          enablePoweredByContainer={false}
          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          // renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
          // renderRightButton={() => <Text>Custom text after the input</Text>}
        />

        {/* <Icon name="ios-search" size={20} color='black' /> */}
      </View>
      
      <View style={styles.tabs}>
        <View style={[
          styles.tab,
          (active === 'first') ? styles.activeTab : null
          ]}>
          <Text style={[
            styles.tabTitle,
            active === 'first' ? styles.activeTabTitle : null
            ]} onPress={() => setActive('first')}> General News </Text>
        </View>
        <View style={[
          styles.tab,
          (active === 'second') ? styles.activeTab : null
          ]}>
          <Text style={[
            styles.tabTitle,
            active === 'second' ? styles.activeTabTitle : null
            ]} onPress={() => setActive('second')}> Specific Area </Text>
        </View>
        <View style={[
          styles.tab,
          (active === 'third') ? styles.activeTab : null
          ]}>
          <Text style={[
            styles.tabTitle,
            active === 'third' ? styles.activeTabTitle : null
            ]} onPress={() => {
              setActive('third');
              handleGetLocation();  // Everytime the "Your Location" tab is selected, the user loc is refreshed and panned to
            }}> Your Location </Text>
        </View>
      </View>


      {/* {console.log("Testing")} */}
      
      <View style={styles.bottomBar}> 
        {returnScrollView()}
        
        
        
        {/* <FetchLocation onGetLocation={handleGetLocation} />

        <Text> Address is: {searchVal} </Text> */}


        {/* <View style={{marginTop: 80}}>
          <Button title="Click to get Places" onPress={getUserPlacesHandler}/>  
        </View>

        <Button title="Click to get States" onPress={handleStates}/> */}
      </View>

      
      {/* <SwipeUpDown		
        itemMini={
          <View style={{ alignItems: 'center' }}>
            <Text>This is the mini view, swipe up!</Text>
          </View>
        } // Pass props component when collapsed
        itemFull={
          <View style={styles.panelContainer}>
            
            
            <Text style={styles.instructions}>
              Swipe down to close
            </Text>
            
          </View>
        } // Pass props component when show full
        onShowMini={() => console.log('mini')}
        onShowFull={() => console.log('full')}
        onMoveDown={() => console.log('down')}
        onMoveUp={() => console.log('up')}
        disablePressToShow={false} // Press item mini to show full
        style={{ backgroundColor: '#c3f2dc' }} // style for swipe
        animation={'easeInEaseOut'}
        swipeHeight={60}
      /> */}
      


      <StatusBar style="auto" />
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4b6075', //Sailor Blue with Mint swipeUp
    alignItems: 'center',
    justifyContent: 'center',
  },
  StatusBar: {
    height: (Platform.OS === 'ios') ? 18 : 0, //this is just to test if the platform is iOS to give it a height of 18, else, no height (Android apps have their own status bar)
    backgroundColor: "white",
  },
  header: {
    flex: 1,
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    position: 'absolute',
    top: (Platform.OS === 'ios') ? 32 : 15, // Normally 18 : 0 to align to very top below StatusBar, but added cushion for style
    width: width * 0.9,
    //height: height  * 0.35 // To cut off the "Powered by Google" banner at bottom
  },
  textInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  inputWrapper: {
    marginTop: 80,
    flexDirection: 'row'
  },
  panelContainer: {
    //
  },
  tab:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.05,
    //paddingHorizontal: 14,
    //backgroundColor: 'red'
    //paddingBottom: 80
  },
  tabs: {
    //flex: 1,
    position: 'absolute',
    flexDirection: 'row',
    width: width,
    height: height * 0.06,
    top: (Platform.OS === 'ios') ? height * 0.50 + 19 : height * 0.50 + 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#c3f2dc', // Mint
    borderWidth: 3,
    borderColor: '#00203FFF' // Darker Sailor Blue
  },
  tabTitle: {
    fontWeight: 'bold',
  },
  activeTab: {
    borderBottomColor: 'orange',
    borderBottomWidth: 3
  },
  activeTabTitle: {
    color: 'orange',
  },
  bottomBar: {
    flex: 1,
    position: 'absolute',
    width: width,
    height: height * 0.44,
    top: (Platform.OS === 'ios') ? height*0.56 + 29 : height*0.56 + 10,
    backgroundColor: '#4b6075',
    paddingBottom: 30
  },
  newsArticle: {
    //flex: 1,
    backgroundColor: 'white',
    height: height * 0.15,
    width: width - 20,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    // flex: 1,
    flexDirection: 'row',
  },
});

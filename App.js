import { StatusBar, setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, Dimensions, Platform, SafeAreaView, ScrollView, Modal, ActivityIndicator } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';
import UserMap from './components/UserMap';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { config } from './config.js';
import Geocoder from 'react-native-geocoding';
import { ListItem, Thumbnail, Left, Body, Right, Button as Button1, Container, Content, List } from 'native-base';
import NewsArticle from './components/NewArticle';
import { getArticles } from './service/news';
import NewsModal from './components/Modal';
import moment from 'moment'
import * as Font from 'expo-font';
import { AppLoading } from 'expo';


const { width, height } = Dimensions.get('screen');


// To protect API key
var PLACES_API_KEY = config.PLACES_AUTOCOMPLETE_KEY;
var NEWS__API = config.NEWS_API;


export default function App() {
  const [userLoc, setUserLoc] = useState(null); // Tracks users' coords
  const [searchLoc, setSearchLoc] = useState(null);

  const [userPlace, setUserPlace] = useState([]); // Tracks users' coords

  const [searchVal, setSearchVal] = useState(''); // Used to get search value

  const [active, setActive] = useState('first'); // Selects which of the three tabs is showing

  const [isLoading, setLoading] = useState(false); // Not used currently
  const [data, setData] = useState(null); // The news article list
  const [modalVisible, setModalVisibility] = useState(false); // The modal is the pop-up of news article
  const [modalData, setModalData] = useState({});

  const [loadingModalVis, setLoadingModalVis] = useState(false);

  // The functional component version of componentDidMount() - runs every render, except only once because []
  useEffect(() => {
    setLoading(true);
    getArticles().then(data => setData(data));
    // await Font.loadAsync({
    //   //'Roboto': require('native-base/Fonts/Roboto.ttf'),
    //   'Roboto_medium': require('Fonts/Roboto-Medium.ttf'),
    //   ...Ionicons.font,
    // })
    const loadFonts = async () => {
      await Font.loadAsync({
        'Roboto_medium': require('./assets/fonts/Roboto-Medium.ttf'),
      });
      //setFontReady(true);
    };
    loadFonts();
  }, [])


  function handleItemDataOnPress(articleData) {
    setModalVisibility(true);
    setModalData(articleData);
  }

  function handleModalOnClose() {
    setModalVisibility(false);
    setModalData({});
  }


  Geocoder.init(config.PLACES_AUTOCOMPLETE_KEY);


  
  const handleGetLocation = () => {
    //console.log("Button Clicked");
    navigator.geolocation.getCurrentPosition(position => {
      setSearchLoc({
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
    getLocInfo();
    //alert('Marker clicked');
  };

  const [county, setCounty] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [countryInfo, setCountryInfo] = useState(null);
  const [stateInfo, setStateInfo] = useState(null);
  const [countyInfo, setCountyInfo] = useState(null);


  function getLocInfo() { // Returns county, state, and country for each searched location
    if (searchLoc != null) {
      setLoadingModalVis(true);  // Makes the loading modal visible until end of this function

      var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + searchLoc.latitude + ',' + searchLoc.longitude + '&key=' + PLACES_API_KEY;  
      fetch(url)
      .then(resp => resp.json())
      .then(data => {
        console.log("Deets: ", data.results[0].address_components);
        //console.log("COUNTRY: ", data.results[0].address_components[5].long_name);
        var _county;
        var _state;
        var _country;
        var i;
        var dataArr = data.results[0].address_components;

        // For loop to pull county, state, and country info. 
        for (i in dataArr) {
          //console.log("Comp: ", comp)
          if (dataArr[i].types[0] == "country") {
            _country = dataArr[i].long_name;
            if (_country != "United States") {
              _county = null;
              _state = null;
            }
          }
          else if (dataArr[i].types[0] == "administrative_area_level_1") {
            _state = [dataArr[i].long_name, dataArr[i].short_name];
          }
          else if (dataArr[i].types[0] == "administrative_area_level_2") {
            _county = dataArr[i].long_name;
          }
        }

        // var len = data.results[0].address_components.length;
        // var _county = data.results[0].address_components[len-4].long_name;
        // var _state = data.results[0].address_components[len-3].long_name;
        // var _country = data.results[0].address_components[len-2].long_name;
        
        setCounty(_county);
        setState(_state);
        setCountry(_country);

        // Building the County View
        if (_country == "United States") {
          var countyUrl = 'https://corona.azure-api.net/country/us/' + _state[0] + "/" + _county.slice(0,-7);
          fetch(countyUrl)
            .then(resp => resp.json())
            .then(data => {
              //console.log("County data: ", data);
              const time3 = moment( data.Last_Update.replace("+00:00", "Z") || moment.now() ).fromNow();

              var testing = <View style={styles.caseInfo}>
                <Text style={{fontSize: 24, fontWeight: 'bold'}}> County: {_county.slice(0,-7)} </Text>
                <Text> Last Updated: {time3} </Text>
                <Text style={{fontSize: 20}}> Total Deaths: <Text style={styles.caseNums}>{data.Deaths}</Text> </Text>
                <Text style={{fontSize: 20}}> Total Confirmed Positive: <Text style={styles.caseNums}>{data.Confirmed}</Text> </Text>
                <Text style={{fontSize: 20}}> Total Recovered: <Text style={styles.caseNums}>{data.Recovered}</Text> </Text>
              </View>
              setCountyInfo(testing);
            })
            .catch(err => console.log("Error: ", err));
        }
        else {
          setCountyInfo(null);
        }


        // Building the State View
        if (_country == "United States") {
          fetch('https://covidtracking.com/api/states/')
            .then(resp => resp.json())
            .then(data => {
              //console.log("state data: ", data);

              var stateData;

              for (i in data) {
                if (data[i].state == _state[1]) {
                  stateData = data[i];
                  break;
                }
              }

              const time2 = moment( stateData.dateModified.replace("+00:00", "Z") || moment.now() ).fromNow();

              var testing = <View style={styles.caseInfo}>
                <Text style={{fontSize: 24, fontWeight: 'bold'}}> State: {_state[0]} </Text>
                <Text> Last Updated: {time2} </Text>
                <Text adjustsFontSizeToFit numberOfLines={1} style={{fontSize: 20}}> Total Deaths: <Text style={styles.caseNums}>{stateData.death}</Text> | New: <Text style={styles.caseNums}>{stateData.deathIncrease}</Text></Text>
                <Text adjustsFontSizeToFit numberOfLines={1} style={{fontSize: 20}}> Total Confirmed: <Text style={styles.caseNums}>{stateData.positive}</Text> | New: <Text style={styles.caseNums}>{stateData.positiveIncrease}</Text></Text>
                <Text style={{fontSize: 20}}> Total Recovered: <Text style={styles.caseNums}>{(stateData.recovered === null) ? "No Data" : stateData.recovered}</Text> </Text>
              </View>

              setStateInfo(testing);
            })
            .catch(err => console.log("Error: ", err));
        }
        else {
          setStateInfo(null);
        }



        var tempUrl = 'https://corona.azure-api.net/country/' + _country;
        fetch(tempUrl)
        .then(resp => resp.json())
        .then(data => {
          //console.log("Summary2: ", data.Summary);
          const time = moment( data.Summary.Last_Update.replace("+00:00", "Z"), 'YYYY-MM-DD HH:mm:ss Z' || moment.now() ).fromNow();
          //data.Summary.Last_Update, 'YYYY-MM-DD HH:mm:ss ZZ'

          // Builds a view with all country information
          var countryInformation = <View style={styles.caseInfo}>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}> Country: {_country} </Text>
            <Text> Last Updated: {time} </Text>
            <Text adjustsFontSizeToFit numberOfLines={1} style={{fontSize: 20, paddingBottom: 5}}> Total Deaths: <Text style={styles.caseNums}>{data.Summary.Deaths}</Text> | New: <Text style={styles.caseNums}>{data.Summary.NewDeaths}</Text> </Text>
            <Text adjustsFontSizeToFit numberOfLines={1} style={{fontSize: 20, paddingBottom: 5}}> Total Confirmed: <Text style={styles.caseNums}>{data.Summary.Confirmed}</Text> | New: <Text style={styles.caseNums}>{data.Summary.NewConfirmed}</Text></Text>
            <Text adjustsFontSizeToFit numberOfLines={1} style={{fontSize: 20}}> Total Recovered: <Text style={styles.caseNums}>{data.Summary.Recovered}</Text> | New: <Text style={styles.caseNums}>{data.Summary.NewRecovered}</Text></Text>
          </View>
          
          //setView(JSON.stringify(data.Summary));
          setCountryInfo(countryInformation);
          //console.log("Summary: ", data.Summary);


          setLoadingModalVis(false); // Sets the modal back to invisible once all the data loads
        })
        .catch(err => console.log(err));

        //console.log("Data is: ", data.Summary)
        //setView(temp);
      })
      .catch(err => console.log("Error: ", err));
    }
  };


  //https://corona.azure-api.net/country/us/california/Los%20Angeles  endpoint for API




  function returnScrollView() {  // This returns the correct scroll view based on the selected tab
    if (active == 'first') {
      return(
        <Container>
          {/* <Content> */}
          <List 
            dataArray={data}
            renderRow={(item) => {
              return <NewsArticle onPress={handleItemDataOnPress} article={item}/>
            }}
            keyExtractor={(item, index) => index.toString()}
          />
          {/* </Content> */}
          <NewsModal 
            showModel={modalVisible}
            articleData={modalData}
            onCloseWindow={handleModalOnClose}
          />
        </Container>
      )
    }
    else if (active == 'second') {
      let iosButton = <View style={{backgroundColor: '#007AFF', margin: 10, borderRadius: 10}} >
        <Button color='white' title="Go to Current Location" onPress={handleGetLocation}/>
      </View>

      let androidButton = <View style={{backgroundColor: '#007AFF', margin: 10}} >
        <Button color='blue' title="Go to Current Location" onPress={handleGetLocation}/>
      </View>
      return(
        <ScrollView>
          {(Platform.OS === 'ios') ? iosButton  : androidButton}


          {countyInfo}
          {stateInfo}
          {countryInfo}

        </ScrollView>
      )
    }
    else if (active == 'third') {
      return(
        <ScrollView>
          <Text> This is the third scroll view </Text>
          <Text> No longer needed but here in case needed for future  </Text>
        </ScrollView>
      )
    }
  }



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.StatusBar}>
      </View>

      <View style={{position: 'absolute', top: (Platform.OS === 'ios') ? 18 : 24, flex:1, height: height*0.50, width: width }}>
        <UserMap userLocation={userLoc} searchLocation={searchLoc} usersPlaces={userPlace} activeTab={active} getLocation={handleGetLocation} onPressMarker={pressMarker}/>
      </View>

      
      <View style={styles.searchBar}>
        <GooglePlacesAutocomplete
          placeholder='Search a city and click the marker for info'
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


        {/* Modal for dimming the screen while loading all information */}
        <Modal
          //animationType="slide"
          transparent={true}
          visible={loadingModalVis}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{backgroundColor: 'rgba(0,0,0,0.5)', height: height, width: width,}}>
            <Modal
              //animationType="slide"
              transparent={true}
              visible={true}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
              }}
            >
              <View style={{top: height * 0.4, alignSelf: 'center'}}>
                <ActivityIndicator size="large" color={(Platform.OS === 'ios') ? "white" : "blue"} />
              </View>

            </Modal>
          </View>

        </Modal>


      </View>
      
      <View style={styles.tabs}>
        <View style={[
          styles.tab,
          (active === 'first') ? styles.activeTab : null
          ]}>
          <Text style={[
            styles.tabTitle,
            active === 'first' ? styles.activeTabTitle : null
            ]} onPress={() => setActive('first')}> Top Headlines </Text>
        </View>
        <View style={[
          styles.tab,
          (active === 'second') ? styles.activeTab : null
          ]}>
          <Text style={[
            styles.tabTitle,
            active === 'second' ? styles.activeTabTitle : null
            ]} onPress={() => setActive('second')}> Location Look-Up </Text>
        </View>
        {/* <View style={[
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
        </View> */}
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
    height: (Platform.OS === 'ios') ? 18 : 24, //this is just to test if the platform is iOS to give it a height of 18, else, no height (Android apps have their own status bar)
    backgroundColor: "white",
  },
  header: {
    flex: 1,
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    position: 'absolute',
    top: (Platform.OS === 'ios') ? 32 : 40, // Normally 18 : 0 to align to very top below StatusBar, but added cushion for style
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
    top: (Platform.OS === 'ios') ? height * 0.50 + 19 : height * 0.50 + 20,
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
    height: (Platform.OS === 'ios') ? height * 0.44 : height * 0.38,
    top: (Platform.OS === 'ios') ? height*0.56 + 29 : height*0.56 + 25,
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
  biggerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  },
  caseInfo: {
    backgroundColor: 'lavender',
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  caseNums: {
    color: 'red',
    fontWeight: 'bold'
  }
});

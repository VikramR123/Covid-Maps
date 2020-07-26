import React from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('screen');

const userMap = props => {
    let searchLocMarker = null;

    if (props.searchLocation) {
        searchLocMarker = <MapView.Marker coordinate={props.searchLocation} image={require('../assets/red_marker.png')} onPress={props.onPressMarker} />
    }
    
    const usersMarkers = props.usersPlaces.map(userPlace => <MapView.Marker coordinate={userPlace} key={userPlace.id}/>)
    return (
        // <View style={styles.container}>
            <MapView
                style={styles.map}
                enableZoomControl={true}
                // showsUserLocation = {true}
                showsMyLocationButton = {true}
                zoomEnabled = {true}
                initalRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0622,
                    longitudeDelta: 0.0421,
                }}
                region={(props.activeTab === 'third') ? props.userLocation : props.searchLocation}>
                    {searchLocMarker}
                    {usersMarkers}
            </MapView>
        // {/* </View> */}
    );
};

const styles = StyleSheet.create({
    container: {
      //...StyleSheet.absoluteFillObject,
      flex: 1,
      height: height * 0.5,
      width: width,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
});

export default userMap;
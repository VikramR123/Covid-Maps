import React from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('screen');

const userMap = props => {
    let userLocMarker = null;

    if (props.userLocation) {
        userLocMarker = <MapView.Marker coordinate={props.userLocation} image={require('../assets/red_marker.png')} onPress={() => alert('Marker clicked')} />
            {/* <Image style={{flex: 1, position: 'absolute', resizeMode: 'contain', width: 40, height: 40}} source={require('../assets/red_marker.png')}/> */}
            {/* <TouchableOpacity onPress={() => alert('image clicked')}>
                <Image style={{flex: 1, position: 'absolute', resizeMode: 'contain', width: 40, height: 40}} source={require('../assets/red_marker.png')}/>
            </TouchableOpacity> */}
        {/* </MapView.Marker> */}
    }
    const usersMarkers = props.usersPlaces.map(userPlace => <MapView.Marker coordinate={userPlace} key={userPlace.id}/>)
    return (
        // <View style={styles.container}>
            <MapView
                style={styles.map}
                enableZoomControl={true}
                showsUserLocation = {true}
                showsMyLocationButton = {true}
                zoomEnabled = {true}
                initalRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0622,
                    longitudeDelta: 0.0421,
                }}
                region={props.userLocation}>
                    {userLocMarker}
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
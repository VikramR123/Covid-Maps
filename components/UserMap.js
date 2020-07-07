import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

const userMap = props => {
    let userLocMarker = null;

    if (props.userLocation) {
        userLocMarker = <MapView.Marker coordinate={props.userLocation} />
    }
    const usersMarkers = props.usersPlaces.map(userPlace => <MapView.Marker coordinate={userPlace} key={userPlace.id}/>)
    return (
        <View style={styles.container}>
        <MapView
            style={styles.map}
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
   </View>
    );
};

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 400,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
});

export default userMap;
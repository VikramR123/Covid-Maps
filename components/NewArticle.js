import React from 'react';
import { Text, View, StyleSheet} from 'react-native';
import { ListItem, Thumbnail, Left, Body, Right, Button as Button1 } from 'native-base';
import moment from 'moment';


const newsArticle = props => {
    var data = props.article;
    const time = moment( data.publishedAt || moment.now() ).fromNow();

    handlePress = () => {
        const {url, title} = data;
        return props.onPress({url, title});
    }

    //console.log("data: ", data);
    return (
        <ListItem thumbnail>
            <Left>
                <Thumbnail square source={{ uri: (data.urlToImage != null) ? data.urlToImage : 'https://via.placeholder.com/300/09f/fff.pngC/O https://placeholder.com/' }} />
            </Left>
            <Body>
                <Text numberOfLines={2} style={{fontSize: 16}}>{data.title}}</Text>
                <Text note numberOfLines={2} style={{color: 'gray'}}>{data.content}</Text>
                <View style={{flex: 1, flexDirection: 'row', marginTop: 8}}>
                    <Text style={{color: 'gray'}}> {data.source.name} </Text>
                    <Text style={{color: 'gray', marginHorizontal: 10}}> {time} </Text>
                </View>
            </Body>
            <Right>
                <Button1 transparent onPress={handlePress}>
                    <Text style={{color: '#0000EE'}}>View</Text>
                </Button1>
            </Right>
        </ListItem>

    )
}


export default newsArticle;
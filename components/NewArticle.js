import React from 'react';
import { Text, View, StyleSheet} from 'react-native';
import { ListItem, Thumbnail, Left, Body, Right, Button as Button1 } from 'native-base';


const newsArticle = props => {
    var data = props.article;
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
                    <Text style={{color: 'gray'}}> {data.publishedAt} </Text>
                </View>
            </Body>
            <Right>
                <Button1 transparent>
                    <Text>View</Text>
                </Button1>
            </Right>
        </ListItem>

    )
}


export default newsArticle;
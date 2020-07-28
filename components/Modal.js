import React from 'react';
import { View, Dimensions, Modal, Share, Platform } from 'react-native';
import { WebView } from 'react-native-webview'
import { Container, Header, Content, Body, Left, Right, Icon, Title, Button } from 'native-base';
import { and } from 'react-native-reanimated';

const webViewHeight = Dimensions.get('window').height - 100;

const modalComp = props => {
    const visibleModal = props.showModal;
    const data = props.articleData;

    handleClose = () => {
        props.onCloseWindow();
    }

    handleShare = () => {
        //
    }

    if (data.url != undefined) {
    return (
        <Modal
            animationType="slide"
            transparent
            visible={visibleModal}
            onRequestClose={handleClose}
        >
            <Container style={{margin:15, marginBottom:0, backgroundColor: 'white'}}>
                <Header style={{backgroundColor: '#00203FFF'}}>
                    <Left style={{flex:1}}>
                        <Button onPress={handleClose} transparent>
                            <Icon name='close' style={{color: 'white', fontSize:20}} />
                            <Title children={data.title} style={{color: 'white'}}/>
                        </Button>
                    </Left>
                    {/* <Body>
                        <Title children={data.title} style={{color: 'white', alignSelf: 'center'}}/>
                    </Body>
                    <Right>
                        <Button onPress={handleShare} transparent>
                            <Icon name='share' style={{color: 'white', fontSize:20}} />
                        </Button>
                    </Right> */}
                </Header>
                <Content contentContainerStyle={{height: webViewHeight}}>
                    <WebView source={{uri: data.url}} style={{flex: 1}}
                    onError={handleClose} startInLoadingState
                    scalesPageToFit
                    />
                </Content>
            </Container>

        </Modal>
    )
    } else {
        return null;
    }
};


export default modalComp;
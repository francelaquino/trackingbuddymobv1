
import React, { Component } from 'react';
import { TouchableOpacity,Modal, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image  } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch,Thumbnail, Card,CardItem } from 'native-base';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OfflineNotice  from '../shared/OfflineNotice';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
var globalStyle = require('../../assets/style/GlobalStyle');



class HomeSettings extends Component {
    constructor(props) {
        super(props)
    
    }
   
    ready() {
        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <OfflineNotice />
                    <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Icon size={30} name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Settings</Title>
                        </Body>
                    </Header>
                    <Content padder>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                            <View style={globalStyle.container}>

                                <List>
                                    <ListItem avatar button style={globalStyle.listItem} onPress={() => {
                                        this.props.navigation.navigate("ChangePassword");
                                    }}>
                                        <Left >

                                            <MaterialCommunityIcons style={{ fontSize: 30, color: '#16a085' }} name="textbox-password" />
                                        </Left>

                                        <Body style={globalStyle.listBody} >
                                            <Text style={globalStyle.listHeading}>Change Password</Text>
                                        </Body>
                                        <Right style={globalStyle.listRight} >
                                            <SimpleLineIcons style={globalStyle.listRightOptionIcon} name='arrow-right' />
                                        </Right>
                                    </ListItem>

                                    <ListItem avatar button style={globalStyle.listItem} onPress={() => {
                                        this.props.navigation.navigate("GenerateInviteCode");
                                    }}>
                                        <Left >

                                            <MaterialCommunityIcons style={{ fontSize: 30, color: '#16a085' }} name="table-row" />
                                        </Left>

                                        <Body style={globalStyle.listBody} >
                                            <Text style={globalStyle.listHeading}>Invitation Code</Text>
                                        </Body>
                                        <Right style={globalStyle.listRight} >
                                            <SimpleLineIcons style={globalStyle.listRightOptionIcon} name='arrow-right' />
                                        </Right>
                                    </ListItem>



                                </List>


                            </View>
                        </ScrollView>
                    </Content>
                </Container>
            </Root>
        )
    }

    render() {
            return this.ready();
    }
   
}
  
  

  
export default HomeSettings;


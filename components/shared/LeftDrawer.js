

import React, { Component } from 'react';
import { AsyncStorage, TouchableOpacity, Platform,  StyleSheet,  Text,  View,Image } from 'react-native';
import { Root,Content,Drawer,Container ,List , ListItem, Right, Body,Left,Icon, Thumbnail} from 'native-base';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import { clearHomeMembers } from '../../actions/memberActions';
import firebase from 'react-native-firebase';
var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../shared/userDetails');

type Props = {};

class LeftDrawer extends Component<Props> {

    constructor(props) {
        super(props)
    }
    refreshToken = function () {
        if (userdetails.userid !== "" && userdetails.userid !== null) {
            firebase.messaging().getToken()
                .then(fcmToken => {
                    if (fcmToken) {
                        let userRef = firebase.database().ref().child("users/" + userdetails.userid);
                        userRef.update({
                            fcmtoken: fcmToken,
                        })
                    }
                });
        }
    }
  displayMember(){
    this.props.navigation.navigate('DisplayMember',{closeDrawer:this.props.closeDrawer()});
    this.props.closeDrawer();
  }
  displayGroup(){
    this.props.navigation.navigate('DisplayGroup');
    this.props.closeDrawer();
  }
  displayHome(){
    this.props.navigation.navigate('HomePlaces');
    this.props.closeDrawer();
  }
  displayPlaces(){
    this.props.navigation.navigate('PlaceList');
    this.props.closeDrawer();
  }
  displayProfile(){
    this.props.navigation.navigate('UserProfile');
    this.props.closeDrawer();
  }
  displaySettings(){
    this.props.navigation.navigate('HomeSettings');
    this.props.closeDrawer();
  }
    displayLogout() {
        //firebase.auth().signOut();
        refreshToken();
        userdetails.userid = "";
        userdetails.email = "";
        userdetails.firstname = "";
        userdetails.lastname = "";
        userdetails.group = "";
        userdetails.avatar = "";
        userdetails.userid = "";
        AsyncStorage.setItem("userid", "");
        AsyncStorage.setItem("email", "");
        AsyncStorage.setItem("firstname", "");
        AsyncStorage.setItem("lastname", "");
        this.props.closeDrawer();

        setTimeout(() => {
            this.props.navigation.navigate('Login');
            this.props.clearHomeMembers();
        }, 1000);

    }
  render() {
    const navigation = this.props.navigation;    
    return (
                <Container > 
            <Content style={{ backgroundColor: 'white', height: '100%' }}>
                <View style={{ backgroundColor: '#1abc9c',height: 155, borderBottomWidth: 1, borderBottomColor: 'white', alignItems: 'center', flex: 1, marginBottom:20 }} >
                    <Image style={{ height: 100,marginTop:20 }} resizeMode='contain' source={require('../../images/logo_splash.png')} />
                        <Text style={{width:'100%',fontSize:17,color:'white', textAlign:'center',marginTop:5}}>TRACKING BUDDY</Text>
                        </View>

                <List >
                        
                   
                            
                   
                    <ListItem icon style={{ marginBottom: 5, padding: 10 }}>
                            <Left>
                            <SimpleLineIcons style={{ fontSize: 30, width: 30, color:'#454444'}} name="info" />
                            </Left>
                            <Body style={{width:'100%',borderBottomWidth:0}} >
                                
                                <TouchableOpacity  onPress={() =>this.displayHome()}>
                                <Text style={{ fontSize: 19, color: '#454444', marginLeft: 5}}>ABOUT</Text>
                                </TouchableOpacity>
                            </Body>
                            </ListItem>
                           <ListItem icon style={{ marginBottom: 5,padding:10}}>
                            <Left>
                            <SimpleLineIcons style={{ fontSize: 30, width: 25, color:'#454444'}} name="logout" />
                            </Left>
                            <Body style={{width:'100%',borderBottomWidth:0}} >
                            <TouchableOpacity  onPress={() =>this.displayLogout()}>
                                <Text style={{ fontSize: 19, color: '#454444', marginLeft: 5}}>LOGOUT</Text>
                                </TouchableOpacity>
                            </Body>
                            </ListItem>
                        </List>
                    </Content>      
                </Container>
    );
  }
}


const mapStateToProps = state => ({
    
  })
  
  
  
  LeftDrawer=connect(mapStateToProps,{clearHomeMembers})(LeftDrawer);
  
export default LeftDrawer;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });
  
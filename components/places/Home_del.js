
import React, { Component } from 'react';
import { BackHandler, AsyncStorage, NetInfo, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, FlatList } from 'react-native';
import { Drawer,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Thumbnail,Card,CardItem } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, {  Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Loading  from '../shared/Loading';
import Loader  from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';
import LeftDrawer from '../shared/LeftDrawer'
import { connect } from 'react-redux';
import Moment from 'moment';
import { displayHomeMemberTemp } from '../../redux/actions/memberActions';
import firebase from 'react-native-firebase';
import type { Notification } from 'react-native-firebase';
import axios from 'axios';
var PushNotification = require('react-native-push-notification');
var settings = require('../../components/shared/Settings');
var screenHeight = Dimensions.get('window').height; 

import BackgroundJob from 'react-native-background-job';

var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = .05;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

//BackgroundJob.cancelAll();
let cnt = 0;
let self = this;
let trackLocation;
    const trackPosition = {
    jobKey: "trackPositionJob",
    job: () =>{
        let self=this;
        try{
            trackLocation();
        } catch (e) {
            saveBackGround();
           
        }
    },
};


const rad = (x) => {
    return x * Math.PI / 180;
};
const getDistance = (lat1, long1, lat2, long2) => {
    let R = 6378137;
    let dLat = rad(lat2 - lat1);
    let dLong = rad(long2 - long1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
};

const updateToken={
    jobKey: "refreshTokenJob",
    job: () =>refreshToken(),
}
    
BackgroundJob.register(trackPosition);
BackgroundJob.register(updateToken);

var timeout = 10000;

//var trackPositionSchedule = {};



//setTimeout(() => {

var  trackPositionSchedule = {
        jobKey: "trackPositionJob",
        //period: 90000,
         period: 10000,
        exact: true,
        allowExecutionInForeground: true
    }
//}, 1000);


var refreshTokenSchedule = {
    jobKey: "refreshTokenJob",
    period: 50000,
    exact: true,
    allowExecutionInForeground: true
}


refreshToken = function () {
    if (userdetails.userid !== "" && userdetails.userid!==null) {
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

class HomePlaces extends Component {
    constructor(props) {
        super(props)

        this.map = null;
        this.markers=[];
        this.state = {
            cnt:0,
            mapMode:'standard',
            groupname: '',
            isLoading: false,
            memberReady: false,
            region: [{
                latitude: LATITUDE,
                longitude: LONGITUDE,
                address: '',
                dateadded: '',
                distance:'0',
                id:'',
            }],
        };

        

    }




   
    async componentDidMount() {
        BackgroundJob.cancelAll();

      

       



        let self = this;
        trackLocation = function () {

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    console.log(self.state.region.length )
                    if (self.state.region.length ==1) {

                        await axios.get("https://us-central1-trackingbuddy-5598a.cloudfunctions.net/api/getAddress?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude)
                            .then(function (res) {
                                const coords = {
                                    latitude: position.coords.latitude,
                                    address: res.data,
                                    longitude: position.coords.longitude,
                                    distance: 0,
                                    dateadded: Moment().format('YYYY-MM-DD HH:mm:ss'),
                                    id: cnt,
                                }

                                self.setState({ region: self.state.region.concat(coords), cnt: self.state.cnt + 1 })
                            }).catch(function (error) {
                                console.log(error)
                            });

                        cnt++;

                    } else if (self.state.region.length >= 1) {
                        let distance = getDistance(self.state.region[self.state.region.length - 1].latitude, self.state.region[self.state.region.length - 1].longitude, position.coords.latitude, position.coords.longitude)
                            await axios.get("https://us-central1-trackingbuddy-5598a.cloudfunctions.net/api/getAddress?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude)
                                .then(function (res) {
                                    const coords = {
                                        latitude: position.coords.latitude,
                                        address: res.data,
                                        longitude: position.coords.longitude,
                                        distance: distance,
                                        dateadded: Moment().format('YYYY-MM-DD HH:mm:ss'),
                                        id: cnt,
                                    }

                                    self.setState({ region: self.state.region.concat(coords), cnt: self.state.cnt + 1 })
                                }).catch(function (error) {
                                    console.log(error)
                                });

                            cnt++;
                    }



                },
                (err) => {
                },
                { enableHighAccuracy: false, timeout: 10000 }
            );
            /*NetInfo.isConnected.fetch().done((isConnected) => {
                if (isConnected) {
                    self.props.pushLocationOnline();
                    self.props.saveLocationOnline();

                } else {
                    self.props.saveLocationOffline();
                }
            });*/

            

        }


        BackgroundJob.schedule(trackPositionSchedule);

    }


     componentWillMount() {

    }



    render() {
        const address = this.state.region.reverse().map(address => (
            <View key={address.id} style={{ borderBottomColor: 'red', borderBottomWidth: 1}} >

                    <Text >{address.address}</Text>
                <Text >{address.dateadded}</Text>
                <Text >{address.latitude} - {address.longitude}</Text>
                <Text >{address.distance}</Text>

               
            </View>


        ));
        return (

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                <Content padder>
                    <Text >Time out {timeout}</Text>
                    <View style={globalStyle.container}>
                        <List>
                            {address}
                        </List>


                    </View>
                </Content>
            </ScrollView>

        )
    }

}



const styles = StyleSheet.create({
    mainContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
    navBar: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        padding:2,
        backgroundColor: '#1eaec5',
        alignItems:'center',
        borderTopWidth:0,
    },
    
    mapContainer: {
      flex: 1,
      display: 'flex',
      borderBottomColor:'silver',
      borderBottomWidth:.5,
      
    },
    memberContainer: {
        height: 80,
        width:'100%',
        paddingTop:2,
        alignItems: 'center',
        bottom:0,
        position: 'absolute',
        backgroundColor: 'transparent',
        marginBottom:5,
  
        
    },
   
      map: {
        ...StyleSheet.absoluteFillObject,
      },
      marker: {
        alignSelf: 'center',
        width:55,
        height:68,
        margin:0,padding:0 
    },

    markerText: {
        textAlign: 'center',
        flex: 1,
        color: 'black',
        fontSize: 9,
        width: 45,
        marginLeft: 5,
        marginTop: 17,
        position: 'absolute',


    },
    
  });


const mapStateToProps = state => ({
    members: state.fetchMember.home_members,
    address: state.fetchLocation.address,
    //isLoading:state.fetchMember.isLoading,
    isConnected:state.fetchConnection.isConnected,
    
  })
  
  
  
HomePlaces = connect(mapStateToProps, { displayHomeMemberTemp})(HomePlaces);
  
export default HomePlaces;
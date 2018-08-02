
import React, { Component } from 'react';
import { AsyncStorage, NetInfo, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, FlatList } from 'react-native';
import { Drawer,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Thumbnail,Card,CardItem } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { ProviderPropType, Marker, AnimatedRegion,Animated,Polyline } from 'react-native-maps';
import Loading  from '../shared/Loading';
import Loader  from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';
import LeftDrawer from '../shared/LeftDrawer'
import { connect } from 'react-redux';
import { displayHomeMember  } from '../../actions/memberActions' ;
import { setConnection  } from '../../actions/connectionActions' ;
import { saveLocationOnline,pushLocationOnline  } from '../../actions/locationActions' ;
import firebase from 'react-native-firebase';
import type { Notification } from 'react-native-firebase';
var PushNotification = require('react-native-push-notification');

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
let trackLocation;
    const trackPosition = {
    jobKey: "trackPositionJob",
    job: () =>{
        let self=this;
        try{
            trackLocation();
        } catch (e) {
            saveLocationOffline();
           
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
    
const saveLocationOffline = async () =>   {
    let userid =  await AsyncStorage.getItem("userid");
    if (userid !== "" & userid !== null) {
        console.log("saving offline");
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    dateadded: Date.now()
                }
                const offlineLocation = await AsyncStorage.getItem('offlineLocation');
                let location = JSON.parse(offlineLocation);
                if (!location) {
                    location = [];
                }
                console.log(location)

                if (location.length >= 1) {
                    var loc = location[location.length - 1];
                    let distance = getDistance(loc.latitude, loc.longitude, coords.latitude, coords.longitude)
                    if (distance > 100) {
                        location.push(coords)
                         await AsyncStorage.setItem("offlineLocation", JSON.stringify(location))
                    }
                } else {
                    location.push(coords)
                     await AsyncStorage.setItem("offlineLocation", JSON.stringify(location))
                }




            },
            (err) => {
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 3000 }
        );
    }
}


const updateToken={
    jobKey: "refreshTokenJob",
    job: () =>refreshToken(),
}
    
BackgroundJob.register(trackPosition);
BackgroundJob.register(updateToken);

var trackPositionSchedule = {
    jobKey: "trackPositionJob",
    //period: 90000,
    period: 20000,
    exact: true,
    allowExecutionInForeground: true
}

var refreshTokenSchedule = {
    jobKey: "refreshTokenJob",
    period: 90000,
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

        this.state = {
            groupname: '',
            isLoading: false,
            memberReady: false,
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            centerMarker: [],
            markers: [],
        };

    }





    componentWillUnmount() {
        //BackgroundJob.cancelAll();
        this.notificationListener();
        
    }
    async componentDidMount() {
        BackgroundJob.cancelAll();

        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {

            PushNotification.localNotification({
                id: "1",
                autoCancel: true,
                largeIcon: "ic_launcher",
                smallIcon: "ic_notification",
                color: "#1eaec5",
                title: "Tracking Buddy",
                message: notification._body,
                playSound: true,
                soundName: 'default',
                number: '10',
            });


        });



        let self = this;
        trackLocation = function () {
            NetInfo.isConnected.fetch().done((isConnected) => {
                if (isConnected) {
                    self.props.pushLocationOnline();
                    self.props.saveLocationOnline();

                } else {
                    self.props.saveLocationOffline();
                }
            });
        }


        BackgroundJob.schedule(trackPositionSchedule);
        BackgroundJob.schedule(refreshTokenSchedule);

    }


    async fitToMap() {
        let coordinates = [];
        if (this.props.members.length == 1) {
            this.map.animateToRegion({
                latitude: this.props.members[0].coordinates.latitude,
                longitude: this.props.members[0].coordinates.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            })
        } else if (this.props.members.length > 1) {

            for (let i = 0; i < this.props.members.length; i++) {
                const coord = {
                    coordinates: {
                        latitude: this.props.members[i].coordinates.latitude,
                        longitude: this.props.members[i].coordinates.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                }
                coordinates = coordinates.concat(coord.coordinates);

            }
            this.map.fitToCoordinates(coordinates, { edgePadding: { top: 20, right: 20, bottom: 20, left: 20 }, animated: false })



        }

    }


    componentWillMount() {
        this.initialize();
    }

    async centerToMarker(latitude, longitude) {

        let center = [{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.00522,
            longitudeDelta: 0.00522 * ASPECT_RATIO
        }
        ];
        this.map.animateToRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        })

    }
    changeGroup = (groupname) => {
        this.setState({ isLoading: true })
        this.reload();
        this.setState({ groupname: groupname, isLoading: false });

    }
    reload() {
        let self = this;
        self.props.displayHomeMember().then(res => {
            setTimeout(() => {
                self.fitToMap();
                self.setState({ memberReady: true })
            }, 1000);
        });
    }


    initialize() {
        let self = this;
        setTimeout(() => {
            firebase.database().ref('users/' + userdetails.userid + '/members').on("value", (snapshot) => {
                if (userdetails.userid !== "" && userdetails.userid !== null) {
                    self.props.displayHomeMember().then(res => {
                        setTimeout(() => {

                            self.fitToMap();
                            self.setState({ memberReady: true })
                        }, 1000);
                    });
                }
            })
        }, 1000);
    }
    loading() {
        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <Loading />
                </Container>
            </Root>
        )
    }




    closeDrawer = () => {
        this.drawer._root.close()
    };
    openDrawer = () => {
        this.drawer._root.open()
    };

    renderMember() {
        const data = this.props.members;
        return (
            <FlatList
                keyExtractor={item => item.id}
                horizontal={true}
                data={data}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => this.centerToMarker(item.coordinates.latitude, item.coordinates.longitude)}>
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', width: 80, height: 60, margin: 2 }}>
                            <View style={globalStyle.listAvatarContainerSmall} >
                                {item.avatar === '' ? <Thumbnail onPress={() => this.centerToMarker(item.coordinates.latitude, item.coordinates.longitude)} style={globalStyle.listAvatar} source={{ uri: this.state.emptyPhoto }} /> :
                                    <Thumbnail onPress={() => this.centerToMarker(item.coordinates.latitude, item.coordinates.longitude)} style={globalStyle.listAvatarSmall} source={{ uri: item.avatar }} />
                                }
                            </View>
                            <Text numberOfLines={1} style={{ color: '#605f5f', fontSize: 13 }}>{item.firstname}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />)
    }

    ready() {




        const markers = this.props.members.map(marker => (
            <MapView.Marker key={marker.id}
                onLayout={() => this.fitToMap()}
                coordinate={marker.coordinates}
                title={marker.firstname}>
                <Image style={styles.marker}
                    source={require('../../images/marker.png')} />
                <Text style={styles.markerText}>{marker.firstname}</Text>

                <MapView.Callout >

                    <View style={styles.callOut}>
                        <View style={globalStyle.listAvatarContainerSmall} >
                            {marker.avatar === '' ? <Thumbnail style={globalStyle.listAvatar} source={{ uri: this.state.emptyPhoto }} /> :
                                <Thumbnail style={globalStyle.listAvatarSmall} source={{ uri: marker.avatar }} />
                            }
                        </View>
                        <Text style={styles.callOutText}>{marker.address}</Text></View>
                </MapView.Callout>
            </MapView.Marker>

        ));



        return (
            <Drawer leftDrawerWidth={40}
                tapToClose={true}
                ref={(ref) => { this.drawer = ref; }}
                content={<LeftDrawer closeDrawer={this.closeDrawer} navigation={this.props.navigation} />}
                onClose={() => this.closeDrawer()} >
                <Root>
                    <Loader loading={this.state.isLoading} />
                    <OfflineNotice />
                    <Container style={globalStyle.containerWrapper}>


                        <Header style={globalStyle.header}>
                            <Left style={globalStyle.headerMenu} >
                                <Button transparent onPress={() => this.openDrawer()} >
                                    <Icon size={30} name='menu' style={globalStyle.headerLeftMenuIcon} />
                                </Button>
                            </Left>
                            <Body>
                                <Title style={globalStyle.headerTitle}>Home</Title>
                            </Body>
                            <Right style={globalStyle.headerRight} >
                                <TouchableOpacity style={{ marginRight: 15 }} onPress={() => this.fitToMap()}>
                                    <MaterialIcons size={25} style={{ color: 'white' }} name="my-location" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('SelectGroup', { changeGroup: this.changeGroup })}>
                                    <Ionicons size={25} style={{ color: 'white' }} name="md-swap" />
                                </TouchableOpacity>



                            </Right>

                        </Header>

                        <View style={styles.mainContainer}>

                            <View style={styles.mapContainer}>
                                    <Image  style={styles.marker}
                                        source={require('../../images/marker.png')} />
                                <MapView ref={map => { this.map = map }}
                                    loadingEnabled={true}
                                    zoomEnabled={true}
                                    style={styles.map}
                                    loadingEnabled={false}
                                >
                                    {markers}

                                </MapView>
                                {this.state.groupname !== '' &&
                                    <View style={{ flexDirection: 'column', marginVertical: 5, width: '100%', alignItems: 'center', position: 'absolute', bottom: 0 }}>
                                        <Text style={{ paddingTop: 5, opacity: .5, borderRadius: 15, backgroundColor: 'black', width: 200, height: 30, color: 'white', textAlign: 'center', alignSelf: "center", flexDirection: 'column' }}>{this.state.groupname} Group</Text>
                                    </View>
                                }
                            </View>






                            <View style={styles.memberContainer} >
                                {this.state.memberReady &&
                                    this.renderMember()
                                }
                            </View>
                        </View>





                    </Container>
                </Root>
            </Drawer>

        )
    }



    render() {
        return this.ready();


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
        height: 63,
        paddingTop:2,
        alignItems:'center',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
      marker: {
        alignSelf: 'center',
        width:55,
        height:65,
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
    callOut: {
        width: 100,
        alignItems:'center',
    },
    callOutText:{
        fontSize: 10,
        textAlign: 'center',
    }
  });


const mapStateToProps = state => ({
    members: state.fetchMember.home_members,
    //isLoading:state.fetchMember.isLoading,
    isConnected:state.fetchConnection.isConnected,
    
  })
  
  
  
HomePlaces=connect(mapStateToProps,{displayHomeMember,setConnection,saveLocationOnline,pushLocationOnline})(HomePlaces);
  
export default HomePlaces;
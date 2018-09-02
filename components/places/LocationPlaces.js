
import React, { Component } from 'react';
import { TouchableOpacity,  Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, FlatList, Dimensions } from 'react-native';
import {  Separator, Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, Left, Right, ListItem, Footer, FooterTab } from 'native-base';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker'
import Entypo from 'react-native-vector-icons/Entypo';
import { displayLocationsList, displayLocationsMap, displayLocationsTrack } from '../../redux/actions/locationActions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, Polyline,  PROVIDER_GOOGLE } from 'react-native-maps';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Loading from '../shared/Loading';
import Loader from '../shared/Loader';
import OfflineNotice from '../shared/OfflineNotice';

import Moment from 'moment';
var userdetails = require('../shared/userDetails');

var globalStyle = require('../../assets/style/GlobalStyle');
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = .05;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class LocationPlaces extends Component {
    constructor(props) {
        super(props)
        this.map = null;
        let plot;
        this.maptrack = null;
        this.markers = [];
        this.state = {
            polyline: [],
            trackpolyline: [],
            route: [],
            index:0,
            address: '',
            routestart:'',
            pageStyle:'map',
            loading: true,
            mapMode: 'standard',
            mapTrackMode: 'standard',
            busy: false,
            dateFilter: Moment().format("YYYY-MM-DD").toString(),
            dateDisplay: Moment().format('ddd, DD MMM YYYY'),
        };

        this.setDate = this.setDate.bind(this);
    }
   
    componentWillMount() {
        this.setState({  busy: true })
        this.initialize();
    }
        
    initialize() {
       

        this.props.displayLocationsMap(this.props.navigation.state.params.uid, this.state.dateFilter).then(res => {
                this.setState({ loading: false, busy: false })
            setTimeout(() => {
                this.fitToMap();
                }, 100);
        })

    }

    async onDateChange(date) {
        await this.setState({ dateDisplay: date, dateFilter: Moment(new Date(date)).format('YYYY-MM-DD') , busy: true}) 
        await this.changePageStyle(this.state.pageStyle);
    }

    
    async changePageStyle(style) {
       
        await this.setState({ pageStyle: style, busy: true });
        if (style == "list") {
            this.props.displayLocationsList(this.props.navigation.state.params.uid, this.state.dateFilter).then(res => {
                this.setState({ busy: false })
            })
        } else if (style == "map") {
            this.props.displayLocationsMap(this.props.navigation.state.params.uid, this.state.dateFilter).then(res => {
                this.setState({ busy: false })
                setTimeout(() => {
                    this.fitToMap();


                }, 100);
            })
        } else if (style == "track") {
            this.setState({ busy: false })
            this.props.displayLocationsTrack(this.props.navigation.state.params.uid, this.state.dateFilter).then(res => {
                this.setState({ busy: false, routestart:'' });
            })
        }
    }
    
    startRoute() {
        let i = 0;
        var coordinates = [];
        var coords = [];
        let self = this;
        this.setState({  routestart: '0' });
            plot = setInterval(function myTimer() {

                const coord = {
                    id: i,
                    coordinates: {
                        latitude: self.props.locationstrack[i].latitude,
                        longitude: self.props.locationstrack[i].longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                }
                coordinates = coordinates.concat(coord.coordinates);
                coords = coords.concat(coord);

                self.setState({ trackpolyline: coordinates, route: coords })

                self.maptrack.animateToRegion({
                    latitude: self.props.locationstrack[i].latitude,
                    longitude: self.props.locationstrack[i].longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005
                })

                i++;
                if (i >= self.props.locationstrack.length) {
                    clearInterval(plot);
                    self.setState({ routestart: '' });
                }
            }, 1500);
        
    }

    stopRoute() {
        clearInterval(plot);
        this.setState({ routestart: '' });
    }
    loading(){
        return (
          <Loading/>
        )
    }
     centerToMarker(mode) {
         if (mode == "B") {
             if (this.state.index == this.props.locationsmap.length) {
                 this.setState({ index: 1 });
             } else {
                 this.setState({ index: this.state.index + 1 });
             }
         } else if (mode == "N") {
             if (this.state.index == 1) {
                 this.setState({ index: this.props.locationsmap.length });
             } else {
                 this.setState({ index: this.state.index - 1 });
             }

         } else if (mode == "S") {
             this.setState({ index: this.props.locationsmap.length});
         }
        

         setTimeout(() => {
             this.setState({ address: this.props.locationsmap[this.state.index - 1].address });
             this.map.animateToRegion({
                 latitude: this.props.locationsmap[this.state.index - 1].coordinates.latitude,
                 longitude: this.props.locationsmap[this.state.index - 1].coordinates.longitude,
                 latitudeDelta: 0.005,
                 longitudeDelta: 0.005
             })
             this.markers[this.state.index].showCallout();
         }, 500);

    }

    fitToMap() {
        
        this.setState({ polyline: [],address:'' })
        let coordinates = [];
         if (this.props.locationsmap.length == 1) {
             this.map.animateToRegion({
                 latitude: this.props.locationsmap[0].coordinates.latitude,
                 longitude: this.props.locationsmap[0].coordinates.longitude,
                 latitudeDelta: 0.005,
                 longitudeDelta: 0.005
             })

         } else if (this.props.locationsmap.length > 1) {

             for (let i = 0; i < this.props.locationsmap.length; i++) {
                 const coord = {
                     coordinates: {
                         latitude: this.props.locationsmap[i].coordinates.latitude,
                         longitude: this.props.locationsmap[i].coordinates.longitude,
                         latitudeDelta: LATITUDE_DELTA,
                         longitudeDelta: LONGITUDE_DELTA,
                     }
                 }

                 coordinates = coordinates.concat(coord.coordinates);
             }
             this.setState({ polyline: coordinates })
             this.map.fitToCoordinates(coordinates, { edgePadding: { top: 100, right: 10, bottom: 100, left: 10 }, animated: false })

         } else {
             this.setState({ polyline: [] })
        }

       


    }


    fitToMapTrack() {

        let coordinates = [];
        if (this.props.locationstrack.length == 1) {
            this.map.animateToRegion({
                latitude: this.props.locationstrack[0].latitude,
                longitude: this.props.locationstrack[0].longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            })

        } else if (this.props.locationstrack.length > 1) {

            for (let i = 0; i < this.props.locationstrack.length; i++) {
                const coord = {
                    coordinates: {
                        latitude: this.props.locationstrack[i].latitude,
                        longitude: this.props.locationstrack[i].longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                }

                coordinates = coordinates.concat(coord.coordinates);
            }
            this.setState({ polyline: coordinates })
            this.maptrack.fitToCoordinates(coordinates, { edgePadding: { top: 200, right: 200, bottom: 200, left: 200 }, animated: false })


       
        }




    }

    

    renderLocation(){
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                <Content padder>
                    <View style={globalStyle.container}>
                        <List>
            <FlatList
            style={{flex:1}}
                keyExtractor={item => item.id.toString()}
                                data={this.props.locationslist}
                renderItem={({ item}) => (
                    <ListItem key={item.id.toString()} avatar style={globalStyle.listItem} >
                    <Left style={globalStyle.listLeft}>
                            <SimpleLineIcons size={30} style={{ color:'#16a085'}}    name='location-pin' />
                           </Left>
                    <Body style={globalStyle.listBody} >
                        <Text numberOfLines={1} style={globalStyle.listHeading}>{item.address}</Text>
                            <Text note numberOfLines={1} >{item.datemovement}</Text>
                    </Body>
                </ListItem>
                ) }
            />
                        </List>


                    </View>
                </Content>
            </ScrollView>)
     }
    async changeMapMode() {
        if (this.state.mapMode == "standard") {
            this.setState({
                mapMode: 'satellite'
            });
        } else {
            this.setState({
                mapMode: 'standard'
            });
        }

    }

    async changeMapModeTrack() {
        if (this.state.mapTrackMode == "standard") {
            this.setState({
                mapTrackMode: 'satellite'
            });
        } else {
            this.setState({
                mapTrackMode: 'standard'
            });
        }

    }
    renderMap() {
        const markers = this.props.locationsmap.map((marker) => (
            <MapView.Marker
                key={marker.id}
                ref={ref => { this.markers[marker.id] = ref }}
                coordinate={marker.coordinates}
                >
                <Image style={styles.marker}
                    source={require('../../images/markercircle.png')} />
                <Text style={styles.markerText}>{marker.label}</Text>
                <MapView.Callout tooltip={true} >
                    <View style={[globalStyle.callOutFix, { height: 60 }]} >
                        <View style={globalStyle.callOutContainerFix} >
                            <Text numberOfLines={2} style={globalStyle.callOutText}>{marker.address}</Text>
                            <Text style={globalStyle.callOutText}>{marker.datemovement}</Text>
                        </View>

                    </View>


                </MapView.Callout>
            </MapView.Marker>

        ));
        return (
            <View style={styles.mainContainer}>
            <View style={styles.mapContainer}>
                <Image style={{opacity:0}}
                    source={require('../../images/markercircle.png')} />
                <MapView ref={map => { this.map = map }} mapType={this.state.mapMode}
                    style={styles.map}>
                        {markers}
                    <MapView.Polyline 
                        style={{ zIndex: 99999 }}
                        coordinates={this.state.polyline}
                        strokeWidth={1}
                        strokeColor="#932424" />
                   
                   

                </MapView>
                
                </View>
                <View style={[globalStyle.mapMenu, {top:50}]}>
                    <TouchableOpacity onPress={() => this.fitToMap()}>
                        <View style={globalStyle.mapMenuCircle} >
                            <MaterialIcons size={25} style={{ color: '#2c3e50' }} name="zoom-out-map" />
                        </View>
                        <Text style={globalStyle.mapMenuLabel}>Center Map</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.changeMapMode()}>
                        <View style={globalStyle.mapMenuCircle} >
                            <Entypo size={25} style={{ color: '#2c3e50' }} name="globe" />
                        </View>
                        <Text style={globalStyle.mapMenuLabel}>Map Style</Text>
                    </TouchableOpacity>




                </View>
                <View style={styles.searchContainer} >
                    <View style={{ left: '1%', height: 45, width: '98%', flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'silver', position: 'absolute' }} >
                        <DatePicker
                            style={{ flex: 1 }}
                            mode="date"
                            date={this.state.dateDisplay}
                            format="ddd, DD MMM YYYY"
                            placeholder="Provide date history"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            iconSource={require('../../images/today.png')}
                            customStyles={{
                                dateInput: {
                                    borderWidth: 0,

                                    
                                },
                                dateText: {
                                    fontSize:17
                                },
                                placeholderText: {
                                    fontSize: 17
                                }
                            }}
                            onDateChange={(date) => this.onDateChange(date)}
                            
                        />
                        
                    </View>
                </View>
            
                {this.props.locationsmap.length > 0 &&
                    <View style={styles.addressContainer} >
                        <View style={{ height: 35, flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                            {this.state.address != '' &&
                                <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => this.centerToMarker('B')}>
                            <Ionicons style={{ fontSize: 38, color: 'white' }} name='ios-arrow-dropleft' />
                            <Text style={{ color: 'white' }}>Back</Text>
                                </TouchableOpacity>
                            }
                            {this.state.address == '' &&
                                <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => this.centerToMarker('S')}>
                            <EvilIcons style={{ fontSize: 48, color: 'white' }} name='play' />
                            <Text style={{color:'white'}}>Start</Text>
                                </TouchableOpacity>
                            }

                            {this.state.address != '' &&
                                <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => this.centerToMarker('N')}>
                            <Ionicons style={{ fontSize: 38, color: 'white' }} name='ios-arrow-dropright' />
                            <Text style={{ color: 'white' }}>Next</Text>
                                </TouchableOpacity>
                            }


                        </View >
                    </View>
                }
            </View >

            )
    }
    async renderRoute() {
        console.log(this.props.locationsmap)
        return this.props.locationsmap.map((r) => (
            <MapView.Marker
                key={r.id}
                coordinate={r.coordinates}
            >

            </MapView.Marker>
        ));


    }
    renderTrack() {
        const route = this.state.route.map((r) => (
            <MapView.Marker
                key={r.id}
                coordinate={r.coordinates}
            >
                <Image style={styles.markertransparent}
                    source={require('../../images/icons8-marker-16.png')} />
            </MapView.Marker>
        ));
        return (
            <View style={styles.mainContainer}>
                <View style={styles.mapContainer}>
                    <MapView mapType={this.state.mapTrackMode} ref={map => { this.maptrack = map }} 
                        style={styles.map}>
                        <MapView.Polyline
                            style={{ zIndex: 99999 }}
                            coordinates={this.state.trackpolyline}
                            strokeWidth={1}
                            strokeColor="#932424" />
                        {
                            route
                        }



                    </MapView>

                </View>
                <View style={[globalStyle.mapMenu, { top: 50 }]}>
                    <TouchableOpacity onPress={() => this.fitToMapTrack()}>
                        <View style={globalStyle.mapMenuCircle} >
                            <MaterialIcons size={25} style={{ color: '#2c3e50' }} name="zoom-out-map" />
                        </View>
                        <Text style={globalStyle.mapMenuLabel}>Center Map</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.changeMapModeTrack()}>
                        <View style={globalStyle.mapMenuCircle} >
                            <Entypo size={25} style={{ color: '#2c3e50' }} name="globe" />
                        </View>
                        <Text style={globalStyle.mapMenuLabel}>Map Style</Text>
                    </TouchableOpacity>




                </View>
                {this.props.locationstrack.length > 0 &&
                    <View style={styles.addressContainer} >
                    <View style={{ height: 35, flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        {this.state.routestart == '' &&
                            <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => this.startRoute()}>
                            <EvilIcons style={{ fontSize: 48, color: 'white' }} name='play' />
                            <Text style={{ color: 'white' }}>Start</Text>
                            </TouchableOpacity>
                        }

                        {this.state.routestart != '' &&
                            <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => this.stopRoute()}>
                            <Feather style={{ fontSize: 37, color: 'white' }} name='stop-circle' />
                            <Text style={{ color: 'white' }}>Stop</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                }
            </View >

        )
    }
    setDate(newDate) {
        this.setState({ chosenDate: Moment(newDate).format('DD-MMM-YYYY')  });
    }
    ready(){
        
        return (
            <View style={styles.mainContainer}>
               
                

                {
                    this.state.pageStyle == 'list' ?  this.renderLocation() :
                        this.state.pageStyle == 'map' ? this.renderMap() :
                            this.renderTrack()
                }
                
                <Footer >
                    <FooterTab style={{ backgroundColor: '#16a085' }}>
                        
                        <Button vertical onPress={() => this.changePageStyle('map')}>
                            <Icon style={{ color: 'white' }} name="map" />
                            <Text style={{ color: 'white' }} >Map</Text>
                        </Button>
                        <Button vertical onPress={() => this.changePageStyle('track')}>
                            <Icon style={{ color: 'white' }} name="navigate" />
                            <Text style={{ color: 'white' }} >Route</Text>
                        </Button>
                        <Button vertical onPress={() => this.changePageStyle('list')}>
                            <Icon style={{ color: 'white' }} name="list" />
                            <Text style={{ color: 'white' }}>List</Text>
                        </Button>
                    </FooterTab>
                </Footer>          
            </View>
        )
    }

    render() {

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <OfflineNotice />
                    <Loader loading={this.state.busy} />
                    <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />

                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>Location History</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
                            
                        </Right>
                    </Header>
                    {
                        this.state.loading ? this.loading() :
                            this.ready()
                    }

                </Container>
            </Root>
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
        padding: 2,
        backgroundColor: '#1eaec5',
        alignItems: 'center',
        borderTopWidth: 0,
    },

    mapContainer: {
        flex: 1,
        display: 'flex',
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },
    marker: {
        alignSelf: 'center',
        width: 20,
        height: 20,
        margin: 0, padding: 0,
    },
    markertransparent: {
        alignSelf: 'center',
        width: 20,
        height: 20,
        margin: 0, padding: 0,
    },

    markerText: {
        textAlign: 'center',
        flex: 1,
        color: '#932424',
        fontSize: 7,
        width: 20,
        marginTop: 4,
        position: 'absolute',


    },
    searchContainer: {
        height: 48,
        width: '100%',
        position: 'absolute',
        backgroundColor: 'white',
        top: 0,
        flex: 1,
        
    },
    addressContainer: {
        height: 65,
        width: '100%',
        paddingTop: 6,
        alignItems: 'center',
        bottom: 0,
        position: 'absolute',
        backgroundColor: '#2c3e50',
        alignItems: 'center', padding: 5,
        borderTopWidth: 1,
        borderTopColor:'#ecf0f1',

    },

});

const mapStateToProps = state => ({
    locationslist: state.fetchLocation.locationslist,
    locationsmap: state.fetchLocation.locationsmap,
    locationstrack: state.fetchLocation.locationstrack,
    isLoading: state.fetchLocation.isLoading,
  })
  
LocationPlaces = connect(mapStateToProps, { displayLocationsList, displayLocationsMap, displayLocationsTrack})(LocationPlaces);
  
export default LocationPlaces;


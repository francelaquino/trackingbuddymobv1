
import React, { Component } from 'react';
import { TouchableOpacity,  Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, FlatList, Dimensions } from 'react-native';
import {  Separator, Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, Left, Right, ListItem, Footer, FooterTab } from 'native-base';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker'
import Entypo from 'react-native-vector-icons/Entypo';
import { displayLocationsList, displayLocationsMap } from '../../redux/actions/locationActions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, Polyline,  PROVIDER_GOOGLE } from 'react-native-maps';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
        this.state = {
            polyline:[],
            pageStyle:'map',
            loading: true,
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
                console.log(this.props.locationsmap)
                        this.fitToMap();
                }, 100);
        })

    }

    async onDateChange(date) {
        await this.setState({ dateFilter: date, dateDisplay: Moment(date).format('ddd, DD MMM YYYY'), busy: true }) 
        await this.initialize();
    }
    async changePageStyle(style) {
        await this.setState({ pageStyle: style, busy: true });
        if (style == "list") {
            this.props.displayLocationsList(this.props.navigation.state.params.uid, this.state.dateFilter).then(res => {
                this.setState({ busy: false })
            })
        } else {
            this.props.displayLocationsMap(this.props.navigation.state.params.uid, this.state.dateFilter).then(res => {
                    this.setState({ busy: false })
                    setTimeout(() => {
                            this.fitToMap();

                    }, 100);
            })
        }
    }
    
    
    loading(){
        return (
          <Loading/>
        )
    }
    fitToMap() {
        this.setState({ polyline: [] })
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
             this.map.fitToCoordinates(coordinates, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })

         } else {
             this.setState({ polyline: [] })
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

    renderMap() {
        const markers = this.props.locationsmap.map((marker) => (
            <MapView.Marker
                key={marker.id}
                coordinate={marker.coordinates}>
                <Image style={styles.marker}
                    source={require('../../images/markercircle.png')} />
                <Text style={styles.markerText}>{marker.id}</Text>
                <MapView.Callout tooltip={true} >
                    <View style={[globalStyle.callOutFix, { height: 40 }]} >
                        <View style={globalStyle.callOutContainerFix} >
                            <Text numberOfLines={2} style={globalStyle.callOutText}>{marker.address}</Text>
                        </View>

                    </View>


                </MapView.Callout>
            </MapView.Marker>

        ));
        return (
            <View style={styles.mapContainer}>
                <Image style={{opacity:0}}
                    source={require('../../images/markercircle.png')} />
                <MapView ref={map => { this.map = map }}
                    style={styles.map}>
                    
                    <MapView.Polyline 
                        style={{ zIndex: 99999 }}
                        coordinates={this.state.polyline}
                        strokeWidth={2}
                        strokeColor="#932424" />
                    {markers}
                   

                </MapView>
            </View>
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
                        this.renderMap()
                }
                
                <Footer >
                    <FooterTab style={{ backgroundColor: '#16a085' }}>
                        
                        <Button vertical onPress={() => this.changePageStyle('map')}>
                            <Icon style={{ color: 'white' }} name="map" />
                            <Text style={{ color: 'white' }} >Map</Text>
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
                            <Title>{this.state.dateDisplay}</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
                            <DatePicker
                                style={{}}
                                date={this.state.dateFilter}
                                mode="date"
                                placeholder="select date"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                iconSource={require('../../images/today.png')}
                                hideText={true}
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        top: 4,
                                        right: 0,
                                        marginLeft: 0
                                    },
                                }}
                                onDateChange={(date) => this.onDateChange(date) }
                            />
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
        width: 40,
        height: 40,
        margin: 0, padding: 0
    },

    markerText: {
        textAlign: 'center',
        flex: 1,
        color: 'black',
        fontSize: 12,
        width: 40,
        marginTop: 10,
        position: 'absolute',


    },

});

const mapStateToProps = state => ({
    locationslist: state.fetchLocation.locationslist,
    locationsmap: state.fetchLocation.locationsmap,
    isLoading: state.fetchLocation.isLoading,
  })
  
LocationPlaces = connect(mapStateToProps, { displayLocationsList, displayLocationsMap})(LocationPlaces);
  
export default LocationPlaces;


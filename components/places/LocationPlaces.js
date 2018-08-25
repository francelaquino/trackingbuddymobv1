
import React, { Component } from 'react';
import { TouchableOpacity,  Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, FlatList, Dimensions } from 'react-native';
import { DatePicker, Separator, Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, Left, Right, ListItem, Footer, FooterTab } from 'native-base';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import { displayLocations  } from '../../redux/actions/locationActions' ;
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
            busy:false,
            dateFilter: Moment().format("YYYY-MM-DD"),
            dateDisplay: Moment().format('DD-MMM-YYYY'),
        };
    
    }
   
    componentWillMount() {
        this.initialize();
    }
        
    initialize() {

        this.props.displayLocations(this.props.navigation.state.params.uid, this.state.dateFilter).then(res => {
            if (res == true) {
                this.setState({ loading: false, busy: false })
                setTimeout(() => {
                    if (this.state.pageStyle != "list") {
                        this.fitToMap();
                    }

                }, 100);
            }
        })

    }
    async changePageStyle(style) {
        await this.setState({ pageStyle: style, busy: true });
        this.props.displayLocations(this.props.navigation.state.params.uid, this.state.dateFilter).then(res => {
            if (res == true) {
                this.setState({  busy: false })
                setTimeout(() => {
                    if (this.state.pageStyle != "list") {
                        this.fitToMap();
                    }

                }, 100);
            }
        })
    }
    async addDate() {
        await this.setState({ dateFilter: Moment(this.state.dateFilter).add(1, 'days').format("YYYY-MM-DD"),busy:true });
        await this.setState({ dateDisplay: Moment(this.state.dateFilter).format("DD-MMM-YYYY") });
        await this.initialize();
    }
    async subDate() {
        await this.setState({ dateFilter: Moment(this.state.dateFilter).add(-1, 'days').format("YYYY-MM-DD"), busy: true});
        await this.setState({ dateDisplay: Moment(this.state.dateFilter).format("DD-MMM-YYYY") });
        await this.initialize();
    }
    loading(){
        return (
          <Loading/>
        )
    }
     fitToMap() {
         let coordinates = [];
        if (this.props.locations.length == 1) {
            this.map.animateToRegion({
                latitude: this.props.locations[0].coordinates.latitude,
                longitude: this.props.locations[0].coordinates.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            })

        } else if (this.props.locations.length > 1) {

            for (let i = 0; i < this.props.locations.length; i++) {
                const coord = {
                    coordinates: {
                        latitude: this.props.locations[i].coordinates.latitude,
                        longitude: this.props.locations[i].coordinates.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                }

                coordinates = coordinates.concat(coord.coordinates);
            }
            this.setState({ polyline: coordinates })
            this.map.fitToCoordinates(coordinates, { edgePadding: { top: 200, right: 100, bottom: 200, left: 100 }, animated: false })




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
                data={this.props.locations}
                renderItem={({ item }) => (
                    <ListItem key={item.id.toString()} avatar style={globalStyle.listItem} button onPress={() => { this.props.navigation.navigate("LocationView", { location: item }) }}>
                    <Left style={globalStyle.listLeft}>
                            <SimpleLineIcons size={30} style={{ color:'#16a085'}}    name='location-pin' />
                           </Left>
                    <Body style={globalStyle.listBody} >
                        <Text numberOfLines={1} style={globalStyle.listHeading}>{item.address}</Text>
                            <Text note numberOfLines={1} >{item.datemovement}</Text>
                    </Body>
                    <Right style={globalStyle.listRight}>
                            <SimpleLineIcons  style={globalStyle.listRightOptionIcon}   name='arrow-right' />
                    </Right>
                </ListItem>
                ) }
            />
                        </List>


                    </View>
                </Content>
            </ScrollView>)
     }

    renderMap() {
        const markers = this.props.locations.map((marker) => (
            <MapView.Marker
                key={marker.id}
                coordinate={marker.coordinates}>
                <Image style={styles.marker}
                    source={require('../../images/markercircle.png')} />
                <Text style={styles.markerText}>{marker.id}</Text>
                <MapView.Callout tooltip={true} >
                    <View style={[globalStyle.callOutFix, { height: 80 }]} >
                        <View style={globalStyle.callOutContainerFix} >
                            <Text numberOfLines={2} style={globalStyle.callOutText}>{marker.address}</Text>
                            <Text numberOfLines={2} style={globalStyle.callOutText}>{marker.datemovement}</Text>
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
                    {markers}
                    <MapView.Polyline
                        coordinates={this.state.polyline}
                        strokeWidth={3}
                        strokeColor="#932424" />

                   

                </MapView>
            </View>
            )
    }
    ready(){
        
        return (
            <View style={styles.mainContainer}>
               
                <View style={{
                    height: 50, width: '100%', backgroundColor: '#16a085', borderTopColor: 'white', borderTopWidth: 1, padding: 5
                }}>
                    <View style={{ height: 35, flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <View style={{ alignItems: 'center',marginRight:10, }} >
                            <Text style={{ fontSize: 17, color: 'white' }} >{this.state.dateDisplay}</Text>
                        </View >
                        <TouchableOpacity onPress={() => this.subDate()}>
                            <Ionicons style={{ fontSize: 38, marginRight: 5, color: 'white' }} name='ios-arrow-dropleft' />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => this.addDate()}>
                            <Ionicons style={{ fontSize: 38, color: 'white', marginLeft: 5 }} name='ios-arrow-dropright' />
                        </TouchableOpacity>
                       

                    </View >
                    
                </View>

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
                            <Title>LOCATIONS</Title>
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
    locations: state.fetchLocation.locations,
    isLoading: state.fetchLocation.isLoading,
  })
  
  LocationPlaces=connect(mapStateToProps,{displayLocations})(LocationPlaces);
  
export default LocationPlaces;


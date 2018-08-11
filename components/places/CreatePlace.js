
import React, { Component } from 'react';
import { NetInfo, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, Modal, TouchableHighlight } from 'react-native';
import { Drawer,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Thumbnail,Card,Form } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { ProviderPropType, Marker, AnimatedRegion, Animated, Polyline } from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import Loading  from '../shared/Loading';
import Loader from '../shared/Loader';
import OfflineNotice from '../shared/OfflineNotice';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const LATITUDE_DELTA = 0.00522;
const LONGITUDE_DELTA = Dimensions.get("window").width / Dimensions.get("window").height * LATITUDE_DELTA;




var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');

var self;

class CreatePlace extends Component {
    constructor(props) {
        super(props)
        this.map = null;
        this.state = {
            loading: false,
            modalVisible:false,
            placename: '',
            address: '',
            region: {
                  latitude: -37.78825,
                longitude: -122.4324,
                latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA
                },
            isMapReady: false,
        };

      }
    

    
    /*onPress = {(e) => this.setMarkerLocation(e.nativeEvent)}
    setMarkerLocation(location) {
        setTimeout(() => {
            let coords = {
                lat: location.coordinate.latitude,
                lng: location.coordinate.longitude,
            };
            Geocoder.geocodePosition(coords).then(res => {
                let address = res[1].formattedAddress;
                this.setState({
                    address: address,
                    region: {
                        latitude: location.coordinate.latitude,
                        longitude: location.coordinate.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    }
                })
            })
            this.fitToMap()

        },0)
        

       

       

    }*/

    fitToMap() {
       
        setTimeout(() => {
            try {
                this.map.animateToRegion({
                    latitude: this.state.region.latitude,
                    longitude: this.state.region.longitude,
                    latitudeDelta: this.state.region.latitudeDelta,
                    longitudeDelta: this.state.region.longitudeDelta
                })
            } catch(e) {

            }
            }, 0);
        
           

    }

 
   
    async componentDidMount(){
        await this.getCurrentPosition();

        self = this;

    }



    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    showModal() {
        this.setState({ modalVisible: true });
    }


    getCurrentPosition() {
        try {
          navigator.geolocation.getCurrentPosition(
              (position) => {
              const region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              };
              this.setState({region:{
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
              },
                  

                 
                  })
                  let coords = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                  };

                  Geocoder.geocodePosition(coords).then(res => {
                      this.setState({
                          address: res[1].formattedAddress,
                          isMapReady: true,

                      })
                      
                  })

            },
            (error) => {
              },
                { enableHighAccuracy: false, timeout: 10000 }

          );
        } catch(e) {
        }
    }

   
    loading(){
        return (
          <Root>
          <Container style={globalStyle.containerWrapper}>
          <Loading/>
          </Container>
          </Root>
        )
    }
  
    updateLocation(details) {
            this.setState({
                address: details.formatted_address,
                region: {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }
            });

            
        
         
    }
    onRegionChangeComplete = region => {
        let coords = {
            lat: region.latitude,
            lng: region.longitude,
        };
        Geocoder.geocodePosition(coords).then(res => {
            let address = res[1].formattedAddress;
            this.setState({
                address: address,
                region: {
                    latitude: region.latitude,
                    longitude: region.longitude,
                    latitudeDelta: region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta
                }
            });
        })
       
      
        

    }
    ready(){

        const { region } = this.state;

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                <Loader loading={this.state.loading} />
                <OfflineNotice/>
               
                    
                        <Header style={globalStyle.header}>
                            <Left style={globalStyle.headerLeft} >
                                <Button transparent onPress={()=> {this.props.navigation.goBack()}} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                                </Button> 
                            </Left>
                            <Body style={globalStyle.headerBody}>
                                <Title>ADD PLACE</Title>
                            </Body>
                            <Right style={globalStyle.headerRight}>
                        </Right>
                    </Header>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                        <View style={styles.mainContainer}>
                            <View style={styles.searchContainer}>
                                <GooglePlacesAutocomplete
                                    ref={c => this.googlePlacesAutocomplete = c}

                                    placeholder='Search Location'
                                    minLength={2} // minimum length of text to search
                                    autoFocus={false}
                                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                    listViewDisplayed='auto'    // true/false/undefined
                                    fetchDetails={true}
                                    renderDescription={row => row.description} // custom description render
                                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                       
                                        this.updateLocation(details);
                                        this.googlePlacesAutocomplete._handleChangeText('')
                                       
                                    }}
                                   
                                    getDefaultValue={() => ''}

                                    query={{
                                        // available options: https://developers.google.com/places/web-service/autocomplete
                                        key: 'AIzaSyCHZ-obEHL8TTP4_8vPfQKAyzvRrrlmi5Q',
                                        language: 'en', // language of the results
                                    }}

                                    styles={{
                                        textInputContainer: {
                                            width: '100%',
                                            height: 56,
                                            backgroundColor: '#16a085',
                                            borderBottomWidth:0,
                                            
                                        },
                                        textInput: {
                                            height:40,
                                        },
                                        description: {
                                            color:'black'
                                        },
                                    }}
                                    
                                    currentLocation={false} 
                                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                    GoogleReverseGeocodingQuery={{
                                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                    }}
                                    GooglePlacesSearchQuery={{
                                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                        rankby: 'distance',
                                        types: 'food'
                                    }}

                                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

                                    debounce={200}
                                    renderRightButton={() => <Feather onPress={() => { this.googlePlacesAutocomplete._handleChangeText('') }} size={25} style={{ color: 'white', height: 30, marginTop: 13, marginRight: 15 }} name='delete' />}
                                />
                                
                            </View>
                            <View style={styles.mapContainer}>
                                <Image style={globalStyle.marker}
                                    source={require('../../images/placemarker.png')} />
                                <MapView ref={map => { this.map = map }}
                                    zoomEnabled={true}
                                    onLayout={() => this.fitToMap()}
                                    onRegionChangeComplete={this.onRegionChangeComplete}
                                    scrollEnabled={true}
                                    style={StyleSheet.absoluteFill}
                                    textStyle={{ color: '#bc8b00' }}
                                    loadingEnabled={true}
                                    showsMyLocationButton={true}
                                   >

                                </MapView>
                                
                               
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: -150 }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("SavePlace", { region: this.state.region, address: this.state.address })}>
                                    <View style={globalStyle.callOutFix} >
                                        <View style={globalStyle.callOutContainerFix} >
                                            <Text numberOfLines={2} style={globalStyle.callOutText}>{this.state.address}</Text>
                                        </View>
                                        <View style={globalStyle.callOutArrow}>
                                            <SimpleLineIcons style={{ fontSize: 13, color: '#1abc9c' }} name='arrow-right' />
                                        </View>

                                        </View>
                                    </TouchableOpacity>
                                    <Image style={globalStyle.marker}
                                        source={require('../../images/placemarker.png')} />
                                </View>
                                    
                                    
                            </View>
                           
                        </View>


                    </ScrollView  >
                    
                    
                       


                </Container>
        </Root>
            
        )
    }



    render() {
            if(!this.state.isMapReady){
                return this.loading();
            }else{
                return this.ready();
            }
        

  }
}



const styles = StyleSheet.create({
    mainContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
    
    mapContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor:'white',
        position: 'absolute',
        zIndex: 9999,
        borderRadius: 5,
        borderWidth: 0,


    },
  });

  

  
export default CreatePlace;


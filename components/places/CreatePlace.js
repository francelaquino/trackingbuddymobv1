
import React, { Component } from 'react';
import { NetInfo , TouchableOpacity,Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image,Dimensions } from 'react-native';
import { Drawer,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Thumbnail,Card,Form } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { ProviderPropType, Marker, AnimatedRegion,Animated,Polyline } from 'react-native-maps';
import { connect } from 'react-redux';
import { createPlace,displayPlaces  } from '../../actions/locationActions' ;
import Loading  from '../shared/Loading';
import Loader from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;




var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');


class CreatePlace extends Component {
    constructor(props) {
        super(props)
        this.map = null;

        this.state = {
            loading:false,
            placename:'',
            region: {
                  latitude: -37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                },
            isMapReady: false,
            filteredMarkers: []
        };

      }
    

    

      

    fitToMap(){
            this.map.animateToRegion({
                latitude: this.state.region.latitude,
                longitude: this.state.region.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
              })

    }

    onRegionChangeComplete = region => {
        this.setState({ region });
        
      }
   
    componentDidMount(){
        this.getCurrentPosition();

    }

    onSubmit(){
        this.setState({loading:true})
        this.props.createPlace(this.state.placename,this.state.region).then(res=>{
            this.setState({placename:'',loading:false})
            if(res!==""){
                this.props.displayPlaces();
                ToastAndroid.showWithGravityAndOffset(res,ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
            }
            
        }).catch(function(err) {
            this.setState({loading:false})
        });
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
                    longitudeDelta: LONGITUDE_DELTA
                }
            })
            },
            (error) => {
              },
                { enableHighAccuracy: true, timeout: 10000 }

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

    
    ready(){

        const { region } = this.state;

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                <Loader loading={this.state.loading} />
                <OfflineNotice/>
                <ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
                    
                        <Header style={globalStyle.header}>
                            <Left style={globalStyle.headerLeft} >
                                <Button transparent onPress={()=> {this.props.navigation.goBack()}} >
                                    <Icon size={30} name='arrow-back' />
                                </Button> 
                            </Left>
                            <Body>
                                <Title>Add Place</Title>
                            </Body>
                        </Header>
                        <View style={styles.mainContainer}>
                            <View style={styles.mapContainer}>
                            
                                <MapView ref={map => {this.map = map}}
                                    onLayout = {() => this.fitToMap()}
                                    zoomEnabled = {true}
                                    onRegionChangeComplete={this.onRegionChangeComplete}
                                    style={StyleSheet.absoluteFill}
                                    textStyle={{ color: '#bc8b00' }}
                                    loadingEnabled={true}
                                    showsMyLocationButton={false}>


                                    </MapView>
                                    <View style={{width:100,height:100,borderWidth:1,borderColor:'#1eaec5',borderRadius:50, backgroundColor: 'rgba(30, 174, 197, 0.5)', justifyContent: 'center',alignItems: 'center'}}>
                                    <View style={{width:10,height:10, borderRadius:5,backgroundColor: 'rgba(0, 113, 189, 0.5)'}}></View>
                                    </View>
                                    
                            </View>
                            <View  style={styles.footerContainer}>
                            <Item   style={globalStyle.regularitem}>
                            <Input style={globalStyle.textinput} placeholder="Place Name"  maxLength={50} value={this.state.placename}  autoCorrect={false} onChangeText={placename=>this.setState({placename})} name="placename"/>
                            </Item>
                            <Button disabled={!this.state.placename} style={this.state.placename ? globalStyle.secondaryButton : globalStyle.secondaryButtonDisabled}
                                        onPress={()=>this.onSubmit()}
                                        bordered light full  >
                                        <Text style={{color:'white'}}>Save</Text>
                                    </Button>
                            
                            </View>
                        </View>


                        </ScrollView  >

                </Container>
        </Root>
            
        )
    }



    render() {
            if(this.state.isMapReady){
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
        borderBottomColor:'silver',
        borderBottomWidth:.5,
        justifyContent: 'center',
        alignItems: 'center'
      
    },
    footerContainer: {
        height:150,
        padding:5,
        
      },
  });

  
  

const mapStateToProps = state => ({
  })
  
CreatePlace=connect(mapStateToProps,{displayPlaces,createPlace})(CreatePlace);
  
export default CreatePlace;


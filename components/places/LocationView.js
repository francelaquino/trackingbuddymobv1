
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
import Loading  from '../shared/Loading';
import Loader from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;




var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');


class LocationView extends Component {
    constructor(props) {
        super(props)
        this.map = null;

        this.state = {
            loading:true,
            placename:'',
            region: {
                  latitude: -37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                },
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

   
    componentDidMount(){
        this.setState({
            region:{
                longitude:this.props.navigation.state.params.location.coordinates.longitude,
                latitude:this.props.navigation.state.params.location.coordinates.latitude
            },
            placename: this.props.navigation.state.params.location.address,
            dateadded: this.props.navigation.state.params.location.dateadded,
            loading:false
        })
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
                                <Title>Location Details</Title>
                            </Body>
                        </Header>
                        <View style={styles.mainContainer}>
                            <View style={styles.mapContainer}>
                            
                                <MapView ref={map => {this.map = map}}
                                    zoomEnabled = {true}
                                    onLayout = {() => this.fitToMap()} 
                                    style={StyleSheet.absoluteFill}
                                    textStyle={{ color: '#bc8b00' }}
                                    loadingEnabled={true}
                                    showsMyLocationButton={false}>

                                    <MapView.Marker  coordinate={this.state.region}>                                        
                                   
                                        </MapView.Marker>


                                    </MapView>
                                    
                            </View>

                             <View  style={styles.footerContainer}>
                             <Item stackedLabel>
                                <Label style={globalStyle.label} >Date/Time</Label>
                                <Input numberOfLines={1}  style={globalStyle.textinput} value={this.state.dateadded} editable={false}/>
                            </Item>
                            <Item stackedLabel style={{borderBottomWidth:0}}>
                                <Label style={globalStyle.label} >Address</Label>
                                <Input numberOfLines={1} style={globalStyle.textinput} value={this.state.placename} editable={false}/>
                            </Item>
                            </View>
                            
                        </View>


                        </ScrollView  >

                </Container>
        </Root>
            
        )
    }



    render() {
            if(this.state.loading){
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

  
  

export default LocationView;


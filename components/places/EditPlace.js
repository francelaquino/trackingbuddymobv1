
import React, { Component } from 'react';
import {  TouchableOpacity,Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image,Dimensions,Alert } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Form } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { ProviderPropType, Marker, AnimatedRegion,Animated,Polyline } from 'react-native-maps';
import { connect } from 'react-redux';
import { updatePlace, displayPlaces,deletePlace  } from '../../actions/locationActions' ;
import Loading  from '../shared/Loading';
import Loader from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;



var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');


class EditPlace extends Component {
    constructor(props) {
        super(props)
        this.map = null;

        this.state = {
            id:'',
            loading:true,
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

    componentWillMount() {
        this.initialize();
    }
            
    initialize(){
        this.setState({
            id:this.props.navigation.state.params.place.id,
            placename:this.props.navigation.state.params.place.placename,
            loading:false,
            region:{
                latitude: this.props.navigation.state.params.place.latitude,
                longitude: this.props.navigation.state.params.place.longitude,
                latitudeDelta: this.props.navigation.state.params.place.latitudeDelta,
                longitudeDelta: this.props.navigation.state.params.place.longitudeDelta,
            }
        })
    }
    onRegionChangeComplete = region => {
        this.setState({ region });
        
      }
      confirmDelete(){
        Alert.alert(
            'Comfirm Delete',
            'Are you sure you want to delete the place?',
            [
              
              {text: 'Yes', onPress: () => this.onDelete()},
              {text: 'No', style: 'cancel'},
            ],
            { cancelable: true }
          )
    }
    onDelete(){
        this.setState({loading:true})
        this.props.deletePlace(this.state.id).then(res=>{
        	if(res!==""){
                this.setState({loading:false})
                ToastAndroid.showWithGravityAndOffset(res,ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
                this.props.displayPlaces();
                this.props.navigation.pop(2)
            }
        }).catch(function(err) {
            this.setState({loading:false})
        });


        
    }
    onSubmit(){
        this.setState({loading:true})
        this.props.updatePlace(this.state.id,this.state.placename,this.state.region).then(res=>{
            this.setState({loading:false})
            if(res!==""){
                this.props.displayPlaces();
                ToastAndroid.showWithGravityAndOffset(res,ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
            }
            
        }).catch(function(err) {
            this.setState({loading:false})
        });
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
                                <Title>{this.state.placename}</Title>
                            </Body>
                        </Header>
                        <View style={styles.mainContainer}>
                            <View style={styles.mapContainer}>
                            
                                <MapView ref={map => {this.map = map}}
                                    onLayout = {() => this.fitToMap()}
                                    onRegionChangeComplete={this.onRegionChangeComplete}
                                    zoomEnabled = {true}
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
                            <Input style={globalStyle.textinput} value={this.state.placename} maxLength={50} placeholder="Place Name" autoCorrect={false} onChangeText={placename=>this.setState({placename})} name="placename"/>
                            </Item>
                            <Button disabled={!this.state.placename} style={this.state.placename ? globalStyle.secondaryButton : globalStyle.secondaryButtonDisabled}
                                        onPress={()=>this.onSubmit()}
                                        bordered light full  >
                                        <Text style={{color:'white'}}>Update Place</Text>
                                    </Button>

                                <Button 
                                    onPress={()=>this.confirmDelete()}
                                    bordered light full  style={globalStyle.deleteButton}>
                                    <Text style={{color:'white'}}>Delete Place</Text>
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
        height:250,
        padding:5,
        
      },
  });

  
  

const mapStateToProps = state => ({
  })
  
EditPlace=connect(mapStateToProps,{deletePlace,displayPlaces,updatePlace})(EditPlace);
  
export default EditPlace;


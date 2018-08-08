
import React, { Component } from 'react';
import { TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, Alert, KeyboardAvoidingView } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Form } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { ProviderPropType, Marker, AnimatedRegion,Animated,Polyline } from 'react-native-maps';
import { connect } from 'react-redux';
import { updatePlace, displayPlaces,deletePlace  } from '../../redux/actions/locationActions' ;
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
            place: '',
            address:'',
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
            place: this.props.navigation.state.params.place.place,
            address: this.props.navigation.state.params.place.address,
            loading:false,
            region:{
                latitude: this.props.navigation.state.params.place.latitude,
                longitude: this.props.navigation.state.params.place.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
        })
    }
    onRegionChangeComplete = region => {
        this.setState({ region });
        
      }
      confirmDelete(){
        Alert.alert(
            'Comfirm Delete',
            "This will also delete all member's notification.\nAre you sure you want to delete the place?",
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
        	if(res==true){
                this.setState({loading:false})
                this.props.displayPlaces();
                this.props.navigation.pop(2)
            }
        }).catch(function(err) {
            this.setState({loading:false})
        });


        
    }
    onSubmit(){
        this.setState({ loading: true })
        this.props.updatePlace(this.state.id, this.state.place, this.state.address,this.state.region).then(res => {
            this.setState({loading:false})
            if(res==true){
                this.props.displayPlaces();
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
               
                        <Header style={globalStyle.header}>
                            <Left style={globalStyle.headerLeft} >
                                <Button transparent onPress={()=> {this.props.navigation.goBack()}} >
                                    <Icon size={30} name='arrow-back' />
                                </Button> 
                            </Left>
                            <Body>
                                <Title>{this.state.place}</Title>
                            </Body>
                    </Header>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}
                            behavior="position"
                        >
                        <View style={styles.mainContainer}>
                            <View style={styles.mapContainer}>

                                <MapView ref={map => { this.map = map }}
                                    zoomEnabled={true}
                                    onLayout={() => this.fitToMap()}
                                    style={StyleSheet.absoluteFill}
                                    textStyle={{ color: '#bc8b00' }}
                                    loadingEnabled={true}
                                    showsMyLocationButton={false}>

                                    <MapView.Marker coordinate={this.state.region} >
                                        <Image style={globalStyle.marker}
                                            source={require('../../images/placemarker.png')} />
                                    </MapView.Marker>


                                </MapView>

                            </View>
                            <Content padder>
                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >Latitude</Label>
                                    <Input numberOfLines={1} style={globalStyle.textinput} value={this.state.region.latitude.toString()} editable={false} />
                                </Item>
                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >Longitude</Label>
                                    <Input numberOfLines={1} style={globalStyle.textinput} value={this.state.region.longitude.toString()} editable={false} />
                                </Item>
                                <Item stackedLabel >
                                    <Label style={globalStyle.label} >Address</Label>
                                    <Input numberOfLines={1} style={globalStyle.textinput} value={this.state.address} editable={false} />
                                </Item>
                                <Item stackedLabel >
                                    <Label style={globalStyle.label} >Place</Label>
                                    <Input numberOfLines={1} style={globalStyle.textinput} value={this.state.place}
                                        value={this.state.place} maxLength={50} placeholder="Enter place name"
                                        onChangeText={place => this.setState({ place })} />

                                </Item>

                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Button
                                        onPress={() => this.onSubmit()}
                                        bordered light full style={globalStyle.secondaryButton}>
                                        <Text style={{ color: 'white' }}>Save </Text>
                                        </Button>

                                       
                                    </Item>
                                    <Item style={{ borderBottomWidth: 0 }}>
                                       

                                        <Button
                                            onPress={() => this.confirmDelete()}
                                            bordered light full style={globalStyle.deleteButton}>
                                            <Text style={{ color: 'white' }}>Delete </Text>
                                        </Button>
                                    </Item>
                                    </Content>


                        </View>

                        </KeyboardAvoidingView>
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
        flex: 1,
        flexDirection: 'column'
    },
    mapContainer: {
        height: 200,
        borderBottomColor: 'silver',
        borderBottomWidth: .5,
        justifyContent: 'center',
        alignItems: 'center'

    },
  });

  
  

const mapStateToProps = state => ({
  })
  
EditPlace=connect(mapStateToProps,{deletePlace,displayPlaces,updatePlace})(EditPlace);
  
export default EditPlace;


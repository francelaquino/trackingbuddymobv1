
import React, { Component } from 'react';
import { NetInfo, TouchableOpacity, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, Dimensions, KeyboardAvoidingView  } from 'react-native';
import { Drawer,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Thumbnail,Card,Form } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { ProviderPropType, Marker, AnimatedRegion, Animated, Polyline } from 'react-native-maps';
import { connect } from 'react-redux';
import { savePlace, displayPlaces } from '../../redux/actions/locationActions';
import Loader from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;




var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');


class SavePlace extends Component {
    constructor(props) {
        super(props)
        this.map = null;

        this.state = {
            loading:true,
            placename: '',
            address: '',
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

    onSubmit() {
        if (this.state.placename == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter place name", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }
        this.setState({ loading: true })
        this.props.savePlace(this.state.placename, this.state.address, this.state.region).then(res => {
            this.setState({ loading: false })
            if (res == true) {
                this.setState({ placename: ''})
                this.props.displayPlaces();
                this.props.navigation.pop(1);
            }

        });
    }
   
    componentDidMount(){
        this.setState({
            region:{
                longitude:this.props.navigation.state.params.longitude,
                latitude:this.props.navigation.state.params.latitude
            },
            address: this.props.navigation.state.params.address,
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
                   
                        <Header style={globalStyle.header}>
                            <Left style={globalStyle.headerLeft} >
                                <Button transparent onPress={()=> {this.props.navigation.goBack()}} >
                                    <Icon size={30} name='arrow-back' />
                                </Button> 
                            </Left>
                            <Body>
                                <Title>Position</Title>
                            </Body>
                    </Header>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                        <KeyboardAvoidingView style={{ flex: 1, flexDirection:'column' }}
                            behavior="position"
                        >
                            <View style={styles.mainContainer}>
                            <View style={styles.mapContainer}>
                            
                                <MapView ref={map => {this.map = map}}
                                    zoomEnabled = {true}
                                    onLayout = {() => this.fitToMap()} 
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

                                <View style={{padding:5}}>
                             <Item stackedLabel>
                                    <Label style={globalStyle.label} >Latitude</Label>
                                    <Input numberOfLines={1} style={globalStyle.textinput} value={this.state.region.latitude.toString() } editable={false} />
                                </Item>
                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >Longitude</Label>
                                    <Input numberOfLines={1} style={globalStyle.textinput} value={this.state.region.longitude.toString() } editable={false} />
                                </Item>
                            <Item stackedLabel >
                                <Label style={globalStyle.label} >Address</Label>
                                    <Input numberOfLines={1} style={globalStyle.textinput} value={this.state.address} editable={false} />
                                </Item>
                                <Item stackedLabel >
                                    <Label style={globalStyle.label} >Place</Label>
                                    <Input numberOfLines={1} style={globalStyle.textinput} value={this.state.placename}
                                        value={this.state.placename} maxLength={50} placeholder="Enter place name"
                                        onChangeText={placename => this.setState({ placename })}/>
                                   
                                </Item>
                                
                                <Item  style={{ borderBottomWidth: 0 }}>
                                    <Button
                                            onPress={() => this.onSubmit()}
                                        bordered light full style={globalStyle.secondaryButton}>
                                        <Text style={{ color: 'white' }}>Save</Text>
                                    </Button>
                                </Item>
                                </View>
                            </View>
                       
                        </KeyboardAvoidingView>
                            
                           
                        </ScrollView  >
                   
                </Container>
        </Root>
            
        )
    }



    render() {
                return this.ready();
        

  }
}



const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection:'column'
    },
    mapContainer: {
        height: 200,
        borderBottomColor:'silver',
        borderBottomWidth:.5,
        justifyContent: 'center',
        alignItems: 'center'
      
    },
   
  });

  
  



const mapStateToProps = state => ({
})

SavePlace = connect(mapStateToProps, { displayPlaces, savePlace })(SavePlace);

export default SavePlace;

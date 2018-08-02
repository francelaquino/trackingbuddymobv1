
import React, { Component } from 'react';
import {  TouchableOpacity,Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image,Dimensions,Alert } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Thumbnail,Switch } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { ProviderPropType, Marker, AnimatedRegion,Animated,Polyline } from 'react-native-maps';
import { connect } from 'react-redux';
import { updatePlace, displayPlaces  } from '../../actions/locationActions' ;
import { displayMember  } from '../../actions/memberActions' ;
import Loading  from '../shared/Loading';
import Loader from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;



var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');


class PlaceView extends Component {
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
            mapSnapshot: '',
        };

      }
    

    

      

    fitToMap(){
            this.map.animateToRegion({
                latitude: this.state.region.latitude,
                longitude: this.state.region.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
              })
              setTimeout(() => {
                  this.takeSnapshot();
              }, 1000);

    }

    componentWillMount() {
        this.initialize();
        this.setState({loading:false})
    }
            
    async initialize(){
        await this.setState({
            id:this.props.navigation.state.params.place.id,
            placename:this.props.navigation.state.params.place.placename,
            region:{
                latitude: this.props.navigation.state.params.place.latitude,
                longitude: this.props.navigation.state.params.place.longitude,
                latitudeDelta: this.props.navigation.state.params.place.latitudeDelta,
                longitudeDelta: this.props.navigation.state.params.place.longitudeDelta,
            },
           
        })

        this.props.displayMember();
    }


    takeSnapshot () {
        const snapshot = this.map.takeSnapshot({
          format: 'png',  
          result: 'base64'  
        });
        snapshot.then((uri) => {
          this.setState({ mapSnapshot:{uri:'data:image/png;base64,'+uri}});
       
          
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
        const members =this.props.members.map(member=>(
            <ListItem key={member.id}  avatar button style={globalStyle.listItem}  onPress={() => {this.props.navigation.navigate("PlaceAlert",{placename: this.state.placename,placeid:this.state.id,userid:member.id,firstname:member.firstname,region:this.state.region})}}>
            <Left style={globalStyle.listLeft}>
               
                <View style={globalStyle.listAvatarContainer} >
                { member.avatar==='' ?  <Thumbnail  style={globalStyle.listAvatar} source={{uri: this.state.emptyPhoto}} /> :
                <Thumbnail  style={globalStyle.listAvatar} source={{uri: member.avatar}} />
                }
                </View>
            </Left>
            <Body style={globalStyle.listBody} >
                <Text  style={globalStyle.listHeading}>{member.firstname}</Text>
            </Body>
            <Right style={globalStyle.listRight} >
                                <SimpleLineIcons  style={globalStyle.listRightOptionIcon}   name='arrow-right' />
                            </Right>
            </ListItem>
        ));


        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                <OfflineNotice/>
                <ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
                    <Loader loading={this.state.loading} />
                        <Header style={globalStyle.header}>
                            <Left style={globalStyle.headerLeft} >
                                <Button transparent onPress={()=> {this.props.navigation.goBack()}} >
                                    <Icon size={30} name='arrow-back' />
                                </Button> 
                            </Left>
                            <Body>
                                <Title>{this.state.placename}</Title>
                            </Body>
                            <Right  >
                            <Button transparent onPress={() => this.props.navigation.navigate("EditPlace",{place: this.props.navigation.state.params.place})}>
                                <Text style={globalStyle.headerRightText}>Edit</Text>
                            </Button> 
                            
                        </Right>
                        </Header>
                        
                        <View style={styles.mainContainer}>
                        <MapView ref={map => {this.map = map}}
                                    onLayout = {() => this.fitToMap()}
                                    zoomEnabled = {true}
                                    style={styles.map}
                                    textStyle={{ color: '#bc8b00' }}>

                                    </MapView>
                            <View style={styles.mapContainer}>
                            <Image style={{width:'100%',height:200,position:'absolute'}} source={{ uri: this.state.mapSnapshot.uri }} />
                            
                                    <View style={{width:100,height:100,borderWidth:1,borderColor:'#1eaec5',borderRadius:50, backgroundColor: 'rgba(30, 174, 197, 0.5)', justifyContent: 'center',alignItems: 'center'}}>
                                    <View style={{width:10,height:10, borderRadius:5,backgroundColor: 'rgba(0, 113, 189, 0.5)'}}></View>
                                    </View>
                                    
                            </View>
                            <List>
                            <ListItem itemDivider>
                            <Text>{this.state.placename} Alerts</Text>
                            </ListItem>  
                            </List>
                            <View  style={styles.footerContainer}>
                            <List>
                            {members}
                            </List>
                            
                                
                            
                            </View>
                        </View>


                        </ScrollView  >

                </Container>
        </Root>
            
        )
    }



    render() {
            if(this.props.isLoading){
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
    map: {
        ...StyleSheet.absoluteFillObject,
        opacity:0,
        borderBottomColor:'silver',
        borderBottomWidth:.5,
      },

    mapContainer: {
        height:200,
        justifyContent: 'center',
        alignItems: 'center',
        padding:0,
      
    },

    footerContainer: {
        borderTopColor:'silver',
        borderTopWidth:.5,
        flex: 1,
        padding:5,
        
      },
  });

  
  

const mapStateToProps = state => ({
    members: state.fetchMember.members,
    isLoading:state.fetchMember.isLoading,
  })
  
PlaceView=connect(mapStateToProps,{displayPlaces,updatePlace,displayMember})(PlaceView);
  
export default PlaceView;


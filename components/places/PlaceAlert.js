
import React, { Component } from 'react';
import {  TouchableOpacity,Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image,Dimensions,Alert } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Thumbnail,Switch } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loader  from '../shared/Loader';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { ProviderPropType, Marker, AnimatedRegion,Animated,Polyline } from 'react-native-maps';
import { connect } from 'react-redux';
import { savePlaceAlert,getPlaceAlert  } from '../../actions/locationActions' ;
import Loading  from '../shared/Loading';
import OfflineNotice  from '../shared/OfflineNotice';



var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../../components/shared/userDetails');


class PlaceAlert extends Component {
    constructor(props) {
        super(props)
        this.map = null;

        this.state = {
            busy:false,
            placeid:'',
            userid:'',
            loading:true,
            firstname:'',
            placename:'',
            longitude:'',
            latitude:'',
            arrives:false,
            leaves:false,
        
        };

      }
    

    

      

    

    componentWillMount() {
        this.initialize();
    }
            
    async initialize(){
        await this.setState({
            placeid:this.props.navigation.state.params.placeid,
            userid:this.props.navigation.state.params.userid,
            firstname:this.props.navigation.state.params.firstname,
            placename:this.props.navigation.state.params.placename,
            latitude:this.props.navigation.state.params.region.latitude,
            longitude:this.props.navigation.state.params.region.longitude
           
        })

        await this.props.getPlaceAlert(this.state.placeid,this.state.userid);
        this.setState({leaves:this.props.alerts.leaves,arrives:this.props.alerts.arrives})
        this.setState({loading:false})
        
       
    }
    
    async onSubmit(){
        this.setState({busy:true})
        let alert={
            placeid:this.state.placeid,
            userid:this.state.userid,
            latitude:this.state.latitude,
            longitude:this.state.longitude,
            arrives:this.state.arrives,
            leaves:this.state.leaves,
        }
        try{
            let response= await this.props.savePlaceAlert(alert);
            this.setState({busy:false})
            if(response!==""){
                ToastAndroid.showWithGravityAndOffset(response,ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
            }

        }catch (e) {
            this.setState({busy:false})
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
        


        return (
            <Root>
                <Loader loading={this.state.busy} />
                <OfflineNotice/>
                <Container style={globalStyle.containerWrapper}>
                        <Header style={globalStyle.header}>
                            <Left style={globalStyle.headerLeft} >
                                <Button transparent onPress={()=> {this.props.navigation.goBack()}} >
                                    <Icon size={30} name='arrow-back' />
                                </Button> 
                            </Left>
                            <Body>
                                <Title>{this.state.firstname}</Title>
                            </Body>
                           
                        </Header>
                        
                        <View style={globalStyle.container}>
                        
                        <List>
                        <ListItem itemDivider>
                        <Text>{this.state.placename} Alerts</Text>
                        </ListItem>  
                            <ListItem >
                            <Body>
                                <Text>Arrives</Text>
                            </Body>
                            <Right>
                                <Switch onValueChange={arrives => this.setState({arrives})} value={this.state.arrives}  />
                            </Right>
                            </ListItem>
                            <ListItem >
                            <Body>
                                <Text>Leaves</Text>
                            </Body>
                            <Right>
                            <Switch onValueChange={leaves => this.setState({leaves})} value={this.state.leaves}  />
                            </Right>
                            </ListItem>
                        </List>
                        <Content padder>
                        <Button disabled={!this.state.placename} style={this.state.placename ? globalStyle.secondaryButton : globalStyle.secondaryButtonDisabled}
                                        onPress={()=>this.onSubmit()}
                                        bordered light full  >
                                        <Text style={{color:'white'}}>Save Alert</Text>
                                    </Button>
                                    </Content>
                        </View>



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
    map: {
        ...StyleSheet.absoluteFillObject,
        opacity:0,
      },

    mapContainer: {
        height:200,
        
       
        justifyContent: 'center',
        alignItems: 'center'
      
    },
    footerContainer: {
        borderTopColor:'silver',
        borderTopWidth:.5,
        flex: 1,
        padding:5,
        
      },
  });

  
  

const mapStateToProps = state => ({
    isLoading:state.fetchLocation.isLoading,
    alerts:state.fetchLocation.alerts,
  })
  
  PlaceAlert=connect(mapStateToProps,{savePlaceAlert,getPlaceAlert})(PlaceAlert);
  
export default PlaceAlert;



import React, { Component } from 'react';
import { TouchableOpacity,Modal, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image, FlatList  } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, Left, Right,ListItem} from 'native-base';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import { displayLocations  } from '../../actions/locationActions' ;
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loading  from '../shared/Loading';
import OfflineNotice from '../shared/OfflineNotice';
var userdetails = require('../shared/userDetails');
var globalStyle = require('../../assets/style/GlobalStyle');



class LocationPlaces extends Component<Props> {
    constructor(props) {
        super(props)
        


    
    }
   
    componentWillMount() {
        this.initialize();
    }
        
    initialize() {
        this.props.displayLocations(this.props.memberid).then(res => {
            if (res !== "") {
                ToastAndroid.showWithGravityAndOffset(res, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
        })

    }


    loading(){
        return (
          <Loading/>
        )
    }
    
    renderLocation(){
        const data=this.props.locations;
        return (
            <FlatList
            style={{flex:1}}
                keyExtractor={item => item.id}
                data={data}
                renderItem={({ item }) => (
                    <ListItem key={item.id}  avatar style={globalStyle.listItem} >
                    <Left style={globalStyle.listLeft}>
                            <SimpleLineIcons size={30} style={{ color:'#16a085'}}    name='location-pin' />
                           </Left>
                    <Body style={globalStyle.listBody} >
                        <Text numberOfLines={1} style={globalStyle.listHeading}>{item.address}</Text>
                        <Text note style={{fontSize:12}}>{item.dateadded}</Text>
                    </Body>
                    <Right style={globalStyle.listRight}>
                        <TouchableOpacity  style={globalStyle.listRightTouchable}  
                                            onPress={() => {this.props.navigate("LocationView",{location:item})}}>
                            <SimpleLineIcons  style={globalStyle.listRightOptionIcon}   name='arrow-right' />
                        </TouchableOpacity>
                    </Right>
                </ListItem>
                ) }
            />)
    }
    ready(){
         
        return(
            <List>
            {this.renderLocation()}
            </List>
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
  
  

const mapStateToProps = state => ({
    locations: state.fetchLocation.locations,
    isLoading: state.fetchLocation.isLoading,
  })
  
  LocationPlaces=connect(mapStateToProps,{displayLocations})(LocationPlaces);
  
export default LocationPlaces;


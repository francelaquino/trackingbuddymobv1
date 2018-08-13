
import React, { Component } from 'react';
import { TouchableOpacity,Modal, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image, FlatList  } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, Left, Right,ListItem} from 'native-base';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import { displayLocations  } from '../../redux/actions/locationActions' ;
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
        this.state = {
            loading: true,
        };


    
    }
   
    componentWillMount() {
        this.initialize();
    }
        
    initialize() {
       
        this.props.displayLocations(this.props.navigation.state.params.uid).then(res => {
            if (res == true) {
                this.setState({ loading: false })
                console.log(this.props.locations)
            }
        })

    }


    loading(){
        return (
          <Loading/>
        )
    }
    
    renderLocation(){
        return (
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
            />)
    }
    ready(){
         
        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <OfflineNotice />
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
                    <Content padder>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>

                            <View style={globalStyle.container}>
                                <List>
                                    {this.renderLocation()}
                                </List>


                            </View>

                        </ScrollView>
                    </Content>
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
  
  

const mapStateToProps = state => ({
    locations: state.fetchLocation.locations,
    isLoading: state.fetchLocation.isLoading,
  })
  
  LocationPlaces=connect(mapStateToProps,{displayLocations})(LocationPlaces);
  
export default LocationPlaces;


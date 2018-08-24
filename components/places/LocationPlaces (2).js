
import React, { Component } from 'react';
import { TouchableOpacity,  Modal, Platform, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid, Image, FlatList } from 'react-native';
import { Separator, Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, Left, Right,ListItem} from 'native-base';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import { displayLocations  } from '../../redux/actions/locationActions' ;
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loading from '../shared/Loading';
import Loader from '../shared/Loader';
import OfflineNotice from '../shared/OfflineNotice';
import Moment from 'moment';
var userdetails = require('../shared/userDetails');

var globalStyle = require('../../assets/style/GlobalStyle');



class LocationPlaces extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            busy:false,
            dateFilter: Moment().format("YYYY-MM-DD"),
            dateDisplay: Moment().format('DD-MMM-YYYY'),
        };
    
    }
   
    componentWillMount() {
        this.initialize();
    }
        
    initialize() {

        this.props.displayLocations(this.props.navigation.state.params.uid, this.state.dateFilter).then(res => {
            if (res == true) {
                this.setState({ loading: false,busy:false })
            }
        })

    }

    async addDate() {
        await this.setState({ dateFilter: Moment(this.state.dateFilter).add(1, 'days').format("YYYY-MM-DD"),busy:true });
        await this.setState({ dateDisplay: Moment(this.state.dateFilter).format("DD-MMM-YYYY") });
        await this.initialize();
    }
    async subDate() {
        await this.setState({ dateFilter: Moment(this.state.dateFilter).add(-1, 'days').format("YYYY-MM-DD"), busy: true});
        await this.setState({ dateDisplay: Moment(this.state.dateFilter).format("DD-MMM-YYYY") });
        await this.initialize();
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
        const markers = this.props.locations.map(marker => (
            <MapView.Marker
                key={marker.id.toString()}
                coordinate={marker.coordinates}>
               
            </MapView.Marker>

        ));
        return (
            <View >
                <View style={{
                    height: 50, width: '100%', backgroundColor: '#16a085', borderTopColor: 'white', borderTopWidth:1, alignItems: 'center', padding: 5
                }}>
                    <View style={{ height: 35, width: 250, flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <TouchableOpacity onPress={() => this.subDate()}>
                            <Ionicons style={{ fontSize: 38, marginRight: 5, color: 'white' }} name='ios-arrow-dropleft' />
                        </TouchableOpacity>
                        <View style={{ width: 164, alignItems: 'center' }} >
                            <Text style={{ fontSize: 17, color: 'white' }} >{this.state.dateDisplay}</Text>
                        </View >
                        <TouchableOpacity onPress={() => this.addDate()}>
                            <Ionicons style={{ fontSize: 38, color: 'white',marginLeft:5 }} name='ios-arrow-dropright' />
                        </TouchableOpacity>

                    </View >

                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                    <Content padder>
                        <View style={globalStyle.container}>
                            <List>
                                {this.renderLocation()}
                            </List>


                        </View>
                    </Content>
                </ScrollView>
                <View style={styles.mainContainer}>
                <View style={styles.mapContainer}>
                <MapView ref={map => { this.map = map }}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={false}
                    showsMyLocationButton={false}
                    followsUserLocation={false}
                    loadingEnabled={true}
                    zoomEnabled={true}
                    style={styles.map}
                >

                    {markers}

                </MapView>
            </View>
                </View>
                        
            </View>
        )
    }

    render() {

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <OfflineNotice />
                    <Loader loading={this.state.busy} />
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
                    {
                        this.state.loading ? this.loading() :
                            this.ready()
                    }

                </Container>
            </Root>
        )

        
    }
   
}
  


const styles = StyleSheet.create({
    mainContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
    navBar: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        padding: 2,
        backgroundColor: '#1eaec5',
        alignItems: 'center',
        borderTopWidth: 0,
    },

    mapContainer: {
        flex: 1,
        display: 'flex',
        borderBottomColor: 'silver',
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },
   

});

const mapStateToProps = state => ({
    locations: state.fetchLocation.locations,
    isLoading: state.fetchLocation.isLoading,
  })
  
  LocationPlaces=connect(mapStateToProps,{displayLocations})(LocationPlaces);
  
export default LocationPlaces;



import React, { Component } from 'react';
import { Modal,TouchableOpacity, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image, Alert,RefreshControl, FlatList } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Thumbnail, CardItem, Card } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import { displayMember  } from '../../actions/memberActions' ;
import Loading  from '../shared/Loading';
import OfflineNotice  from '../shared/OfflineNotice';
var globalStyle = require('../../assets/style/GlobalStyle');



class DisplayMember extends Component {
    constructor(props) {
        super(props)
        this.state={
            modalVisible: false,
            memberid:'',
            emptyPhoto:'https://firebasestorage.googleapis.com/v0/b/trackingbuddy-3bebd.appspot.com/o/member_photos%2Ficons8-person-80.png?alt=media&token=59864ce7-cf1c-4c5e-a07d-76c286a2171d',
        }
      }

   
    componentWillMount() {
        this.initialize();
    }
    onReload = () => {
        this.initialize();
    }
   
    initialize(){
        this.props.displayMember();
    }
    

    renderMember(){
        const data=this.props.members;
        return (
            <FlatList
                style={{flex:1}}
                keyExtractor={item => item.id}
                data={data}
                renderItem={({ item }) => (

                        <ListItem key={item.id}  button avatar style={globalStyle.listItem}  onPress={() => {this.props.navigation.navigate("MemberHome",{id:item.id,firstname:item.firstname})}}>
                            <Left style={globalStyle.listLeft}>
                                <View style={globalStyle.listAvatarContainer} >
                                { item.avatar==='' ?  <Thumbnail  style={globalStyle.listAvatar} source={{uri: this.state.emptyPhoto}} /> :
                                <Thumbnail  style={globalStyle.listAvatar} source={{uri: item.avatar}} />
                                }
                                </View>
                            </Left>
                            <Body style={globalStyle.listBody} >
                                <Text  style={globalStyle.listHeading}>{item.firstname}</Text>
                            </Body>
                            <Right style={globalStyle.listRight} >
                                <SimpleLineIcons  style={globalStyle.listRightOptionIcon}   name='arrow-right' />
                            </Right>
                            </ListItem>
                        ) }
                />)
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
                <Container style={globalStyle.containerWrapper}>
                <OfflineNotice/>
                    <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={()=> {this.props.navigation.goBack()}} >
                                <Icon size={30} name='arrow-back' />
                            </Button> 
                        </Left>
                        <Body >
                            <Title>Members</Title>
                        </Body>
                        <Right  >
                            <Button transparent onPress={() => this.props.navigation.navigate("NewInvite",{onReload : this.onReload})}>
                                <Text style={globalStyle.headerRightText}>Add Member</Text>
                            </Button> 
                            
                        </Right>
                    </Header>
                        <ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}
                          >
                            <View style={globalStyle.container}>
                            <List>
                                {this.renderMember()}
                            </List>
                            
                            </View>
                        </ScrollView>
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




const mapStateToProps = state => ({
    members: state.fetchMember.members,
    isLoading:state.fetchMember.isLoading,
  })
  
  
DisplayMember=connect(mapStateToProps,{displayMember})(DisplayMember);
  
  
export default DisplayMember;

import React, { Component } from 'react';
import { TouchableOpacity,Modal, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image  } from 'react-native';
import { Badge,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch,Thumbnail, Card,CardItem } from 'native-base';
import { connect } from 'react-redux';
import { displayGroup  } from '../../redux/actions/groupActions' ;
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loading  from '../shared/Loading';
import OfflineNotice  from '../shared/OfflineNotice';
var userdetails = require('../shared/userDetails');
var globalStyle = require('../../assets/style/GlobalStyle');



class DisplayGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            groupid:'',
            groupavatar:'',
            groupname:'',
            avatarsource: '',
            loading:true,
            avatar:'',
            members:{
                id:'',
                firstname:'',
                avatar:'',
            }
        };
        


    
    }
   

    addMember(){
        this.setModalVisible(false)
        this.props.navigation.navigate('AddMemberGroup',{groupid:this.state.groupid,groupname:this.state.groupname})
    }
   
    componentWillMount() {
        this.initialize();
    }
        
    initialize() {
        this.props.displayGroup().then((res) => {
            if (res == true) {
                this.setState({
                    loading: false,
                })

            }
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
        const { navigate } = this.props.navigation;
        const groups =this.props.groups.map(group=>(
            <ListItem key={group.id} button avatar style={globalStyle.listItem} onPress={() => { this.props.navigation.navigate("AddMember", { group: group})}}>
                            
                            <Left style={globalStyle.listLeft}>
                                <View style={globalStyle.listAvatarContainer} >
                        {group.emptyphoto === 1 ? <Ionicons size={46} style={{ color: '#2c3e50' }} name="ios-people" /> :
                                <Thumbnail  style={globalStyle.listAvatar} source={{uri: group.avatar}} />
                                }
                                </View>
                            </Left>
                            <Body style={globalStyle.listBody}  >
                    <Text numberOfLines={1} style={globalStyle.listHeading} >{group.groupname}</Text>
                    <Text numberOfLines={1} note >{group.membercount}</Text>
                            </Body>

                            <Right style={[globalStyle.listRight]} >
                                    <SimpleLineIcons  style={globalStyle.listRightOptionIcon}   name='arrow-right' />
                            </Right>
                            </ListItem>

           
          ));

         
        return(
            <Root>
                <Container style={globalStyle.containerWrapper}>
                <OfflineNotice/>
                    <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={()=> {this.props.navigation.goBack()}} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />

                            </Button> 
                        </Left>
                        <Body style={globalStyle.headerBody}>
                            <Title>GROUP</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}>
                            <Button transparent onPress={() =>navigate('CreateGroup')}>
                                <MaterialIcons size={30} style={{ color: 'white' }} name='group-add' />
                            </Button> 
                            
                        </Right>
                    </Header>
                    <Content padder>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                        
                    <View style={globalStyle.container}>
                        <List>
                            {groups}
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
    groups: state.fetchGroup.groups,
  })
  
DisplayGroup=connect(mapStateToProps,{displayGroup})(DisplayGroup);
  
export default DisplayGroup;


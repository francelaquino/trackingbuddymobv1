
import React, { Component } from 'react';
import { TouchableOpacity,Modal, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image  } from 'react-native';
import { Badge,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch,Thumbnail, Card,CardItem } from 'native-base';
import { connect } from 'react-redux';
import { displayGroup  } from '../../actions/groupActions' ;
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
            emptyPhoto:'https://firebasestorage.googleapis.com/v0/b/trackingbuddy-3bebd.appspot.com/o/group_photos%2Fgroup.png?alt=media&token=d1bade4b-6fee-43f7-829a-0b6f76005b40',
            groupname:'',
			avatarsource:'',
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
        
    initialize(){
            this.props.displayGroup();
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
            <ListItem key={group.id}  button avatar style={globalStyle.listItem}  onPress={() => {this.props.navigation.navigate("GroupHome",{id:group.id,groupname:group.groupname,avatar:group.avatar})}}>
                            
                            <Left style={globalStyle.listLeft}>
                                <View style={globalStyle.listAvatarContainer} >
                                { group.avatar==='' ?  <Thumbnail  style={globalStyle.listAvatar} source={{uri: this.state.emptyPhoto}} /> :
                                <Thumbnail  style={globalStyle.listAvatar} source={{uri: group.avatar}} />
                                }
                                </View>
                            </Left>
                            <Body style={globalStyle.listBody}  >
                                <Text  numberOfLines={1} style={globalStyle.listHeading} >{group.groupname}</Text>
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
                                <Icon size={30} name='arrow-back' />
                            </Button> 
                        </Left>
                        <Body>
                            <Title>Group</Title>
                        </Body>
                        <Right  >
                            <Button transparent onPress={() =>navigate('CreateGroup')}>
                                <Text style={globalStyle.headerRightText}>Add</Text>
                            </Button> 
                            
                        </Right>
                    </Header>
                    <ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
                    <View style={globalStyle.container}>
                        <List>
                            {groups}
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
    groups: state.fetchGroup.groups,
    isLoading: state.fetchGroup.isLoadingGroup,
  })
  
DisplayGroup=connect(mapStateToProps,{displayGroup})(DisplayGroup);
  
export default DisplayGroup;


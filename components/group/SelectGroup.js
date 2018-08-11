
import React, { Component } from 'react';
import { TouchableOpacity,Modal, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, ToastAndroid, Image  } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch,Thumbnail, Card,CardItem } from 'native-base';
import { connect } from 'react-redux';
import { displayGroup  } from '../../redux/actions/groupActions' ;
import { displayHomeMember  } from '../../redux/actions/memberActions' ;
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loading  from '../shared/Loading';
var userdetails = require('../shared/userDetails');
var globalStyle = require('../../assets/style/GlobalStyle');



class SelectGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:true,
            emptyPhoto:'https://firebasestorage.googleapis.com/v0/b/trackingbuddy-3bebd.appspot.com/o/group_photos%2Fgroup.png?alt=media&token=d1bade4b-6fee-43f7-829a-0b6f76005b40',
        };
        


    
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




    changeGroup(groupid,groupname){
        userdetails.group=groupid;
        this.props.navigation.state.params.changeGroup(groupname);
        this.props.navigation.goBack();
    }

    allMembers(){
        userdetails.group="";
        this.props.navigation.state.params.changeGroup("");
        this.props.navigation.goBack();
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
            <ListItem key={group.id}  avatar style={globalStyle.listItem} onPress={()=>this.changeGroup(group.id,group.groupname)}>
                <Left style={globalStyle.listLeft}>
                    <View style={globalStyle.listAvatarContainer} >
                        { group.avatar==='' ?  <Thumbnail  style={globalStyle.listAvatar} source={{uri: this.state.emptyPhoto}} /> :
                        <Thumbnail  style={globalStyle.listAvatar} source={{uri: group.avatar}} />
                        }
                    </View>
                </Left>
                <Body style={globalStyle.listBody} >
                    <Text style={globalStyle.listHeading}>{group.groupname}</Text>
                </Body>
            </ListItem>

           
          ));

         
        return(
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <Header style={globalStyle.header}>
                    <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={()=> {this.props.navigation.goBack()}} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                            </Button> 
                        </Left>
                    <Body style={globalStyle.headerBody}>
                            <Title>Switch Group</Title>
                    </Body>
                    <Right style={globalStyle.headerRight}>
                        </Right>
                    </Header>
                    <Content padder>
                    <ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
                    <View style={globalStyle.container}>
                    
                        <List>
                        <ListItem  avatar style={globalStyle.listItem} onPress={()=>this.allMembers()}>
                            <Left style={globalStyle.listLeft}>
                                <View style={globalStyle.listAvatarContainer} >
                                    <Thumbnail  style={globalStyle.listAvatar} source={{uri: this.state.emptyPhoto}} />
                                </View>
                            </Left>
                            <Body style={globalStyle.listBody} >
                                <Text style={globalStyle.listHeading}>All Members</Text>
                            </Body>
                        </ListItem>
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
        if (this.state.loading){
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
  
  SelectGroup=connect(mapStateToProps,{displayGroup,displayHomeMember})(SelectGroup);
  
export default SelectGroup;


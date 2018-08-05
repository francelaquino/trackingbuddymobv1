
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid, Image, Alert,RefreshControl, FlatList } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,CheckBox, Thumbnail, CardItem, Card } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux';
import { displayGroupMember, addGroupMember, displayHomeMember, removeGroupMember  } from '../../redux/actions/memberActions' ;
import { LeftHome } from '../shared/LeftHome';
import OfflineNotice  from '../shared/OfflineNotice';
import Loading  from '../shared/Loading';
var userdetails = require('../shared/userDetails');
var globalStyle = require('../../assets/style/GlobalStyle');



class AddMember extends Component {
    constructor(props) {
        super(props)
        this.state={
            refresh:true,
        }
      }

    
    componentWillMount() {
        
        this.initialize();
    }
   
    addSelectedMember(index){
        let mem = [...this.props.members];
        if(mem[index].ismember==0){
            this.props.members[index].ismember=1;
            this.props.addGroupMember(this.state.groupid,mem[index]).then(res=>{
                this.setState({ 
                    refresh: !this.state.refresh
                })
            })
        }else{
            this.props.members[index].ismember=0;
            this.props.removeGroupMember(this.state.groupid,mem[index]).then(res=>{
                this.setState({ 
                    refresh: !this.state.refresh
                })
            })
        }
      


    }

    
    
    initialize(){
        this.props.displayGroupMember(this.props.navigation.state.params.group.groupid).then(res=>{
        })
       
    }


   
    loading(){
        return (
          <Loading/>
        )
    }
    
    renderMember(){
        const data=this.props.members;
        return (
            <FlatList
                extraData={this.state.refresh}
                style={{flex:1}}
                keyExtractor={item => item.uid}
                data={data}
                renderItem={({ item,index }) => (
                    <ListItem  key={item.uid} avatar button onPress={()=>this.addSelectedMember(index)} style={globalStyle.listItem}>
                    <Left >
                    { item.ismember ===1 &&
                    <Feather  style={{color:'#009da3'}} size={20} name="check-circle" />
                    }
                    { item.ismember ===0 &&
                    <Feather  style={{color:'#009da3'}} size={20} name="circle" />
                    }
                        
                    </Left>
                    <Body style={globalStyle.listBody} >
                            <Text style={globalStyle.heading1}>{item.firstname}</Text>
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
                <OfflineNotice/>
                    <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={()=> {this.props.navigation.goBack()}} >
                                <Icon size={30} name='arrow-back' />
                            </Button> 
                        </Left>
                        <Body>
                            <Title>{this.props.navigation.state.params.group.groupname}</Title>
                        </Body>
                        <Right  >
                            <Button transparent onPress={() =>this.props.navigation.navigate('EditGroup',{group:this.props.navigation.state.params.group})}>
                                <Text style={globalStyle.headerRightText}>Edit</Text>
                            </Button> 
                            
                        </Right>
                    </Header>
                    <ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
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
  
  
  AddMember=connect(mapStateToProps,{displayGroupMember,displayHomeMember, addGroupMember, removeGroupMember})(AddMember);
  
  
  
export default AddMember;
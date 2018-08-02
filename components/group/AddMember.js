
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid, Image, Alert,RefreshControl, FlatList } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,CheckBox, Thumbnail, CardItem, Card } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { displayGroupMember,displayHomeMember  } from '../../actions/memberActions' ;
import { LeftHome } from '../shared/LeftHome';
import OfflineNotice  from '../shared/OfflineNotice';
import Loading  from '../shared/Loading';
var userdetails = require('../shared/userDetails');
var globalStyle = require('../../assets/style/GlobalStyle');



class AddMember extends Component {
    constructor(props) {
        super(props)
        this.state={
            isLoading:true,
            emptyPhoto:'https://firebasestorage.googleapis.com/v0/b/trackingbuddy-3bebd.appspot.com/o/member_photos%2Ficons8-person-80.png?alt=media&token=59864ce7-cf1c-4c5e-a07d-76c286a2171d',
            members:{
                id:'',
                firstname:'',
                avatar:'',
                selected:false,
            },
            groupname:'',
            groupid:'',
            membercount:'0 member'
        }
      }

    
    componentWillMount() {
        
        this.initialize();
    }
   
    addSelectedMember(index){
        let mem = [...this.props.members];
        mem[index].selected = !mem[index].selected;
        this.setState({mem});
        if(mem[index].selected){
            

            let groupRef = firebase.database().ref().child("groupmembers/"+this.state.groupid+"/"+mem[index].id);
			groupRef.set({ 
							member : mem[index].id,
                            dateadded: Date.now(),
                            
			})
			.catch(function(err) {
					console.log('error', err);
                });
            }else{
                let groupRef = firebase.database().ref().child("groupmembers/"+this.state.groupid+"/"+mem[index].id);
                groupRef.remove({ 
                                member : mem[index].id,
                                dateadded: Date.now(),
                })
                
                .catch(function(err) {
                        console.log('error', err);
                    });
            }

            this.countMembers();
            this.props.displayHomeMember();


    }

    countMembers(){
        let self=this;
        firebase.database().ref().child('groupmembers/'+this.state.groupid) .once("value",function(snapshot){
            if(snapshot.numChildren()<=1){
                self.setState({membercount : snapshot.numChildren()+' member'})
            }else{
                self.setState({membercount : snapshot.numChildren()+' members'})
            }
        });
    }
    
    initialize(){
       
        this.setState({
            groupname:this.props.groupname,
            groupid:this.props.groupid,
        })
            setTimeout(() => {
                this.props.displayGroupMember(this.state.groupid).then(res=>{
                    this.countMembers();
                    this.setState({isLoading:false})

                }).catch(function(err) {
                });

               
            }, 1);
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
                style={{flex:1}}
                keyExtractor={item => item.id}
                data={data}
                renderItem={({ item,index }) => (
                    <ListItem  key={item.id} avatar button onPress={()=>this.addSelectedMember(index)} style={globalStyle.listItem}>
                    <Left >
                        <View style={globalStyle.listAvatarContainer}> 
                            { item.avatar==='' ?  <Thumbnail  style={globalStyle.avatar} source={{uri: this.state.emptyPhoto}} /> :
                            <Thumbnail  style={globalStyle.listAvatar} source={{uri: item.avatar}} />
                            }
                            </View>
                    </Left>
                    <Body style={globalStyle.listBody} >
                            <Text style={globalStyle.heading1}>{item.firstname}</Text>
                        </Body>
                    <Right style={globalStyle.listRight}>
                        { item.selected ===true &&
                        <Icon  style={{color:'#009da3'}} size={30} name="md-checkmark-circle" />
                        }
                    </Right>
                  </ListItem>
                        ) }
                />)
    }
    
    ready(){
       

        return (
                            <View  style={globalStyle.container}>
                             <List>
                            <ListItem itemDivider>
                            <Text>{this.state.membercount}</Text>
                            </ListItem>  
                            </List>
                                {this.renderMember()}
                            </View>
                            
        )
    }


    render() {
        if(this.state.isLoading){
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
  
  
  AddMember=connect(mapStateToProps,{displayGroupMember,displayHomeMember})(AddMember);
  
  
  
export default AddMember;

import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid, Alert, Image } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right, List, ListItem,Tab,Badge, Tabs, TabHeading,FooterTab, Footer } from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation'
import {  getMember, displayMember, deleteMember,displayHomeMember } from '../../actions/memberActions' ;
import Loading  from '../shared/Loading';
import Loader from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';

var globalStyle = require('../../assets/style/GlobalStyle');



class InfoMember extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id:this.props.memberid,
            firstname:this.props.memberfirstname,
        };
      }

      
    componentWillMount() {
        this.props.getMember(this.state.id).then(res=>{
            this.setState({loading:false})
        }).catch(function(err) {
            this.setState({loading:false})
        });
    }

    onDelete(){
        let self=this;
        this.setState({loading:true})
        this.props.deleteMember(this.state.id).then(res=>{
                ToastAndroid.showWithGravityAndOffset("Member successfully deleted",ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
                self.setState({loading:false})
                self.props.displayMember();
                self.props.displayHomeMember();
                self.props.navigate.goBack();
        }).catch(function(err) {
            self.setState({loading:false})
        });
    }


    confirmDelete(){
        Alert.alert(
            'Comfirm Delete',
            'Are you sure you want to delete the member?',
            [
              
              {text: 'Yes', onPress: () => this.onDelete()},
              {text: 'No', style: 'cancel'},
            ],
            { cancelable: true }
          )
    }

    loading(){
        return (
          <Loading/>
        )
    }
   

    ready(){
        return (
            
                    <View style={globalStyle.container}>
                    <Loader loading={this.state.loading} />
                    <OfflineNotice/>
                        <View style={{marginTop:20}}>
                        <View style={globalStyle.avatarContainer}>
                            <Image style={globalStyle.avatarBig} source={{uri : this.props.member.avatar}} />
                        </View>
                        </View>
                        
                            <List >
                            <ListItem >
                                <Body>
                                    <Text style={globalStyle.label}>First Name</Text>
                                    <Text style={{color:'#838484',fontSize:15}} note>{this.props.member.firstname}</Text>
                                </Body>
                            </ListItem>
                            <ListItem >
                                <Body>
                                    <Text style={globalStyle.label}>Middle Name</Text>
                                    <Text style={{color:'#838484',fontSize:15}} note>{this.props.member.middlename}</Text>
                                </Body>
                            </ListItem>
                            <ListItem >
                            <Body>
                                <Text style={globalStyle.label}>Last Name</Text>
                                <Text style={{color:'#838484',fontSize:15}} note>{this.props.member.lastname}</Text>
                            </Body>
                            </ListItem>
                            <ListItem >
                            <Body>
                                <Text style={globalStyle.label}>Mobile No.</Text>
                                <Text style={{color:'#838484',fontSize:15}} note>{this.props.member.mobileno}</Text>
                            </Body>
                            </ListItem>
                            <ListItem >
                            <Body>
                                <Text style={globalStyle.label}>Email</Text>
                                <Text style={{color:'#838484',fontSize:15}} note>{this.props.member.email}</Text>
                            </Body>
                            </ListItem>
                            
                           
                            <ListItem last>
                                <Button 
                                onPress={()=>this.confirmDelete()}
                                bordered light full  style={globalStyle.deleteButton}>
                                <Text style={{color:'white'}}>Delete Member</Text>
                                </Button>
                            </ListItem>
                        </List>
                        
                        
                        </View>

                    
                            
                    
        );
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
    member: state.fetchMember.member,
    isLoading:state.fetchMember.isLoading,
  })
  
  
InfoMember=connect(mapStateToProps,{getMember,displayMember,deleteMember,displayHomeMember})(InfoMember);
  
export default InfoMember;
  


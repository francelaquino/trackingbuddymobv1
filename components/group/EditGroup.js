
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid, Alert, Image } from 'react-native';
import { Content,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import { displayGroup,updateGroup, deleteGroup  } from '../../actions/groupActions' ;
import Loader  from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';
import { NavigationActions } from 'react-navigation'
var globalStyle = require('../../assets/style/GlobalStyle');
var registrationStyle = require('../../assets/style/Registration');

class EditGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            loading:false,
            emptyPhoto:'https://firebasestorage.googleapis.com/v0/b/trackingbuddy-3bebd.appspot.com/o/group_photos%2Fgroup.png?alt=media&token=d1bade4b-6fee-43f7-829a-0b6f76005b40',
            groupNameOld:'',
            groupname:'',
            avatarsource:'',
            isPhotoChange:false,
            avatar:'',
            groupid:''
        };
      }

    componentWillMount() {
        this.initialize();
    }
            
    initialize(){
        this.setState({
            avatarsource:{uri :this.props.avatarsource},
            groupNameOld:this.props.groupname,
            groupname:this.props.groupname,
            groupid:this.props.groupid,
            isLoading:false,
        })
    }
    removePhoto(){
		this.setState({
            avatarsource:{uri:''},
            isPhotoChange:false,
        });
    }
    

    selectPhoto() {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true
          }
        };
    
        ImagePicker.showImagePicker(options, (response) => {
          if (response.didCancel) {
          }
          else if (response.error) {
          }
          else if (response.customButton) {
          }
          else {
            let source = { uri: response.uri };
            
            this.setState({
              avatarsource: source,
              isPhotoChange : true
            });
          }
        });
      }
          
    confirmDelete(){
        Alert.alert(
            'Comfirm Delete',
            'Are you sure you want to delete the group?',
            [
              
              {text: 'Yes', onPress: () => this.onDelete()},
              {text: 'No', style: 'cancel'},
            ],
            { cancelable: true }
          )
    }
    onDelete(){
        this.setState({loading:true})
        this.props.deleteGroup(this.state.groupid).then(res=>{
        	if(res!==""){
                this.setState({loading:false})
                ToastAndroid.showWithGravityAndOffset(res,ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
                this.props.displayGroup();
                this.props.navigation.goBack();
            }
        }).catch(function(err) {
            this.setState({loading:false})
        });


        
    }
    removePhoto(){
        this.setState({avatarsource:''})
    }
    onUpdate(){
        
        if(this.state.groupname==""){
            return false;
        }
        this.setState({loading:true})
        let group={
            groupname:this.state.groupname,
            groupid: this.state.groupid,
            avatarsource:this.state.avatarsource,
            isPhotoChange:this.state.isPhotoChange,
        }

        this.props.updateGroup(group).then(res=>{
            if(res!==""){
                this.setState({loading:false})
                ToastAndroid.showWithGravityAndOffset(res,ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
                this.props.displayGroup();
               
            }
        }).catch(function(err) {
        });

        
    }

   
    

    loading(){
        return (
          <Loading/>
        )
    }
    ready(){

        return(
            <Root>
                <Loader loading={this.state.loading} />
                    
                <OfflineNotice/>
                <Content padder>
                    <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false}>
                        <View style={globalStyle.container}>
                        <TouchableOpacity style={{marginTop:20}} onPress={this.selectPhoto.bind(this)}>
                            <View style={globalStyle.avatarContainer}>
                            { this.state.avatarsource === '' ? <Image style={globalStyle.avatarBig} source={{uri : this.state.emptyPhoto}} />  :
                                <Image style={globalStyle.avatarBig} source={this.state.avatarsource} />
                                }
                            </View>
                            </TouchableOpacity>
                            { (this.state.avatarsource != '' && this.state.avatarsource.uri!=this.state.emptyPhoto) &&
														<TouchableOpacity   onPress={this.removePhoto.bind(this)}>
														<Text style={globalStyle.deleteButtonSmall} >Remove Photo</Text>
														</TouchableOpacity>
														}
                            <Item   style={globalStyle.regularitem}>
                                <TextInput style={globalStyle.textinput} 
                                 underlineColorAndroid= 'transparent'
                                 placeholder="Group Name"
                                name="groupname" autoCorrect={false}
                                value={this.state.groupname}  maxLength = {20}
                                onChangeText={groupname=>this.setState({groupname})}/>
                            </Item>
                            

                            <View style={{justifyContent: 'center',alignItems: 'center'}}>
                                <Button disabled={!this.state.groupname} style={this.state.groupname ? globalStyle.secondaryButton : globalStyle.secondaryButtonDisabled}
                                    onPress={()=>this.onUpdate()}
                                    bordered light full  >
                                    <Text style={{color:'white'}}>Update Group</Text>
                                </Button>


                                
                                <Button 
                                    onPress={()=>this.confirmDelete()}
                                    bordered light full  style={globalStyle.deleteButton}>
                                    <Text style={{color:'white'}}>Delete Group</Text>
                                </Button>
                            </View>

                        </View>
                    </ScrollView>
                    </Content>
             </Root>
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
})
  
EditGroup=connect(mapStateToProps,{updateGroup,displayGroup, deleteGroup})(EditGroup);
  
export default EditGroup;

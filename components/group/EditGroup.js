
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid, Alert, Image } from 'react-native';
import { Content,Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import { displayGroup,updateGroup, deleteGroup  } from '../../redux/actions/groupActions' ;
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
            groupNameOld: '',
            emptyPhoto:'https://firebasestorage.googleapis.com/v0/b/trackingbuddy-5598a.appspot.com/o/group_photos%2Fgroup_empty.png?alt=media&token=2f84667f-b828-4303-b18d-8310279ac5a6',
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
            
    initialize() {
        this.setState({
            avatarsource:{uri :this.props.navigation.state.params.group.avatar},
            groupNameOld:this.props.navigation.state.params.group.groupname,
            groupname:this.props.navigation.state.params.group.groupname,
            groupid:this.props.navigation.state.params.group.id,
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
        	if(res==true){
                this.setState({loading:false})
                this.props.displayGroup();
                this.props.navigation.pop(2);
            }
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
        this.props.updateGroup(group).then(res => {
            if(res===true){
                this.setState({loading:false})
                this.props.displayGroup();
                this.props.navigation.pop(2)
            }
        });

        
    }

   
    

    loading(){
        return (
          <Loading/>
        )
    }
    ready() {

        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                <Loader loading={this.state.loading} />

                <OfflineNotice />
                <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={()=> {this.props.navigation.goBack()}} >
                                <Icon size={30} name='arrow-back' />
                            </Button> 
                        </Left>
                        <Body>
                            <Title>{this.props.navigation.state.params.group.groupname}</Title>
                        </Body>
                    </Header>
                <Content padder>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false}>
                        <View style={globalStyle.container}>
                            <TouchableOpacity style={{ marginTop: 20 }} onPress={this.selectPhoto.bind(this)}>
                                <View style={globalStyle.avatarContainer}>
                                    {this.state.avatarsource === '' ? <Image style={globalStyle.avatarBig} source={{ uri: this.state.emptyPhoto }} /> :
                                        <Image style={globalStyle.avatarBig} source={this.state.avatarsource} />
                                    }
                                </View>
                            </TouchableOpacity>
                            {(this.props.emptyphoto != '1' && this.state.avatarsource.uri != this.state.emptyPhoto) &&
                                <TouchableOpacity onPress={this.removePhoto.bind(this)}>
                                    <Text style={globalStyle.deleteButtonSmall} >Remove Photo</Text>
                                </TouchableOpacity>
                                }
                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >Group Name</Label>
                                    <Input style={globalStyle.textinput} value={this.state.groupname} maxLength={20}
                                        onChangeText={groupname => this.setState({ groupname })} />
                                </Item>

                           


                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Button disabled={!this.state.groupname} style={this.state.groupname ? globalStyle.secondaryButton : globalStyle.secondaryButtonDisabled}
                                    onPress={() => this.onUpdate()}
                                    bordered light full  >
                                    <Text style={{ color: 'white' }}>Update Group</Text>
                                </Button>



                                <Button
                                    onPress={() => this.confirmDelete()}
                                    bordered light full style={globalStyle.deleteButton}>
                                    <Text style={{ color: 'white' }}>Delete Group</Text>
                                </Button>
                            </View>

                        </View>
                    </ScrollView>
                </Content>
                </Container>
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

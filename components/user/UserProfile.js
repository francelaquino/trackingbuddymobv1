
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid, Alert, Image, Picker } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right, List, ListItem, Content } from 'native-base';
import { connect } from 'react-redux';
import {  getProfile, updateProfile } from '../../actions/userActions' ;
import { displayHomeMember  } from '../../actions/memberActions' ;
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation'
import Loading  from '../shared/Loading';
import ImagePicker from 'react-native-image-picker';
import Loader from '../shared/Loader';
import firebase from 'react-native-firebase';
var globalStyle = require('../../assets/style/GlobalStyle');
var registrationStyle = require('../../assets/style/Registration');


class UserProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            firstname:'',
            email:'',
            mobileno:'',
            middlename:'',
            lastname:'',
            avatarsource:{
                uri:''
            },
            isPhotoChange: false,
            emptyPhoto:'https://firebasestorage.googleapis.com/v0/b/trackingbuddy-3bebd.appspot.com/o/member_photos%2Ficons8-person-80.png?alt=media&token=59864ce7-cf1c-4c5e-a07d-76c286a2171d',
    
        };
      }

      
    componentWillMount() {
        this.props.getProfile().then((res) => {
            if (res == "") {
                this.setState({
                    firstname: this.props.profile.firstname,
                    email: this.props.profile.email,
                    mobileno: this.props.profile.mobileno,
                    middlename: this.props.profile.middlename,
                    lastname: this.props.profile.lastname,
                    avatarsource: { uri: this.props.profile.avatar },
                })
            } else {
                ToastAndroid.showWithGravityAndOffset(res, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
        });
      

    }

     
    onSubmit(){
    if(this.state.firstname.trim()===""){
        ToastAndroid.showWithGravityAndOffset("Please enter first name",ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
        return false;
    }
    
    if(this.state.middlename.trim()==""){
        ToastAndroid.showWithGravityAndOffset("Please enter middle name",ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
        return false;
    }

    if(this.state.lastname.trim()==""){
        ToastAndroid.showWithGravityAndOffset("Please enter last name",ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
        return false;
    }
    
    if(this.state.mobileno.trim()==""){
        ToastAndroid.showWithGravityAndOffset("Please enter mobile no.",ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
    	return false;
    }

	


        this.setState({loading:true})

        let info={
            email: this.state.email,
            firstname: this.state.firstname,
            mobileno: this.state.mobileno,
            middlename: this.state.middlename,
            lastname: this.state.lastname,
            avatarsource: this.state.avatarsource,
            isPhotoChange: this.state.isPhotoChange
        }

        this.props.updateProfile(info).then(res=>{
            this.setState({loading:false})
            if (res == "") {
                this.props.displayHomeMember();
                ToastAndroid.showWithGravityAndOffset("Profile successfully updated", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            } else {
                ToastAndroid.showWithGravityAndOffset(res, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
        }).catch(function(err) {
            this.setState({ loading: false })
            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        });
    }

    
    loading(){
        return (
          <Loading/>
        )
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


    ready(){
        const countries =this.props.countries.map(country=>(
            <Picker.Item key={country.id} label={country.country} value={country.id} />
              ));
        return (
            <Content padder>
            <View style={globalStyle.container}>
           <Loader loading={this.state.loading} />
            
            <ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
                <View  style={{marginTop:20,marginBottom:20}}>
						<TouchableOpacity onPress={this.selectPhoto.bind(this)}>
                        <View style={globalStyle.avatarContainer}>
                            { this.state.avatarsource.uri === '' ? <Image style={globalStyle.avatarBig} source={{uri : this.state.emptyPhoto}} />  :
                                <Image style={globalStyle.avatarBig} source={this.state.avatarsource} />
                                }
                            </View>
						</TouchableOpacity>
                        { (this.state.avatarsource.uri != '' && this.state.avatarsource.uri!=this.state.emptyPhoto) &&
                            <TouchableOpacity   onPress={this.removePhoto.bind(this)}>
                            <Text style={globalStyle.deleteButtonSmall} >Remove Photo</Text>
                            </TouchableOpacity>
                        }
				</View>

                    
					

						<Item   style={registrationStyle.regularitem}  >
                                <TextInput  style={registrationStyle.textinput} 
                                underlineColorAndroid= 'transparent'
                                placeholder="Email address"
								name="email" autoCorrect={false}
								value={this.state.email}
								editable={false}/>
						</Item>
					
					

						<Item   style={registrationStyle.regularitem}>
                                <TextInput  style={registrationStyle.textinput} 
                                 underlineColorAndroid= 'transparent'
                                 placeholder="First Name"
								name="firstname" autoCorrect={false}
								value={this.state.firstname} maxLength = {10}
								onChangeText={firstname=>this.setState({firstname})}/>
						</Item>
					
						<Item   style={registrationStyle.regularitem}>
                                <TextInput  style={registrationStyle.textinput} 
                                 underlineColorAndroid= 'transparent'
                                 placeholder="Middle Name"
								name="middlename" autoCorrect={false}
								value={this.state.middlename} maxLength = {10}
								onChangeText={middlename=>this.setState({middlename})}/>
						</Item>
					
						<Item   style={registrationStyle.regularitem}>
                                <TextInput  style={registrationStyle.textinput} 
                                 underlineColorAndroid= 'transparent'
                                 placeholder="Last Name"
								name="lastname" autoCorrect={false}
								value={this.state.lastname} maxLength = {10}
								onChangeText={lastname=>this.setState({lastname})}/>
					</Item>
						<Item   style={registrationStyle.regularitem}>
                                <TextInput  style={registrationStyle.textinput} 
                                 underlineColorAndroid= 'transparent'
                                 placeholder="Mobile No."
								name="mobileno" autoCorrect={false}
								value={this.state.mobileno} maxLength = {50}
								onChangeText={mobileno=>this.setState({mobileno})}/>
						</Item>
					
                        <Button  onPress={()=>this.onSubmit()}
                        bordered light full  style={globalStyle.secondaryButton}>
                        <Text style={{color:'white'}}>Update</Text>
                        </Button>
					
				</ScrollView>
                   
                </View>
                </Content>
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
    countries: state.fetchMember.countries,
    profile: state.fetchUser.profile,
    isLoading:state.fetchUser.isLoading,
  })
  
  
  UserProfile=connect(mapStateToProps,{getProfile,updateProfile,displayHomeMember})(UserProfile);
  
export default UserProfile;
  


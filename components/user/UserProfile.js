
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid, Alert, Image, Picker } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right, List, ListItem, Content } from 'native-base';
import { connect } from 'react-redux';
import {  getProfile, updateProfile } from '../../redux/actions/userActions' ;
import { displayHomeMember  } from '../../actions/memberActions' ;
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions } from 'react-navigation'
import Loading  from '../shared/Loading';
import ImagePicker from 'react-native-image-picker';
import Loader from '../shared/Loader';
import OfflineNotice from '../shared/OfflineNotice';
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
            if (res == true) {
                this.setState({
                    firstname: this.props.profile.firstname,
                    email: this.props.profile.email,
                    fullname: this.props.profile.fullname,
                    mobileno: this.props.profile.mobileno,
                    middlename: this.props.profile.middlename,
                    lastname: this.props.profile.lastname,
                    avatarsource: { uri: this.props.profile.avatar },
                })
            }
        });
      

    }

     
    onSubmit() {
        if (this.state.firstname.trim() === "") {
            ToastAndroid.showWithGravityAndOffset("Please enter first name", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }

        if (this.state.middlename.trim() == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter middle name", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }

        if (this.state.lastname.trim() == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter last name", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }

        if (this.state.mobileno.trim() == "") {
            ToastAndroid.showWithGravityAndOffset("Please enter mobile no.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }





        let profile = {
            email: this.state.email,
            firstname: this.state.firstname,
            mobileno: this.state.mobileno,
            middlename: this.state.middlename,
            lastname: this.state.lastname,
            avatarsource: this.state.avatarsource,
            isPhotoChange: this.state.isPhotoChange
        }
        this.setState({ loading: true })
        this.props.updateProfile(profile).then(res => {
            this.setState({ loading: false })
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
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <OfflineNotice />
            <View style={globalStyle.container}>
           <Loader loading={this.state.loading} />
                    <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Icon size={30} name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Profile</Title>
                        </Body>
                       
                    </Header>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                            <Content padder>
                <View  style={{marginTop:20,marginBottom:10}}>
						<TouchableOpacity onPress={this.selectPhoto.bind(this)}>
                        <View style={globalStyle.avatarContainer}>
                            { this.state.avatarsource.uri === '' ? <Image style={globalStyle.avatarBig} source={{uri : this.state.emptyPhoto}} />  :
                                <Image style={globalStyle.avatarBig} source={this.state.avatarsource} />
                                }
                                        </View>
                                        
                                    </TouchableOpacity>
                                    <Label style={{ width: '100%', textAlign: 'center', color: '#16a085',marginBottom:10 }}>{this.state.fullname}</Label>
                            {(this.props.profile.emptyphoto != '1' && this.state.avatarsource.uri != '') &&
                            <TouchableOpacity   onPress={this.removePhoto.bind(this)}>
                            <Text style={globalStyle.deleteButtonSmall} >Remove Photo</Text>
                                        </TouchableOpacity>
                                    
                                    }
                                    
				</View>

                    
					

						

                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >Email</Label>
                                    <Input style={[globalStyle.textinput, {color:'gray'}]} name="email" autoCorrect={false}
                                        value={this.state.email} 
                                        onChangeText={email => this.setState({ email })} editable={false}/>
                                </Item>

					
                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >First name</Label>
                                    <Input style={globalStyle.textinput} name="firstname" autoCorrect={false}
                                        value={this.state.firstname} maxLength={10}
                                        onChangeText={firstname => this.setState({ firstname })} />
                                </Item>

                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >Middle name</Label>
                                    <Input style={globalStyle.textinput} name="middlename" autoCorrect={false}
                                        value={this.state.middlename} maxLength={10}
                                        onChangeText={middlename => this.setState({ middlename })} />
                                </Item>

                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >Last name</Label>
                                    <Input style={globalStyle.textinput} name="lastname" autoCorrect={false}
                                        value={this.state.lastname} maxLength={10}
                                        onChangeText={lastname => this.setState({ lastname })} />
                                </Item>

                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >Last name</Label>
                                    <Input style={globalStyle.textinput} name="lastname" autoCorrect={false}
                                        value={this.state.lastname} maxLength={10}
                                        onChangeText={lastname => this.setState({ lastname })} />
                                </Item>

                                <Item stackedLabel>
                                    <Label style={globalStyle.label} >Mobile No.</Label>
                                    <Input style={globalStyle.textinput} name="mobileno" autoCorrect={false}
                                        value={this.state.mobileno} maxLength={20}
                                        onChangeText={v => this.setState({ mobileno })} />
                                </Item>

						
					
						
					
						
					
                        <Button  onPress={()=>this.onSubmit()}
                        bordered light full  style={globalStyle.secondaryButton}>
                        <Text style={{color:'white'}}>Update</Text>
                        </Button>
					</Content>
				</ScrollView>
                   
                </View>
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
    countries: state.fetchMember.countries,
    profile: state.fetchUser.profile,
    isLoading:state.fetchUser.isLoading,
  })
  
  
  UserProfile=connect(mapStateToProps,{getProfile,updateProfile,displayHomeMember})(UserProfile);
  
export default UserProfile;
  


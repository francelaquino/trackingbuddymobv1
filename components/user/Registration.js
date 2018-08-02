
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform,  StyleSheet,  View, TextInput, TouchableOpacity,ScrollView,Picker, Alert, ToastAndroid, Form ,Image } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button,Text, Icon } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loading  from '../shared/Loading';
import ImagePicker from 'react-native-image-picker';
import Loader from '../shared/Loader';
import firebase from 'react-native-firebase';
import OfflineNotice from '../shared/OfflineNotice';
import { registerUser } from '../../redux/actions/userActions';
var registrationStyle = require('../../assets/style/Registration');



class Register extends Component {
  constructor(props) {
    super(props)
      this.state = {
          loading: false,
          latitude: '',
          longitude: '',
          address: '',
          emptyPhoto: 'https://firebasestorage.googleapis.com/v0/b/trackingbuddy-3bebd.appspot.com/o/member_photos%2Ficons8-person-80.png?alt=media&token=59864ce7-cf1c-4c5e-a07d-76c286a2171d',
          isLoading: true,
          email: 'francel_aquino@yahoo.com',
          password: '111111',
          retypepassword: '111111',
          mobileno: '0538191138',
          firstname: 'Francel',
          middlename: 'Dizon',
          lastname: 'Aquino',
          avatar: '',
          avatarsource: ''

      };
    
  
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
          avatarsource: source
        });
      }
    });
  }



  async componentWillMount() {
  }
       
  




  onValueChange(value: string) {
    this.setState({
      selected: value
    });
  }
  
  
  async onSubmit(){

    
    
   

      if (this.state.email == "") {
          ToastAndroid.showWithGravityAndOffset("Please enter email address", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          return false;
      }
    
      if (this.state.password == "") {
          ToastAndroid.showWithGravityAndOffset("Please enter password", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          return false;
      }

    
      if (this.state.mobileno == "") {
          ToastAndroid.showWithGravityAndOffset("Please enter mobile no", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          return false;
      }
    
      if (this.state.firstname == "") {
          ToastAndroid.showWithGravityAndOffset("Please enter first name", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          return false;
      }
    
      if (this.state.lastname == "") {
          ToastAndroid.showWithGravityAndOffset("Please enter last name", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          return false;
      }
    

      if (this.state.password != this.state.retypepassword) {
          ToastAndroid.showWithGravityAndOffset("Password mismatch", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          return false;
      }
      let user = {
          email: this.state.email,
          password: this.state.password,
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          middlename: this.state.middlename
      }
      this.props.registerUser(user).then((res) => {
      })

      /*firebase.database().ref(".info/connected").on("value", function (snap) {
          if (snap.val() === true) {
              this.setState({ loading: true })
              if (this.state.avatarsource != "") {
                  let avatarlink = this.state.email + '.jpg';

                  const ref = firebase.storage().ref("/member_photos/" + avatarlink);
                  const unsubscribe = ref.putFile(this.state.avatarsource.uri.replace("file:/", "")).on(
                      firebase.storage.TaskEvent.STATE_CHANGED,
                      (snapshot) => {

                      },
                      (error) => {
                          unsubscribe();
                      },
                      (res) => {
                          this.setState({ avatar: res.downloadURL })
                          this.sendSubmit();
                      });
              } else {
                  this.sendSubmit();
              }
          } else {
              ToastAndroid.showWithGravityAndOffset("Network connection error", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          }
      })*/
  }
  async  generateCode(){
    let code="";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      for(let i = 0; i < 7; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
        if(i>=7){
          return code;
        }
      }
      
  }
  async sendSubmit(){
    let self=this;
    let code = "";
    await this.generateCode();
    await firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(this.state.email,this.state.password).then(async (res)=>{

      let uid=res.user.uid;
      res.user.sendEmailVerification();
      let userRef = firebase.database().ref().child("users/"+uid);
                if(this.state.avatar==""){
                  this.setState({avatar:this.state.emptyPhoto});
                }
                await userRef.set({ 
                  email : this.state.email,
                  firstname : this.state.firstname,
                  middlename: this.state.middlename,
                  lastname: this.state.lastname,
                  mobileno: this.state.mobileno,
                  avatar: this.state.avatar,
                  datecreated: Date.now(),
                  dateupdated: Date.now(),
                  invitationcode:code,
                  invitationcodeexpiration: Date.now()+5,
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                  address : this.state.address,
              });

              
	  await this.resetState();
	  ToastAndroid.showWithGravityAndOffset("Registration successfully completed. A message has been sent to your email with instructions to complete your registration",ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);

    }).catch(function(e){
      self.setState({loading:false})
        if(e.code==='auth/email-already-in-use'){
          ToastAndroid.showWithGravityAndOffset("Email aready used",ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 50);
        }else{
           
        }
    })
  }

  async resetState(){
      this.setState({
          email: '',
          password: '',
          retypepassword: '',
          mobileno: '',
          firstname: '',
          middlename: '',
          lastname: '',
          avatar: '',
          longitude: '',
          latitude: '',
          address: '',
          isLoading: false,
          loading: false,
          avatarsource: '',
      })
  }

  loading(){
	  return (
		<Loading/>
	  )
  }
  ready(){
		const { navigate } = this.props.navigation;
	  return (
			<Root>
			<Container style={registrationStyle.containerWrapper} >
      <Loader loading={this.state.loading} />
      <OfflineNotice/>
			<ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
				<View style={registrationStyle.container}>
                    <View  style={{marginBottom:20}}>
						<TouchableOpacity onPress={this.selectPhoto.bind(this)}>
							<View style={registrationStyle.avatarContainer}>
							{ this.state.avatarsource === '' ? <Text style={{fontSize:10,marginTop:32,color:'white'}}>Select a Photo</Text> :
							<Image style={registrationStyle.avatar} source={this.state.avatarsource} />
							}
							</View>
						</TouchableOpacity>
					</View>
         
					
					<Item   style={registrationStyle.regularitem}  >
                        <TextInput  style={registrationStyle.textinput} 
                            underlineColorAndroid= 'transparent'
                            placeholder="Email address"
							name="email" autoCorrect={false} maxLength = {50}
							value={this.state.email}
							onChangeText={email=>this.setState({email})}/>
						</Item>
					
						<Item   style={registrationStyle.regularitem}>
                            <TextInput  style={registrationStyle.textinput } 
                             underlineColorAndroid= 'transparent'
                             placeholder="Password"
								name="password" autoCorrect={false}
								value={this.state.password} secureTextEntry
								onChangeText={password=>this.setState({password})}/>
						</Item>


						<Item   style={registrationStyle.regularitem} >
                            <TextInput  style={registrationStyle.textinput} 
                             underlineColorAndroid= 'transparent'
                             placeholder="Re-Type Passwprd"
								name="retypepassword" autoCorrect={false}
								value={this.state.retypepassword} secureTextEntry
								onChangeText={retypepassword=>this.setState({retypepassword})}/>
						
						</Item>
						<Item   style={registrationStyle.regularitem}>
                            <TextInput  style={registrationStyle.textinput} 
                             underlineColorAndroid= 'transparent'
                             placeholder="First Name" maxLength = {10}
								name="firstname" autoCorrect={false}
								value={this.state.firstname}
								onChangeText={firstname=>this.setState({firstname})}/>
						</Item>
					
						<Item   style={registrationStyle.regularitem}>
                        <TextInput  style={registrationStyle.textinput} 
                         underlineColorAndroid= 'transparent'
                         placeholder="Middle Name" maxLength = {10}
								name="middlename" autoCorrect={false}
								value={this.state.middlename}
								onChangeText={middlename=>this.setState({middlename})}/>
						</Item>
					
						<Item   style={registrationStyle.regularitem}>
                            <TextInput  style={registrationStyle.textinput} 
                             underlineColorAndroid= 'transparent'
                             placeholder="Last Name"
								name="lastname" autoCorrect={false} maxLength = {10}
								value={this.state.lastname}
								onChangeText={lastname=>this.setState({lastname})}/>
					</Item>
						<Item   style={registrationStyle.regularitem}>
                            <TextInput  style={registrationStyle.textinput} 
                             underlineColorAndroid= 'transparent'
                             placeholder="Mobile No."
								name="mobileno" autoCorrect={false}
								value={this.state.mobileno}
								onChangeText={mobileno=>this.setState({mobileno})}/>
						</Item>
					
						
					<View style={{justifyContent: 'center',alignItems: 'center',marginTop:10}}>
						<Button 
							onPress={()=>this.onSubmit()}
							full  style={registrationStyle.registrationbutton}>
							<Text>Register</Text>
						</Button>
						<TouchableOpacity  style={{marginTop:20}} underlayColor={'transparent'} onPress={() =>navigate('Login')}>
						<Text style={registrationStyle.haveaccount}>Already have an acccount? <Text style={registrationStyle.loginButton}>Login</Text></Text>
						</TouchableOpacity>
						
					</View>
					</View>
				</ScrollView>
				</Container>
			</Root>
	  )
  }
  render() {
		  return this.ready();
  }
}



const mapStateToProps = state => ({

})



Register = connect(mapStateToProps, { registerUser })(Register);

export default Register;

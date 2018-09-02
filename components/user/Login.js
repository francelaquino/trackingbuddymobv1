
import React, { Component } from 'react';
import {  BackHandler, AsyncStorage, NetInfo, Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, Image,ToastAndroid, NavigationActions  } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon } from 'native-base';
import firebase from 'react-native-firebase';
import Geocoder from 'react-native-geocoder';
import { connect } from 'react-redux';
import { saveLocationOffline, saveLocationOnline  } from '../../redux/actions/locationActions' ;
import { displayHomeMember } from '../../redux/actions/memberActions' ;
import { userLogin } from '../../redux/actions/userActions' ;
import Loader from '../shared/Loader';
import OfflineNotice from '../shared/OfflineNotice';
import Splash  from '../shared/Splash';
var registrationStyle = require('../../assets/style/Registration');
var userdetails = require('../shared/userDetails');
var globalStyle = require('../../assets/style/GlobalStyle');

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:false,
            email: 'aquinof@rchsp.med.sa',
            password:'111111',
            
        };
       

      }
      
  
     componentDidMount() {
         BackHandler.addEventListener('hardwareBackPress', function () {
             return true;
         });
    }

    onLogin() {

        let self = this;
        if (this.state.email == "" || this.state.password == "") {
            ToastAndroid.showWithGravityAndOffset("Invalid username or wrong password", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            return false;
        }
        this.setState({ loading: true });

        this.props.userLogin(this.state.email, this.state.password).then(async (res) => {

          
            if (res == true) {
                setTimeout(() => {
                    this.props.saveLocationOnline();
                    setTimeout(() => {
                        this.props.displayHomeMember();
                        this.props.navigation.navigate('Home');
                        self.setState({
                            loading: false,
                            email: '',
                            password: '',
                        });
                    }, 500);
                }, 500);
            } else {
                this.setState({ loading: false, email: '', password: '' })
            }
        });

    }
    render() {
        
    const { navigate } = this.props.navigation;
    return (
        <Root>
            <Container style={registrationStyle.containerWrapper}>
          	<Loader loading={this.state.loading} />
                <OfflineNotice />
                
                
            <ScrollView  contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={"always"}>
                    <View style={registrationStyle.container}>
                        <View style={registrationStyle.logoContainer}>
                        <Image  style={registrationStyle.logo} resizeMode='contain'  source={require('../../images/logo.png')} />
                            <Text style={{ fontSize: 15, color:'#16a085',marginTop:10}}>Tracking Buddy</Text>
                        
                        </View>
                       

                        <Item stackedLabel>
                            <Label style={globalStyle.label} >Email Address</Label>
                        <Input style={registrationStyle.textinput} 
                                name="email" autoCorrect={false}
                                autoCapitalize="none"
                            value={this.state.email}  maxLength = {50}
                            onChangeText={email=>this.setState({email})}/>
                        </Item>
                        <Item stackedLabel>
                            <Label style={globalStyle.label} >Password</Label>
                            <Input style={registrationStyle.textinput} 
                            name="password" autoCorrect={false} secureTextEntry
                            value={this.state.password}  maxLength = {50}
                            onChangeText={password=>this.setState({password})}/>
                        </Item>
                       
                        <View style={{justifyContent: 'center',alignItems: 'center',marginTop:20}}>
                            <Button 
                                onPress={()=>this.onLogin()}
                                full  style={registrationStyle.registrationbutton}>
                                <Text style={{color:'white'}}>Login</Text>
                            </Button>
                            
                           
                        </View>
                        <View style={{ alignSelf: 'flex-end', marginTop: 10 }}>
                            <TouchableOpacity underlayColor={'transparent'} onPress={() => navigate('ForgotPassword')}>
                                <Text style={{ color: '#16a085', fontSize: 16 }}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={{justifyContent: 'center',alignItems: 'center',marginTop:20}}>
                            <TouchableOpacity  underlayColor={'transparent'}  onPress={() =>navigate('Register')}>
                            <Text style={registrationStyle.haveaccount}>Don't have an account? <Text style={registrationStyle.loginButton}>Register</Text></Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </Container>
      </Root>
    );
  }
}


  
const mapStateToProps = state => ({
    
  })
  
  
  
  Login=connect(mapStateToProps,{saveLocationOffline,saveLocationOnline,userLogin, displayHomeMember})(Login);
  
export default Login;

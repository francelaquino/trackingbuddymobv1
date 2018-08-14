import React, { Component } from 'react';
import { AsyncStorage, View, Text, NetInfo, Dimensions, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { displayHomeMember } from '../../redux/actions/memberActions';
const { width, height } = Dimensions.get('window');
var userdetails = require('../shared/userDetails');


class Splash extends Component {

    async componentDidMount() {
        let self = this;
        let userid = await AsyncStorage.getItem("userid");
        let email = await AsyncStorage.getItem("email");
        let firstname = await AsyncStorage.getItem("firstname");
        let lastname = await AsyncStorage.getItem("lastname");
        setTimeout(async () => {
            if (userid === "" || userid === null) {
                self.props.navigation.navigate('Login');
            } else {
                userdetails.userid = userid;
                userdetails.email = email;
                userdetails.firstname = firstname;
                userdetails.lastname = lastname;
                setTimeout(() => {
                    self.props.displayHomeMember();
                    self.props.navigation.navigate('Home');
                }, 1000);


            }

        }, 2000);
    }

    render() {
            return (
                <View style={{  zIndex: 99999, height: height+30, backgroundColor:'#16a085' }} >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image style={{ height: 200, marginTop: -150 }} resizeMode='contain' source={require('../../images/logo_splash.png')} />
                    <Text style={{ fontSize: 15, color: 'white',position:'absolute',bottom:30 }}>Tracking Buddy</Text>

                </View>
               
                    
                </View >
            )
    }
}


const mapStateToProps = state => ({

})



Splash = connect(mapStateToProps, { displayHomeMember })(Splash);

export default Splash;


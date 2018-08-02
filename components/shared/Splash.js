import React, { Component } from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { setConnection } from '../../actions/connectionActions';
const { width, height } = Dimensions.get('window');



class Splash extends Component {


    render() {
        if (this.props.hide) {
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
        } else {
            return null;
        }
    }
}




const mapStateToProps = state => ({

})

Splash = connect(mapStateToProps, { })(Splash);

export default Splash;


    
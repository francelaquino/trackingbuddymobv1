
import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet,ActivityIndicator } from 'react-native';
import { Content } from 'native-base';


class Loading extends Component{
    render() {
        return (
            <Content padder>
            <View style={[styles.container]}>
            <ActivityIndicator size="large"  color="#096d71" />
            
            </View>
            </Content>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop:30
    }
  })
export default  Loading;

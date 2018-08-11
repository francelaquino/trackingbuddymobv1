
import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet,ActivityIndicator } from 'react-native';
import { Content } from 'native-base';


class Loading extends Component{
    render() {
        return (
            <Content style={{ backgroundColor:'white' }}>
            <View style={[styles.container]}>
            <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator color="gray" />
                <Text style={{ color: 'gray',marginTop:10 }}>Please wait</Text>
            </View>
                </View>
            </Content>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height ,
    },
    activityIndicatorWrapper: {
        marginTop:-50,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    }
  })
export default  Loading;

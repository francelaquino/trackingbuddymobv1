
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid, Image } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Content, List, ListItem,Left, Right,Switch, Thumbnail } from 'native-base';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LeftHome } from '../shared/LeftHome';
import { displayMember  } from '../../actions/memberActions' ;

var globalStyle = require('../../assets/style/GlobalStyle');



class HomePlaces extends Component {
    constructor(props) {
        super(props)
      }

      
    componentWillMount() {
    }


    render() {
        
        return (
            <Root>
                <Container style={globalStyle.containerWrapper}>
                    <Header style={globalStyle.header}>
                        <LeftHome/>
                        <Body>
                            <Title>Home</Title>
                        </Body>
                       
                    </Header>
                    <View style={styles.mainContainer}>
                        <View style={styles.navBar} />
                        <View style={styles.body} />
                    </View>
                </Container>
            </Root>
        );
  }
}



const styles = StyleSheet.create({
    mainContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor:'red'
    },
    navBar: {
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'green',
      height: 30,
      flex: 3,
    },
    body: {
      flex: 2,
      display: 'flex',
      backgroundColor: 'blue',
    },
  });

const mapStateToProps = state => ({
  })
  
  
//DisplayMember=connect(mapStateToProps,{displayMember})(DisplayMember);
  
export default HomePlaces;
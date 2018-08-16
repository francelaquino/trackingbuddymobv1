
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ToastAndroid, Share } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Right, Content } from 'native-base';
import Loading  from '../shared/Loading';
import { connect } from 'react-redux';
import Loader from '../shared/Loader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OfflineNotice  from '../shared/OfflineNotice';
import { generateInvitationCode, getInvitationCode  } from '../../redux/actions/memberActions' ;
var globalStyle = require('../../assets/style/GlobalStyle');
var userdetails = require('../shared/userDetails');


class GenerateInviteCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            isbusy: true,
            invitationcode:'',
            expiration:'',
        };
      }

    componentWillMount() {
        this.props.getInvitationCode().then(res => {
            if (res == true) {
                this.setState({ isbusy: false })
            }
        });
    }
            
    
    onGenerate(){
        this.setState({loading:true})
        this.props.generateInvitationCode().then(res=>{
            this.props.getInvitationCode();
            this.setState({loading:false})
            
        }).catch(function(err) {
            this.setState({loading:false})
        });
    }


    onShare() {
        Share.share({
            message: 'Invitation Code : '+ this.props.invitationcode.code
        }).then(res => {
        });
    }


   
    loading(){
        return (
          <Loading/>
        )
    }
    ready(){
        return (
            
                
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                <Content padder>
                        <View style={globalStyle.container}>
                        { this.props.invitationcode.code !='' &&
                                    <View >
                                    <Text style={{justifyContent: 'center',alignItems: 'center', alignSelf: "center", flexDirection:'column',fontSize:40,marginBottom:2,color:'green'}}>{this.props.invitationcode.code}</Text>
                                    <Text style={{justifyContent: 'center',alignItems: 'center', alignSelf: "center", flexDirection:'column',fontSize:12,marginBottom:5,color:'gray'}}>Expires on {this.props.invitationcode.expiration}</Text>
                                    </View>
                        }
                        <Content padder>
                            <View style={{justifyContent: 'center',alignItems: 'center'}}>
                                <Button 
                                    onPress={()=>this.onGenerate()}
                                    bordered light full style={globalStyle.secondaryButton}>
                                    <Text style={{color:'white'}}>Generate Code</Text>
                                    </Button>
                                   
                            </View>
                            </Content>

                    </View>
                    </Content>
                    </ScrollView>
               
        )
    }
    

    render() {

        return (
            <Root>
                <Loader loading={this.state.loading} />
                <OfflineNotice />
                <Container style={globalStyle.containerWrapper}>

                    <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Ionicons size={30} style={{ color: 'white' }} name='ios-arrow-back' />
                            </Button>
                        </Left>
                        <Body style={globalStyle.headerBody} >
                            <Title>INVITATION CODE</Title>
                        </Body>
                        <Right style={globalStyle.headerRight}  >
                            <Button transparent onPress={() => this.onShare()}>
                                <MaterialIcons size={28} style={{ color: 'white' }} name='share' />
                            </Button>

                        </Right>
                    </Header>

                    {
                        this.state.isbusy ? this.loading() :
                            this.ready()
                    }

                   
                </Container>


            </Root>
        )

      
    }
}


const mapStateToProps = state => ({
    invitationcode: state.fetchMember.invitationcode,
    isLoading:state.fetchMember.isLoading,
  })
  
  
  GenerateInviteCode=connect(mapStateToProps,{getInvitationCode,generateInvitationCode})(GenerateInviteCode);
  
  
  
export default GenerateInviteCode;
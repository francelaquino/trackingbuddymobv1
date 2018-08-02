
import React, { Component } from 'react';
import {  Platform,  StyleSheet,  Text,  View, ScrollView,TextInput, TouchableOpacity, ToastAndroid, Image } from 'react-native';
import { Root, Container, Header, Body, Title, Item, Input, Label, Button, Icon, Left, Content } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import Loader  from '../shared/Loader';
import OfflineNotice  from '../shared/OfflineNotice';
import { connect } from 'react-redux';
import { createGroup,displayGroup  } from '../../actions/groupActions' ;
var globalStyle = require('../../assets/style/GlobalStyle');
var registrationStyle = require('../../assets/style/Registration');



class CreateGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            emptyPhoto: 'https://firebasestorage.googleapis.com/v0/b/trackingbuddy-3bebd.appspot.com/o/group_photos%2Fgroup.png?alt=media&token=d1bade4b-6fee-43f7-829a-0b6f76005b40',
            groupname: '',
            avatarsource: '',
            avatar: '',
        };
    }

	
	
	
	
	removePhoto(){
		this.setState({avatarsource:''});
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
            console.log(response)
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
    randomString(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    onSubmit() {
        if (this.state.groupname == "") {
            return false;
        }
        this.setState({ loading: true })
        this.props.createGroup(this.state.groupname, this.state.avatarsource).then(res => {
            if (res !== "") {
                this.setState({ loading: false })
                ToastAndroid.showWithGravityAndOffset(res, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                this.props.displayGroup();
                this.props.navigation.goBack();
            } else {
                this.setState({ loading: false })
            }
        });
    }

	loading(){
	  return (
		<Root>
		<Container style={registrationStyle.containerWrapper}>
		<View>
			<Text>Loading</Text>
		</View>
		</Container>
		</Root>
	  )
  }
    ready() {
        return (
            <Root>
                <Loader loading={this.state.loading} />
                <OfflineNotice />
                <Container style={globalStyle.containerWrapper}>
                    <Header style={globalStyle.header}>
                        <Left style={globalStyle.headerLeft} >
                            <Button transparent onPress={() => { this.props.navigation.goBack() }} >
                                <Icon size={30} name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Create Group</Title>
                        </Body>
                    </Header>
                    <Content padder>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
                            <View style={globalStyle.container}>
                                <TouchableOpacity style={{ marginTop: 20 }} onPress={this.selectPhoto.bind(this)}>
                                    <View style={globalStyle.avatarContainer}>
                                        {this.state.avatarsource === '' ? <Image style={globalStyle.avatarBig} source={{ uri: this.state.emptyPhoto }} /> :
                                            <Image style={globalStyle.avatarBig} source={this.state.avatarsource} />
                                        }

                                    </View>
                                </TouchableOpacity>
                                {this.state.avatarsource != '' &&
                                    <TouchableOpacity onPress={this.removePhoto.bind(this)}>
                                        <Text style={globalStyle.deleteButtonSmall} >Remove Photo</Text>
                                    </TouchableOpacity>
                                }
                                <Item style={globalStyle.regularitem}>
                                    <TextInput style={globalStyle.textinput}
                                        underlineColorAndroid='transparent'
                                        placeholder="Group Name"
                                        name="groupname" autoCorrect={false}
                                        value={this.state.groupname} maxLength={20}
                                        onChangeText={groupname => this.setState({ groupname })} />
                                </Item>


                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Button disabled={!this.state.groupname} style={this.state.groupname ? globalStyle.secondaryButton : globalStyle.secondaryButtonDisabled}
                                        onPress={() => this.onSubmit()}
                                        bordered light full  >
                                        <Text style={{ color: 'white' }}>Create Group</Text>
                                    </Button>
                                </View>

                            </View>
                        </ScrollView>
                    </Content>
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
  
CreateGroup=connect(mapStateToProps,{createGroup,displayGroup})(CreateGroup);
  
export default CreateGroup;

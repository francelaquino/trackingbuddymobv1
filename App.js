
import React, { Component } from 'react';
import { AppRegistry, View,Text} from 'react-native';
import DisplayGroup from './components/group/DisplayGroup';
import DisplayHomeGroup from './components/group/DisplayHomeGroup';
import EditGroup from './components/group/EditGroup';
import AddMember from './components/group/AddMember';
import MembersGroup from './components/group/MembersGroup';
import DisplayMember from './components/member/DisplayMember';
import GenerateInviteCode from './components/member/GenerateInviteCode';
import InfoMember from './components/member/InfoMember';
import NewInvite from './components/member/NewInvite';
import HomePlaces from './components/places/HomePlaces';
import { DrawerNavigator } from 'react-navigation'


const Drawer= DrawerNavigator({
    HomePlaces: { 
      screen: HomePlaces,
      headerMode: 'none',
      navigationOptions: {
          header: null
      }
    },
    DisplayMember: { 
        screen: DisplayMember,
        headerMode: 'none',
        navigationOptions: {
            header: null
        } 
    },
    DisplayGroup: { 
        screen: DisplayGroup,
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
      } 
    })


class App extends Component{
  constructor(props){
    super(props);
    this.state = { mounted: false };
  }
  componentDidMount(){
    setTimeout(() => {
      this.setState({ mounted: true });
      
    }, 5000);
  }
  render(){
    if(this.state.mounted){
      return (
        <View><Text>ffff</Text>
        </View>
      )
    }else{
      return (
        <View><Text>dfdf</Text>
        </View>
      )
    }
  }
}


export default App;
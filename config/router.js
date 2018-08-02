import  React  from 'react';
import { TabNavigator } from 'react-navigation';
import InfoMember from '../components/member/InfoMember';
import LocationPlaces from '../components/places/LocationPlaces';



export const MemberTabs= TabNavigator({
    MemberProfile:{
        screen:InfoMember,
    },
    MemberLocations:{
        screen:LocationPlaces,
    }

});
import { DISPLAY_MEMBER, INVITE_MEMBER, GET_INVITATIONCODE, GET_COUNTRIES, GENERATE_INVITATIONCODE, GET_MEMBER, DELETE_MEMBER, DISPLAY_HOME_MEMBER, DISPLAY_GROUP_MEMBER,CLEAR_HOME_MEMBERS } from './types';
import firebase from 'react-native-firebase';
import {  ToastAndroid } from 'react-native';
import Moment from 'moment';
import axios from 'axios';
var settings = require('../../components/shared/Settings');
var userdetails = require('../../components/shared/userDetails');



export const displayHomeMember=()=> async dispatch=> {
    dispatch({ 
        type: DISPLAY_HOME_MEMBER,
        payload: [],
    });
    let members=[];
    let count=0;
    let cnt=0;

    if(userdetails.group==""){
        await firebase.database().ref().child('users/'+userdetails.userid).once("value",function(snapshot){
            if(snapshot.val() !== null){
                members.push({
                    id:snapshot.key,
                    firstname:snapshot.val().firstname,
                    avatar: snapshot.val().avatar,
                    address : snapshot.val().address,
                    coordinates:{
                        longitude: Number(snapshot.val().longitude),
                        latitude: Number(snapshot.val().latitude)
                    }
                });
               
            }
        })

        await firebase.database().ref().child('users/'+userdetails.userid+"/members").once('value',async function(snapshot){
            if(snapshot.val()===null){
                dispatch({ 
                    type: DISPLAY_HOME_MEMBER,
                    payload: members,
                });

            }else{
                count=snapshot.numChildren();
                await snapshot.forEach(async childSnapshot  => {
                    let userid=childSnapshot.key;
                        await firebase.database().ref().child('users/'+userid).once("value",function(dataSnapshot){
                            if(dataSnapshot.val() !== null){
                                members.push({
                                    id:dataSnapshot.key,
                                    firstname:dataSnapshot.val().firstname,
                                    avatar: dataSnapshot.val().avatar,
                                    address : dataSnapshot.val().address,
                                    coordinates:{
                                        longitude: Number(dataSnapshot.val().longitude),
                                        latitude: Number(dataSnapshot.val().latitude),
                                    }
                                });
                             
                                
                            }
                            cnt++;
                            if(cnt>=count){
                                dispatch({ 
                                    type: DISPLAY_HOME_MEMBER,
                                    payload: members,
                                });
                              
                            }
                        })
                })

            }
        })

       
           
    }else{

        return parentPromise= new Promise((resolve,reject)=>{
            let memberRef = firebase.database().ref().child("groupmembers/"+userdetails.group).once('value',function(snapshot){
                resolve(snapshot)
            })
            }).then(function(snapshot){
                if(snapshot.val()===null){
                    dispatch({ 
                        type: DISPLAY_HOME_MEMBER,
                        payload: members,
                    });
                }else{
                    count=snapshot.numChildren();
                    snapshot.forEach(childSnapshot => {
                        let userid=childSnapshot.key;
                        return childPromise= new Promise((resolve,reject)=>{
                            let childRef= firebase.database().ref().child('users/'+userid).once("value",function(snapshot){
                                if(snapshot.val() !== null){
                                    members.push({
                                        id:snapshot.key,
                                        firstname:snapshot.val().firstname,
                                        avatar: snapshot.val().avatar,
                                        coordinates:{
                                            longitude: Number(snapshot.val().longitude),
                                            latitude: Number(snapshot.val().latitude)
                                        },
                                        address : snapshot.val().address,
                                    });
                                }
                                cnt++;
                                if(cnt>=count){
                                    resolve();
                                }
                                
                            })
                        }).then(function(snapshot){
                            dispatch({ 
                                type: DISPLAY_HOME_MEMBER,
                                payload: members,
                            });
                        })
                    })
                }
            
        })
    }

};











export const clearHomeMembers=()=> dispatch=> {
    
        dispatch({ 
            type: CLEAR_HOME_MEMBERS,
            payload: []
        });
   
};


export const getCountrries=()=> dispatch=> {
    let countries:{
        id: "",
        countrycode: "",
        country: "",
      }

      let count=0;
      let cnt=0;
    return new Promise((resolve) => {
        firebase.database().ref().child('countries').orderByChild("country").once('value', async (dataSnapshot)=> {
            let countries=[];
            if(dataSnapshot.exists){
                count=dataSnapshot.numChildren();
                await dataSnapshot.forEach(function(child) {
                    countries.push({
                      id: child.val().id,
                      countrycode: child.val().countrycode,
                      country: child.val().countrycode+" "+ child.val().country
                    })
                    cnt++;
                            if(cnt>=count){
                                dispatch({ 
                                    type: GET_COUNTRIES,
                                    payload: countries
                                });
                                resolve()
                            }
                          
                    
                });
               
    
            }
        
        })
    }).catch(function(err) {
        dispatch({ 
            type: GET_COUNTRIES,
            payload: []
        });
        resolve()
    });

   
};


//Update Code



export const generateInvitationCode = () => async dispatch => {
    return new Promise(async (resolve) => {
        try {

            await axios.post(settings.baseURL + 'member/generateinvititationcode', {
                email: userdetails.email,
                uid: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
                    resolve(true)
                } else {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
            }).catch(function (error) {
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })


};
export const getInvitationCode = () => async dispatch => {
       


        return new Promise(async (resolve) => {
            try {
                await axios.get(settings.baseURL + 'member/getmemberinfo/' + userdetails.userid)
                    .then(function (res) {
                        console.log(res)
                        if (res.data.status == "202") {
                            let invitationcode = {
                                code: res.data.results.invitationcode,
                                expiration: res.data.results.invitationcodeexpiration,
                            }
                            dispatch({
                                type: GET_INVITATIONCODE,
                                payload: invitationcode
                            });
                            resolve(true)
                        } else {
                            dispatch({
                                type: GET_INVITATIONCODE,
                                payload: []
                            });
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        }
                    }).catch(function (error) {
                        console.log(error)
                        dispatch({
                            type: GET_INVITATIONCODE,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    });

            } catch (e) {
                console.log(e)
                dispatch({
                    type: GET_INVITATIONCODE,
                    payload: []
                });
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
        });


};


export const addMember = (invitationcode) => async dispatch => {
    return new Promise(async (resolve) => {
        try {

            await axios.post(settings.baseURL + 'member/addmember', {
                invitationcode: invitationcode,
                uid: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
                    if (res.data.results == "") {
                        ToastAndroid.showWithGravityAndOffset("Member successfully added", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        resolve(true)
                    } else {
                        ToastAndroid.showWithGravityAndOffset(res.data.results, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        resolve(false)
                    }
                  
                   
                } else {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
                }).catch(function (error) {
                   
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })


};



export const addGroupMember = (groupid,member) => async dispatch => {
    return new Promise(async (resolve) => {
        try {
            await axios.post(settings.baseURL + 'member/addgroupmember', {
                memberuid: member.uid,
                groupid: groupid,
                owner: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
                        resolve(true)
                } else {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
                }).catch(function (error) {
                   
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })


};



export const removeGroupMember = (groupid,member) => async dispatch => {
    return new Promise(async (resolve) => {
        try {
            await axios.post(settings.baseURL + 'member/removegroupmember', {
                memberuid: member.uid,
                groupid: groupid,
                owner: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
                        resolve(true)
                } else {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
                }).catch(function (error) {
                   
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })


};


export const displayMember = () => async dispatch => {

    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'member/getmembers/' + userdetails.userid)
                .then(function (res) {
                    if (res.data.status == "202") {
                        dispatch({
                            type: DISPLAY_MEMBER,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: DISPLAY_MEMBER,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                    dispatch({
                        type: DISPLAY_MEMBER,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {
            dispatch({
                type: DISPLAY_MEMBER,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });

};




export const getMember = (userid) => async dispatch => {
    console.log(userid)
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'member/getmemberinfo/' + userid)
                .then(function (res) {
                    if (res.data.status == "202") {
                        console.log(res.data.results)
                        dispatch({
                            type: GET_MEMBER,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: GET_MEMBER,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                    dispatch({
                        type: GET_MEMBER,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {
            dispatch({
                type: GET_MEMBER,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });

};



export const deleteMember=(memberuid)=> async dispatch=> {

    return new Promise(async (resolve) => {
        try {

            await axios.post(settings.baseURL + 'member/deletemember', {
                memberuid: memberuid,
                owneruid: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
                    ToastAndroid.showWithGravityAndOffset("Member successfully deleted", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    resolve(true)
                } else {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
            }).catch(function (error) {
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })
        
};



export const displayGroupMember=(groupid)=> dispatch=> {
    groupid=10;
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'group/getmembers/' + groupid+"/"+ userdetails.userid)
                .then(function (res) {
                    if (res.data.status == "202") {
                        dispatch({
                            type: DISPLAY_GROUP_MEMBER,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: DISPLAY_GROUP_MEMBER,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                    dispatch({
                        type: DISPLAY_GROUP_MEMBER,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {
            dispatch({
                type: DISPLAY_GROUP_MEMBER,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });



};



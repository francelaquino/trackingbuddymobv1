import { CREATE_GROUP, DISPLAY_GROUP, DELETE_GROUP } from './types';
import { BASE_URL } from '../constants'
import firebase from 'react-native-firebase';
import { ToastAndroid } from 'react-native';
var userdetails = require('../components/shared/userDetails');

randomString=(length)=>{  
    let text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
    

export const createGroup=(groupname,avatarsource)=> dispatch=> {
    let emptyPhoto='https://firebasestorage.googleapis.com/v0/b/trackingbuddy-3bebd.appspot.com/o/group_photos%2Fgroup.png?alt=media&token=d1bade4b-6fee-43f7-829a-0b6f76005b40';
    let avatar="";
    return new Promise((resolve) => {

        firebase.database().ref(".info/connected").on("value", function (snap) {
            if (snap.val() === true) {

                firebase.database().ref().child("groups/" + userdetails.userid).orderByChild("groupname").equalTo(groupname).once("value", snapshot => {
                    if (snapshot.val()) {
                        resolve("Group already exist");
                    } else {
                        let groupid = userdetails.userid + randomString(4);
                        if (avatarsource != "") {
                            let avatarlink = groupid + ".jpg";
                            let ref = firebase.storage().ref("/group_photos/" + avatarlink);
                            ref.putFile(avatarsource.uri.replace("file:/", "")).then(res => {
                                avatar = res.downloadURL;
                                setTimeout(() => {
                                    let groupRef = firebase.database().ref().child("groups/" + userdetails.userid + "/" + groupid);
                                    groupRef.set({
                                        id: groupid,
                                        groupname: groupname,
                                        avatar: avatar,
                                        datecreated: Date.now(),
                                        dateupdated: Date.now(),
                                    })
                                        .catch(function (err) {
                                            console.log('error', err);
                                        });

                                    resolve("Group successfully created");
                                }, 0);
                            })
                                .catch(function (err) {
                                    console.log('error', err);

                                });
                        } else {
                            setTimeout(() => {
                                let groupRef = firebase.database().ref().child("groups/" + userdetails.userid + "/" + groupid);
                                groupRef.set({
                                    id: groupid,
                                    groupname: groupname,
                                    avatar: emptyPhoto,
                                    datecreated: Date.now(),
                                    dateupdated: Date.now(),
                                })
                                    .catch(function (err) {
                                        console.log('error', err);
                                    });
                                resolve("Group successfully created");
                            }, 0);
                        }
                    }
                }).catch(function (err) {
                    console.log('error', err);
                    resolve("");

                });
            } else {
                resolve("");
                ToastAndroid.showWithGravityAndOffset("Network connection error", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
        });
    });
};



export const displayGroup=()=> dispatch=> {
    let groups=[];
    firebase.database().ref(".info/connected").on("value", function (snap) {
        if (snap.val() === true) {
            return new Promise((resolve) => {

                firebase.database().ref().child('groups/' + userdetails.userid).orderByChild("groupname").on('value', (snapshot) => {
                    resolve(snapshot);
                });

            }).then(function (snapshot) {
                if (snapshot.exists) {
                    snapshot.forEach(function (child) {
                        groups.push({
                            id: child.key,
                            groupname: child.val().groupname,
                            avatar: child.val().avatar
                        })
                    });
                }
                dispatch({
                    type: DISPLAY_GROUP,
                    payload: groups,
                });
            }).catch(function (error) {
                console.log(error)
            });
        } else {
            dispatch({
                type: DISPLAY_GROUP,
                payload: [],
            });
            ToastAndroid.showWithGravityAndOffset("Network connection error", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });

};




export const deleteGroup=(groupid)=> dispatch=> {
    return new Promise((resolve) => {
        let groupRef=firebase.database().ref().child("groups/"+userdetails.userid+"/"+groupid);
        groupRef.remove()
        .catch(function(err) {
            resolve("")
        });
        
        let avatarlink=groupid+".jpg";

        let ref = firebase.storage().ref("/group_photos/"+avatarlink);
        ref.delete().then(res => {
        })
        .catch(function(err) {
              resolve("")
        });
        resolve("Group successfully deleted");
    });
};

export const updateGroup=(group)=> dispatch=> {
    let emptyPhoto='https://firebasestorage.googleapis.com/v0/b/trackingbuddy-3bebd.appspot.com/o/group_photos%2Fgroup.png?alt=media&token=d1bade4b-6fee-43f7-829a-0b6f76005b40';
    let avatar="";
    return new Promise((resolve) => {
        firebase.database().ref().child("groups/"+userdetails.userid).orderByChild("groupname").equalTo(group.groupname).once("value",snapshot => {
            let key="";
            snapshot.forEach(function(childSnapshot) {
                key =childSnapshot.key;
            });
            if(key==group.groupid || key==""){
                if(group.isPhotoChange==true){
                    let avatarlink=group.groupid+".jpg";
                    const ref = firebase.storage().ref("/group_photos/"+avatarlink);
                    ref.putFile(group.avatarsource.uri.replace("file:/", "")).then(res => {
                        avatar=res.downloadURL;
                        setTimeout(() => {
                            let groupRef = firebase.database().ref().child("groups/"+userdetails.userid+"/"+group.groupid);
                                groupRef.update({ 
                                        groupname : group.groupname,
                                        avatar: avatar,
                                        dateupdated: Date.now(),
                                        
                                })
                                .catch(function(err) {
                                    resolve("")
                                });
                                resolve("Group successfully updated");
                        }, 0);
                    })
                    .catch(function(err) {
                        resolve("")
                      });
                }else{
                    
                    if(group.avatarsource.uri=="" || group.avatarsource.uri==undefined){
                        avatar=emptyPhoto;
                    }else{
                        avatar=group.avatarsource.uri;
                    }
                    
                    setTimeout(() => {
                        let groupRef = firebase.database().ref().child("groups/"+userdetails.userid+"/"+group.groupid);
                                groupRef.update({ 
                                        groupname : group.groupname,
                                        avatar: avatar,
                                        dateupdated: Date.now(),
                                })
                                .catch(function(err) {
                                    resolve("")
                                });
                                resolve("Group successfully updated");
                    }, 0);
                }
             }else{
                resolve("Group already exist");
             }
           
        }).catch(function(err) {
            resolve("");
            
        });
    });
};


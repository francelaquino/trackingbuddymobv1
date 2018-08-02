import { SIGNIN_USER,REGISTRATION_USER, NO_CONNECTION, GET_PROFILE } from './types';
import { ToastAndroid, AsyncStorage } from 'react-native';
import axios from 'axios';
import firebase from 'react-native-firebase';
import Moment from 'moment';
var settings = require('../../components/shared/Settings');
var userdetails = require('../../components/shared/userDetails');

export const submitSignUp=(user)=> dispatch=> {
  return new Promise((resolve) => {
    firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(user.email,user.password).then((response)=>{
      //let uid=response.uid;
      console.log(response)
      //dispatch({type: SIGNIN_USER});
    }).catch(function(e){
      console.log(e.Error)
    })
  });
    
};







export const getProfile = () => dispatch => {
   
    try {
        return new Promise((resolve) => {
            firebase.database().ref(".info/connected").on("value", function (snap) {
                if (snap.val() === true) {
                    firebase.database().ref().child("users/" + userdetails.userid).once("value", function (snapshot) {
                        let profile = {
                            firstname: snapshot.val().firstname,
                            lastname: snapshot.val().lastname,
                            middlename: snapshot.val().middlename,
                            email: snapshot.val().email,
                            avatar: snapshot.val().avatar,
                            mobileno: snapshot.val().mobileno,
                        }
                        dispatch({
                            type: GET_PROFILE,
                            payload: profile
                        });
                        resolve("");
                    });
                } else {
                    dispatch({
                        type: GET_PROFILE,
                        payload: []
                    });
                    resolve("Network connection error")
                }
            })
        });
    } catch (e) {
        dispatch({
            type: GET_PROFILE,
            payload: []
        });
    }
       
};



export const updateProfile = (info) => async dispatch => {
    let emptyPhoto = 'https://firebasestorage.googleapis.com/v0/b/trackingbuddy-3bebd.appspot.com/o/member_photos%2Ficons8-person-80.png?alt=media&token=59864ce7-cf1c-4c5e-a07d-76c286a2171d';
    let avatar = "";
    return new Promise(async (resolve) => {
        firebase.database().ref(".info/connected").on("value", function (snap) {
            if (snap.val() === true) {
                if (info.isPhotoChange == true) {

                    let avatarlink = info.email + '.jpg';

                    const ref = firebase.storage().ref("/member_photos/" + avatarlink);
                    const unsubscribe = ref.putFile(info.avatarsource.uri.replace("file:/", "")).on(
                        firebase.storage.TaskEvent.STATE_CHANGED,
                        (snapshot) => {

                        },
                        (error) => {
                            unsubscribe();
                        },
                        async (res) => {
                            avatar = res.downloadURL;
                            firebase.database().ref().child("users/" + userdetails.userid).update({
                                firstname: info.firstname,
                                middlename: info.middlename,
                                lastname: info.lastname,
                                mobileno: info.mobileno,
                                avatar: avatar,
                                dateupdated: Date.now(),
                            });
                            resolve("");
                        });
                } else {
                    if (info.avatarsource.uri == "" || info.avatarsource.uri == undefined) {
                        firebase.database().ref().child("users/" + userdetails.userid).update({
                            firstname: info.firstname,
                            middlename: info.middlename,
                            lastname: info.lastname,
                            mobileno: info.mobileno,
                            avatar: emptyPhoto,
                            dateupdated: Date.now(),
                        });
                    } else {
                        firebase.database().ref().child("users/" + userdetails.userid).update({
                            firstname: info.firstname,
                            middlename: info.middlename,
                            lastname: info.lastname,
                            mobileno: info.mobileno,
                            dateupdated: Date.now(),
                        });
                    }

                    resolve("");
                }
            } else {
                resolve("Network connection error");
            }
        })
           
    });

};




export const userLogin = (email, password) => async dispatch => {
    
    return new Promise(async (resolve) => {
                firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
                    .then(function (res) {
                        //if(res.user.emailVerified){
                        let childPromise = new Promise( (childResolve) => {
                             firebase.database().ref().child('users/' + res.user.uid).on('value', function (snapshot) {
                                userdetails.userid = res.user.uid;
                                userdetails.email = snapshot.val().email;
                                userdetails.firstname = snapshot.val().firstname;
                                userdetails.lastname = snapshot.val().lastname;
                                AsyncStorage.setItem("userid", userdetails.userid);
                                AsyncStorage.setItem("email", userdetails.email);
                                AsyncStorage.setItem("firstname", userdetails.firstname);
                                 AsyncStorage.setItem("lastname", userdetails.lastname);
                                AsyncStorage.setItem("offlineLocation", "");
                                childResolve();
                            });
                        }).then(function () {
                            resolve("");
                        })

                        /*}else{
                          resolve("Invalid username or bad password")
                        }*/

                    })
                    .catch(function (err) {
                        resolve("Invalid username or bad password")
                    });
      
    })

};
//Update code



export const registerUser = (user) => async dispatch => {
    
    return new Promise(async (resolve) => {
        try {

           /* const formData = new FormData();
            formData.append('email', user.email);
            formData.append('uid', '1');
            formData.append('firstname', user.firstname);
            formData.append('lastname', user.lastname);
            formData.append('middlename', user.middlename);

            axios.post(settings.baseURL + 'member/register', {
                method: "POST",
                headers: {
                    'Content-Type': 'multipart/form-data; charset=utf-8;'
                },
                body: formData
            }).then(function (response) {
                console.log(response);
            }).catch(function (error) {
                console.log(error);
            });*/

            axios.post(settings.baseURL + 'member/register', {
                email: user.email,
                uid: '1',
                firstname: user.firstname,
                lastname: user.lastname,
                middlename: user.middlename,
            }).then(function (res) {
                console.log(res)
                if (res.data.status == "202") {
                    ToastAndroid.showWithGravityAndOffset("Registration successfully completed. A message has been sent to your email with instructions to complete your registration", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                } else {
                    ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
                }).catch(function (error) {
                    console.log(error)
                 ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
             });

            /*await firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(user.email, user.password).then(async (res) => {

                let uid = res.user.uid;
                res.user.sendEmailVerification();
                resolve(true)


            }).catch(function (e) {
                console.log(e)
                if (e.code === 'auth/email-already-in-use') {
                    ToastAndroid.showWithGravityAndOffset("Email aready used", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                } else {
                    ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
                resolve(false)
            })*/
        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        };

    })

};
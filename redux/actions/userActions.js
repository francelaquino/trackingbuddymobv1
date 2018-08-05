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


export const updateProfile = (profile) => async dispatch => {
    let avatar = "";
    return new Promise(async (resolve) => {
        try {
            let avatar = "";
            console.log(profile)
            if (profile.isPhotoChange == true) {
                let avatarlink = profile.email + '.jpg';

                const ref = firebase.storage().ref("/member_photos/" + avatarlink);
                const unsubscribe = ref.putFile(profile.avatarsource.uri.replace("file:/", "")).on(
                    firebase.storage.TaskEvent.STATE_CHANGED,
                    (snapshot) => {

                    },
                    (error) => {
                        unsubscribe();
                    },
                    async (resUrl) => {
                        avatar = resUrl.downloadURL;
                        await axios.post(settings.baseURL + 'member/updateprofile', {
                            email: profile.email,
                            uid: userdetails.userid,
                            avatar: avatar,
                            firstname: profile.firstname,
                            lastname: profile.lastname,
                            middlename: profile.middlename,
                            mobileno: profile.mobileno,
                        }).then(function (res) {
                            if (res.data.status == "202") {
                                resolve(true)
                                ToastAndroid.showWithGravityAndOffset("Profile successfully updated.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                            } else {
                                resolve(false)
                                ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                            }
                        }).catch(function (error) {
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        });
                    })
            } else {
                await axios.post(settings.baseURL + 'member/updateprofile', {
                    email: profile.email,
                    uid: userdetails.userid,
                    avatar: profile.avatarsource.uri,
                    firstname: profile.firstname,
                    lastname: profile.lastname,
                    middlename: profile.middlename,
                    mobileno: profile.mobileno,
                }).then(function (res) {
                    if (res.data.status == "202") {
                        resolve(true)
                        ToastAndroid.showWithGravityAndOffset("Profile successfully updated.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    } else {
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });
            }


        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })


};


export const getProfile = () => async dispatch => {
        return new Promise(async (resolve) => {
            try {
                await axios.get(settings.baseURL + 'member/getmemberinfo/' + userdetails.userid)
                    .then(function (res) {
                        if (res.data.status == "202") {
                            dispatch({
                                type: GET_PROFILE,
                                payload: res.data.results
                            });
                            resolve(true)
                        } else {
                            dispatch({
                                type: GET_PROFILE,
                                payload: []
                            });
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        }
                    }).catch(function (error) {
                        dispatch({
                            type: GET_PROFILE,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    });

            } catch (e) {
                dispatch({
                    type: GET_PROFILE,
                    payload: []
                });
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }
        });

};


export const registerUser = (profile) => async dispatch => {
    
    return new Promise(async (resolve) => {
        try {

            let avatar = "";

            await firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(profile.email, profile.password).then(async (res) => {

                let uid = res.user.uid;
                //res.user.sendEmailVerification();
                if (profile.avatarsource !== "") {
                    let avatarlink = profile.email + '.jpg';

                    const ref = firebase.storage().ref("/member_photos/" + avatarlink);
                    const unsubscribe = ref.putFile(profile.avatarsource.uri.replace("file:/", "")).on(
                        firebase.storage.TaskEvent.STATE_CHANGED,
                        (snapshot) => {

                        },
                        (error) => {
                            unsubscribe();
                        },
                        async (resUrl) => {
                            avatar = resUrl.downloadURL;

                            await axios.post(settings.baseURL + 'member/register', {
                                email: profile.email,
                                uid: uid,
                                firstname: profile.firstname,
                                lastname: profile.lastname,
                                middlename: profile.middlename,
                                mobileno: profile.mobileno,
                                avatar: avatar,
                            }).then(function (res) {
                                if (res.data.status == "202") {
                                    resolve(true)
                                    ToastAndroid.showWithGravityAndOffset("Registration successfully completed. A message has been sent to your email with instructions to complete your registration", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                                } else {
                                    resolve(false)
                                    ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                                }
                            }).catch(function (error) {
                                console.log(error)
                                resolve(false)
                                ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                            });
                        });
                } else {
                    await axios.post(settings.baseURL + 'member/register', {
                        email: profile.email,
                        uid: uid,
                        firstname: profile.firstname,
                        lastname: profile.lastname,
                        middlename: profile.middlename,
                        mobileno: profile.mobileno,
                        avatar: avatar,
                    }).then(function (res) {
                        if (res.data.status == "202") {
                            resolve(true)
                            ToastAndroid.showWithGravityAndOffset("Registration successfully completed. A message has been sent to your email with instructions to complete your registration", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        } else {
                            resolve(false)
                            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        }
                        console.log(res)
                    }).catch(function (error) {
                        console.log(error)
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    });
                }



               


            }).catch(function (e) {
                console.log(e)
                if (e.code === 'auth/email-already-in-use') {
                    ToastAndroid.showWithGravityAndOffset("Email aready used", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                } else {
                    ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
                resolve(false)
            })
        } catch (e) {
            console.log(e)
            ToastAndroid.showWithGravityAndOffset("Something went wrong...", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        };

    })

};
import { DISPLAY_LOCATION, SAVE_LOCATION_OFFLINE, SAVE_LOCATION_ONLINE, DISPLAY_PLACES,GET_PLACE_ALERT } from './types';
import firebase from 'react-native-firebase';
import Moment from 'moment';
import Geocoder from 'react-native-geocoder';
import { ToastAndroid,AsyncStorage } from 'react-native';
import axios from 'axios';
var settings = require('../../components/shared/Settings');
var userdetails = require('../../components/shared/userDetails');



export const displayLocations=(userid)=> dispatch=> {
    let locations=[];
    let count=0;
    let cnt=0;

    return new Promise((resolve) => {
        firebase.database().ref(".info/connected").on("value", function (snap) {
            if (snap.val() === true) {
                firebase.database().ref().child('locations/' + userid).orderByChild("dateadded").limitToFirst(100).once("value", function (snapshot) {
                    if (snapshot.val() === null) {
                        resolve("");
                    } else {
                        snapshot.forEach(childSnapshot => {

                            let dateadded = Moment(new Date(parseInt(childSnapshot.val().dateadded))).format("DD-MMM-YYYY ddd hh:mm A");
                            locations.push({
                                id: childSnapshot.key,
                                address: childSnapshot.val().address,
                                dateadded: dateadded,
                                coordinates: {
                                    longitude: Number(childSnapshot.val().lon),
                                    latitude: Number(childSnapshot.val().lat)
                                }

                            });
                            cnt++;
                            if (cnt >= count) {
                                dispatch({
                                    type: DISPLAY_LOCATION,
                                    payload: locations.reverse(),
                                });
                                resolve("");
                            }

                        })

                    }
                })
            } else {
                dispatch({
                    type: DISPLAY_LOCATION,
                    payload: [],
                });
                resolve("Network connection error");
            }
        })
    })
    
};
const rad=(x)=> {
    return x * Math.PI / 180;
};
const getDistance=(lat1,long1,lat2,long2) => {
    let R = 6378137;
    let dLat = rad(lat2 - lat1);
    let dLong = rad(long2 - long1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;
    return d; 
  };

export const saveLocationOffline = () => async dispatch => {
    let userid = await AsyncStorage.getItem("userid");
    if (userid !== "" & userid !== null) {
        console.log("saving offline");
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    dateadded: Date.now()
                }
                const offlineLocation = await AsyncStorage.getItem('offlineLocation');
                let location = JSON.parse(offlineLocation);
                if (!location) {
                    location = [];
                }
                console.log(location)

                if (location.length >= 1) {
                    var loc = location[location.length - 1];
                    let distance = getDistance(loc.latitude, loc.longitude, coords.latitude, coords.longitude)
                    if (distance > 100) {
                        location.push(coords)
                        await AsyncStorage.setItem("offlineLocation", JSON.stringify(location))
                    }
                } else {
                    location.push(coords)
                    await AsyncStorage.setItem("offlineLocation", JSON.stringify(location))
                }




            },
            (err) => {
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 3000 }
        );
    }
};

export const saveLocationOnline=()=> async dispatch=> {
    let userid = await AsyncStorage.getItem("userid");
    if (userid === "" || userid === null) {
        dispatch({ 
            type: SAVE_LOCATION_ONLINE,
            payload: [],
        });
    } else {
        console.log("saving online");
        let dateadded=Date.now();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetch("https://us-central1-trackingbuddy-3bebd.cloudfunctions.net/api/appendOnlineLocation?lat="+ position.coords.latitude +"&lon="+ position.coords.longitude +"&userid="+userdetails.userid+"&dateadded="+dateadded+"&firstname="+userdetails.firstname)
                .then((response) => response)
                .then((response) => {
                    dispatch({ 
                        type: SAVE_LOCATION_ONLINE,
                        payload: [],
                    });
                })
                .catch((error) => {
                    
                    dispatch({ 
                        type: SAVE_LOCATION_ONLINE,
                        payload: [],
                    });
                });
            
            },
            (err) => {
            },
             { enableHighAccuracy: false, timeout: 10000, maximumAge: 3000 }
        );
    }
};

export const pushLocationOnline = () => async dispatch => {
    let userid = await AsyncStorage.getItem("userid");
    if (userid !== "" & userid !== null) {
        const offlineLocation = await AsyncStorage.getItem('offlineLocation');
        let location = JSON.parse(offlineLocation);
        await AsyncStorage.setItem("offlineLocation", "");
        if (!location) {
            location = [];
        }
        if (location.length > 0) {
            for (let x = 0; x < location.length; x++) {
                var loc = location[x];
                await fetch("https://us-central1-trackingbuddy-3bebd.cloudfunctions.net/api/appendOfflineLocation?lat=" + loc.latitude + "&lon=" + loc.longitude + "&userid=" + userdetails.userid + "&dateadded=" + loc.dateadded + "&firstname=" + userdetails.firstname)
                    .then((response) => response)
                    .then((response) => {
                    })
                    .catch((error) => {
                    });
                
            }

        }
    }

    
};

export const saveLocationOnLogin=()=> async dispatch=> {
    return new Promise((resolve) => {
       
        navigator.geolocation.getCurrentPosition(
            (position) => {

                resolve(position)
            },
            (err) => {
            },
            { enableHighAccuracy: true, timeout: 20000 }
        );

    }).then(function(position){
        let dateadded=Date.now();
        fetch("https://us-central1-trackingbuddy-3bebd.cloudfunctions.net/api/appendOnlineLocation?lat="+ position.coords.latitude +"&lon="+ position.coords.longitude +"&userid="+userdetails.userid+"&dateadded="+dateadded+"&firstname="+userdetails.firstname)
        .then((response) => response)
        .then((response) => {
            dispatch({ 
                type: SAVE_LOCATION_ONLINE,
                payload: [],
            });
        })
        .catch((error) => {
            
            dispatch({ 
                type: SAVE_LOCATION_ONLINE,
                payload: [],
            });
        });
        
    });
};

















//update code


export const deletePlace = (id) => dispatch => {
    return new Promise(async (resolve) => {
        try {

            await axios.post(settings.baseURL + 'place/deleteplace', {
                placeid: id,
                owneruid: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
                    ToastAndroid.showWithGravityAndOffset("Place successfully deleted", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    resolve(true)
                } else {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
            }).catch(function (error) {
                resolve(false)
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })
   
};


export const displayPlaces = () => async dispatch => {

    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'place/getplaces/' + userdetails.userid)
                .then(function (res) {
                    if (res.data.status == "202") {
                        dispatch({
                            type: DISPLAY_PLACES,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: DISPLAY_PLACES,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {
                   
                    dispatch({
                        type: DISPLAY_PLACES,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {
           
            dispatch({
                type: DISPLAY_PLACES,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });




};


export const savePlace = (place, address, coordinate) => dispatch => {

    return new Promise(async (resolve) => {
        try {
            await axios.post(settings.baseURL + 'place/saveplace', {
                place: place,
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                address: address,
                owner: userdetails.userid,
            }).then(function (res) {
                if (res.data.status == "202") {
                    if (res.data.isexist == "true") {
                        ToastAndroid.showWithGravityAndOffset("Place already exist", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        resolve(false)
                    } else {
                        ToastAndroid.showWithGravityAndOffset("Place successfully added", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        resolve(true)
                    }
                } else {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
            }).catch(function (error) {
                resolve(false)
                console.log(error)
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
            console.log(e)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })


};


export const updatePlace = (id, place,address, coordinate) => dispatch => {


    return new Promise(async (resolve) => {
        try {
            await axios.post(settings.baseURL + 'place/updateplace', {
                id: id,
                place: place,
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                address: address,
                owner: userdetails.userid,
            }).then(function (res) {
                console.log(res);
                if (res.data.status == "202") {
                    if (res.data.isexist == "true") {
                        ToastAndroid.showWithGravityAndOffset("Place already exist", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        resolve(false)
                    } else {
                        ToastAndroid.showWithGravityAndOffset("Place successfully updated", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        resolve(true)
                    }
                } else {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
            }).catch(function (error) {
                resolve(false)
                console.log(error)
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
            console.log(e)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })

};


export const savePlaceNotification = (data) => async dispatch => {

    return new Promise(async (resolve) => {
        try {
            await axios.post(settings.baseURL + 'place/savenotification', {
                useruid: data.useruid,
                placeid: data.placeid,
                arrives: data.arrives,
                leaves: data.leaves,
                owner: userdetails.userid,
            }).then(function (res) {
                console.log(res);
                if (res.data.status == "202") {
                        ToastAndroid.showWithGravityAndOffset("Notification successfully saved.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                        resolve(true)
                } else {
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                }
            }).catch(function (error) {
                resolve(false)
                console.log(error)
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
            console.log(e)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            resolve(false)
        }

    })


};





export const getPlaceNotification = (placeid, userid) => async dispatch => {
    let arrives = false;
    let leaves = false;
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'place/getPlaceNotification/' + userdetails.userid + '/' + placeid + '/' + userid)
                .then(function (res) {
                    console.log(res)
                    if (res.data.status == "202") {
                        if (res.data.results.length > 0) {
                            if (res.data.results[0].arrives == '1') {
                                arrives = true;
                            }
                            if (res.data.results[0].leaves == '1') {
                                leaves= true;
                            }
                        }
                        dispatch({
                            type: GET_PLACE_ALERT,
                            payload: {
                                arrives: arrives,
                                leaves: leaves
                                }
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: GET_PLACE_ALERT,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {

                    dispatch({
                        type: GET_PLACE_ALERT,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {

            dispatch({
                type: DISPLAY_PLACES,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });

};

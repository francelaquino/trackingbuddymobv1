import { DISPLAY_LOCATION, DISPLAY_LOCATION_MAP, DISPLAY_LOCATION_LIST, GET_LOCATIONDETAILS, SAVE_LOCATION_OFFLINE, SAVE_LOCATION_ONLINE, DISPLAY_PLACES,GET_PLACE_ALERT } from './types';
import firebase from 'react-native-firebase';
import Moment from 'moment';
import Geocoder from 'react-native-geocoder';
import { ToastAndroid,AsyncStorage } from 'react-native';
import axios from 'axios';
var settings = require('../../components/shared/Settings');
var userdetails = require('../../components/shared/userDetails');



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

const savelocation = async (useruid, latitude, longitude) => {
    try {
        
        await axios.post(settings.baseURL + 'place/savelocation', {
            latitude: latitude,
            longitude: longitude,
            useruid: useruid,
            dateadded: Moment().format('YYYY-MM-DD HH:mm:ss'),
        }).then(async function (res) {
            }).catch(function (error) {
            })
    } catch (e) {
    }
}

export const saveLocationOffline = () => async dispatch => {
    let userid = await AsyncStorage.getItem("userid");
    if (userid !== "" & userid !== null) {
        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        useruid: userid,
                        longitude: position.coords.longitude,
                        dateadded: Moment().format('YYYY-MM-DD HH:mm:ss')
                    }
                    const offlineLocation = await AsyncStorage.getItem('offlineLocation');
                    let location = JSON.parse(offlineLocation);
                    if (!location) {
                        location = [];
                    }
                    console.log("saving offline")
                    if (location.length <= 200) {

                        if (location.length >= 1) {
                            var loc = location[location.length - 1];
                            let distance = getDistance(loc.latitude, loc.longitude, coords.latitude, coords.longitude)
                            if (distance > 150) {
                                location.push(coords)
                                await AsyncStorage.setItem("offlineLocation", JSON.stringify(location))
                            }
                        } else {
                            location.push(coords)
                            await AsyncStorage.setItem("offlineLocation", JSON.stringify(location))
                        }
                        
                    }
                    console.log(location);




                },
                (err) => {
                },
                { enableHighAccuracy: false, timeout: 10000, maximumAge: 3000 }
            );
        }catch (e) {
            console.log(e)
        }
    }
};

export const saveLocation = (coords) => async dispatch => {
    try {
        console.log("watching location")

        await axios.get("https://us-central1-trackingbuddy-5598a.cloudfunctions.net/api/getAddress?lat=" + coords.latitude + "&lon=" + coords.longitude)
            .then(function (res) {
                dispatch({
                    type: SAVE_LOCATION_ONLINE,
                    payload: res.data
                });
            }).catch(function (error) {
            });


        await axios.post(settings.baseURL + 'place/saveloginlocation', {
            latitude: coords.latitude,
            longitude: coords.longitude,
            useruid: userdetails.userid,
            dateadded: Moment().format('YYYY-MM-DD HH:mm:ss'),
        }).then(async function (res) {
            console.log(res)
            }).catch(function (error) {
                console.log(error)
        })


    } catch (e) {
        console.log(e)
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
                
        try {
            console.log("saving foreground location")
            navigator.geolocation.getCurrentPosition(
                async (position) => {

                        await axios.get("https://us-central1-trackingbuddy-5598a.cloudfunctions.net/api/getAddress?lat=" + position.coords.latitude + "&lon="+position.coords.longitude)
                         //axios.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&sensor=false")
                            .then(function (res) {
                              
                                dispatch({
                                    type: SAVE_LOCATION_ONLINE,
                                    payload: res.data
                                });
                            }).catch(function (error) {
                                //console.log(error)
                               /* dispatch({
                                   type: SAVE_LOCATION_ONLINE,
                                   // payload: ""
                                });*/
                            });

                        await savelocation(userid, position.coords.latitude, position.coords.longitude);
                    console.log("location changed")
                   

                },
                (err) => {
                    console.log(err)
                   /* dispatch({
                        type: SAVE_LOCATION_ONLINE,
                        payload: ""
                    });*/
                },
                { enableHighAccuracy: false, timeout: 10000}
            );
        } catch (e) {
            console.log(e)
        }
    }
};


export const getUserLocation = () => async dispatch => {
    let userid = await AsyncStorage.getItem("userid");
        navigator.geolocation.getCurrentPosition(
            async (position) => {
               
                await axios.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&sensor=false")
                    .then(async function (res) {
                        userdetails.address = res.data.results[0].formatted_address;
                    }).catch(function (error) {
                    });

            },
            (err) => {
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 3000 }
        );
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
            console.log("pushing online");
            try {

                await axios.post(settings.baseURL + 'place/saveofflinelocation', {
                    locations: location,
                }).then(function (res) {
                }).catch(function (error) {
                    console.log(error)
                });
            } catch (e) {
                console.log(e)
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
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 3000 }
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


export const savePlace = (place, address, region) => dispatch => {
    return new Promise(async (resolve) => {
        try {
            await axios.post(settings.baseURL + 'place/saveplace', {
                place: place,
                latitude: region.latitude,
                longitude: region.longitude,
                latitudedelta: region.latitudeDelta,
                longitudedelta: region.longitudeDelta,

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
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
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
                latitudedelta: coordinate.latitudeDelta,
                longitudedelta: coordinate.longitudeDelta,
                address: address,
                owner: userdetails.userid,
            }).then(function (res) {
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
                ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            });


        } catch (e) {
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
                if (res.data.status == "202") {
                        ToastAndroid.showWithGravityAndOffset("Notification successfully saved.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
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





export const getPlaceNotification = (placeid, userid) => async dispatch => {
    let arrives = false;
    let leaves = false;
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'place/getPlaceNotification/' + userdetails.userid + '/' + placeid + '/' + userid)
                .then(function (res) {
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
                type: GET_PLACE_ALERT,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });

};



export const displayLocationsList = (useruid,date) => dispatch => {
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'place/getLocationHistoryList/' + useruid +'/'+date)
                .then(function (res) {
                                dispatch({
                                    type: DISPLAY_LOCATION_LIST,
                                    payload: res.data.results
                                });
                                resolve(true)
                    
                        
                }).catch(function (error) {

                    dispatch({
                        type: DISPLAY_LOCATION_LIST,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {

            dispatch({
                type: DISPLAY_LOCATION_LIST,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });



};

export const displayLocationsMap = (useruid, date) => dispatch => {
    let locations = [];
    let count = 0;
    let cnt = 0;
    let x = 1;
    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'place/getLocationHistory/' + useruid + '/' + date)
                .then(function (res) {
                    count = res.data.results.length;
                    if (count > 0) {
                        res.data.results.forEach(data => {

                            locations.push({
                                id: x,
                                address: data.address,
                                datemovement: data.datemovement,
                                coordinates: {
                                    longitude: data.longitude,
                                    latitude: data.latitude
                                },
                            });

                            cnt++;
                            x++;
                            if (cnt >= count) {
                                dispatch({
                                    type: DISPLAY_LOCATION_MAP,
                                    payload: locations
                                });
                                resolve(true)
                            }
                        })
                    } else {
                        dispatch({
                            type: DISPLAY_LOCATION_MAP,
                            payload: []
                        });
                        resolve(true)
                    }

                }).catch(function (error) {

                    dispatch({
                        type: DISPLAY_LOCATION_MAP,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {

            dispatch({
                type: DISPLAY_LOCATION_MAP,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });



};


export const getLocationDetails = (id) => async dispatch => {



    return new Promise(async (resolve) => {
        try {
            await axios.get(settings.baseURL + 'place/getLocationHistoryDetails/' + id)
                .then(function (res) {
                    if (res.data.status == "202") {
                        dispatch({
                            type: GET_LOCATIONDETAILS,
                            payload: res.data.results
                        });
                        resolve(true)
                    } else {
                        dispatch({
                            type: GET_LOCATIONDETAILS,
                            payload: []
                        });
                        resolve(false)
                        ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                    }
                }).catch(function (error) {

                    dispatch({
                        type: GET_LOCATIONDETAILS,
                        payload: []
                    });
                    resolve(false)
                    ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                });

        } catch (e) {

            dispatch({
                type: GET_LOCATIONDETAILS,
                payload: []
            });
            resolve(false)
            ToastAndroid.showWithGravityAndOffset("Something went wrong. Please try again.", ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
    });


};
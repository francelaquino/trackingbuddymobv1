import {  DISPLAY_LOCATION, SAVE_LOCATION_OFFLINE, SAVE_LOCATION_ONLINE, DISPLAY_PLACES, GET_PLACE_ALERT } from '../actions/types';

const initialState = {
    coordinates:[],
    places:[],
    locations:[],
    location:[],
    alerts:[],
    isLoading:true,
    success:true,
}


export default function(state=initialState,action){
    switch(action.type){
        case DISPLAY_LOCATION:
            return {
                ...state,
                locations: action.payload,
                isLoading:false,
            };
        case DISPLAY_PLACES:
            return {
                ...state,
                places: action.payload,
                isLoading:false,
            };
        case GET_PLACE_ALERT:
            return {
                ...state,
                alerts: action.payload,
                isLoading:false,
            };
        case SAVE_LOCATION_OFFLINE:
            return {
                ...state,
                coordinates: state.coordinates.concat(action.payload),
            };
        case SAVE_LOCATION_ONLINE:
            return {
                ...state,
            };
       

        default:
            return state;
    }

}
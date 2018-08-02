import { FETCH_COUNTRY, FETCHING_DATA, NO_CONNECTION } from './types';
import { BASE_URL } from '../constants';
import axios from 'axios';

export const fetchCountry=()=> dispatch=> {
        dispatch(fetchData());
        axios.get(BASE_URL+'country')
        .then(function (res) {
            dispatch({ 
                type: FETCH_COUNTRY,
                payload: res.data.result
            });
        })
        .catch(function (error) {
            dispatch({ 
                type: NO_CONNECTION,
                payload:[]
            });
        });
};

function fetchData(){
    return {
        type: FETCHING_DATA,
        payload: [],
    }
}
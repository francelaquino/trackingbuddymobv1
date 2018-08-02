import { FETCH_POSTS, NEW_POST } from './types';
import axios from 'axios';

export const fetchPosts=()=> dispatch=> {
        axios.get('http://192.168.100.51:3000/country/countrycode')
        .then(function (res) {
            dispatch({
                type: FETCH_POSTS,
                payload: res.data.result
            });
        });
};
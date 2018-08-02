import { CONNECTION_STATE, GET_CONNECTION } from './types';
import { BASE_URL } from '../constants';
import axios from 'axios';

export const setConnection=(connection)=> dispatch=> {
    dispatch({ 
        type: CONNECTION_STATE,
        payload: connection
    });
};

export const getConnection=(connection)=> dispatch=> {
    dispatch({ 
        type: GET_CONNECTION,
    });
};


import request from '../utils/request';
// import axios from 'axios';
export const loginApi = query => {
    return request.post(
        '/api/login', query
    );
};
export const getBussinessListApi = query => {
    return request.get(
        '/api/getBussinessList', {
            params:query
        }
    );
};
export const createBussinessApi = query => {
    return request.post(
        '/api/createBussiness', query
    );
};
export const editBussinessApi = query => {
    return request.post(
        '/api/editBussiness', query
    );
};
export const deleteBussinessApi = query => {
    return request.post(
        '/api/deleteBussiness', query
    );
};
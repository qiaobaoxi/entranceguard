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


// import request from '../utils/request';
import axios from 'axios';
export const loginApi = query => {
    return axios.post(
        '/api/login', query
    );
};
// export const getBussinessListApi = query => {
//     return request.get(
//         '/api/getBussinessList', {
//             params:query
//         }
//     );
// };

export const getBussinessListApi = params => {
    return axios.get(`/api/getBussinessList`, params).then(res => res.data);
};
import request from '../utils/request';
// import axios from 'axios';
// 登录
export const loginApi = query => {
    return request.post(
        '/api/login', query
    );
};
//公司列表
export const getBussinessListApi = query => {
    return request.get(
        '/api/getBussinessList', {
            params:query
        }
    );
};
//创建公司
export const createBussinessApi = query => {
    return request.post(
        '/api/createBussiness', query
    );
};
//编辑公司
export const editBussinessApi = query => {
    return request.post(
        '/api/editBussiness', query
    );
};
//删除公司
export const deleteBussinessApi = query => {
    return request.post(
        '/api/deleteBussiness', query
    );
};

//员工列表
export const getUserListApi = query => {
    return request.get(
        '/api/getUserList', {
            params:query
        }
    );
};
//所有员工列表
export const getUserListAllApi = query => {
    return request.get(
        '/api/getUserListAll', {
            params:query
        }
    );
};
//创建员工
export const createUserApi = query => {
    return request.post(
        '/api/createUser', query
    );
};
//编辑员工
export const editUserApi = query => {
    return request.post(
        '/api/editUser', query
    );
};
//删除员工
export const deleteUserApi = query => {
    return request.post(
        '/api/deleteUser', query
    );
};
//关联员工
export const saveBussinessAnduserApi = query => {
    return request.post(
        '/api/saveBussinessAnduser', query
    );
};

//卡列表
export const getCardListApi = query => {
    return request.get(
        '/api/getCardList', {
            params:query
        }
    );
};
//所有卡列表
export const getCardListAllApi = query => {
    return request.get(
        '/api/getCardListAll', {
            params:query
        }
    );
};
//创建员工
export const createCardApi = query => {
    return request.post(
        '/api/createCard', query
    );
};
//编辑员工
export const editCardApi = query => {
    return request.post(
        '/api/editCard', query
    );
};
//删除员工
export const deleteCardApi = query => {
    return request.post(
        '/api/deleteCard', query
    );
};

//关联卡
export const saveUserAndcardApi = query => {
    return request.post(
        '/api/saveUserAndCard', query
    );
};
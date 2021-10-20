import api from "./api";
import TokenService from "./token.service";

const submitUserInfo = async (purpose, gender, age) => {
    try {
        const response = await api
            .post("submitUserInfo", {
                purpose: purpose,
                gender: gender,
                age: age
            });
        if (response.data.accessToken) {
            TokenService.setUser(response.data);
        }
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
};

const restart = async () => {
    try {
        const res = await api
            .post("restartSession", {});
        console.log(res);
    } 
    catch (err) {
        console.log(err);
    }
};

const exit = async () => {
    try {
        await api
            .post("exit", {});
        TokenService.removeUser();
    } 
    catch (err) {
        console.log(err);
    }
};

const getUserState = async () => {
    try {
        const response = await api
            .get("getUserState", {});

        return response.data;
    } 
    catch (err) {
        console.log(err);
    }
};

const getHotelInfo = async () => {
    try {
        const response = await api
            .get("getHotelInfo", {});

        return response.data;
    } 
    catch (err) {
        console.log(err);
    }
};

const getSiteInfo = async () => {
    try {
        const response = await api
            .get("getSiteInfo", {});

        return response.data;
    } 
    catch (err) {
        console.log(err);
    }
};

const getRestInfo = async () => {
    try {
        const response = await api
            .get("getRestInfo", {});

        return response.data;
    } 
    catch (err) {
        console.log(err);
    }
};

const AuthService = {
    submitUserInfo,
    restart,
    exit,
    getUserState,
    getHotelInfo,
    getSiteInfo,
    getRestInfo
};
  
export default AuthService;
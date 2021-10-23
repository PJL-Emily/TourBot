import api from "./api";
import TokenService from "./token.service";

const submitUserInfo = async (purpose, gender, age) => {
    // TODO: remove try catch
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
};

const restart = async () => {
    const res = await api
        .post("restartSession", {});
    console.log(res);
};

const exit = async () => {
    await api.post("exit", {});
    TokenService.removeUser();
};

const getUserState = async () => {
    const response = await api
        .get("getUserState", {});
    
    return response.data;
};

const getHotelInfo = async () => {
    const response = await api
        .get("getHotelInfo", {});

    return response.data;
};

const getSiteInfo = async () => {
    const response = await api
        .get("getSiteInfo", {});

    return response.data;
};

const getRestInfo = async () => {
    const response = await api
        .get("getRestInfo", {});

    return response.data;
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
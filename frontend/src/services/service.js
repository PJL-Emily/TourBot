import api from "./api";
import TokenService from "./token.service";

const submitUserInfo = async (purpose, gender, age) => {
    const response = await api
        .post("submitUserInfo", {
            purpose: purpose,
            gender: gender,
            age: age
        });
    if (response.data.user_id) {
        TokenService.setUser(response.data); ///
    }
    return response.data;
};

const restart = async () => {
    // var data = { user_id: TokenService.getUser().user_id };
    var data = { user_id: "test_id" };

    const res = await api
        .post("restartSession", data);
    console.log(res);

    return response.data;
};

const exit = async () => {
    // var data = { user_id: TokenService.getUser().user_id };
    var data = { user_id: "test_id" };

    await api.post("exit", data);
    TokenService.removeUser();

    return response.data;
};

const getUserState = async () => {
    // var data = { user_id: TokenService.getUser().user_id };
    var data = { user_id: "test_id" };

    const response = await api
        .get("getUserState", data);
    
    return response.data;
};

const getHotelInfo = async () => {
    // var data = { user_id: TokenService.getUser().user_id };
    var data = { user_id: "test_id" };

    const response = await api
        .get("getHotelInfo", data);

    return response.data;
};

const getSiteInfo = async () => {
    // var data = { user_id: TokenService.getUser().user_id };
    var data = { user_id: "test_id" };

    const response = await api
        .get("getSiteInfo", data);

    return response.data;
};

const getRestInfo = async () => {
    // var data = { user_id: TokenService.getUser().user_id };
    var data = { user_id: "test_id" };

    const response = await api
        .get("getRestInfo", data);

    return response.data;
};

const Service = {
    submitUserInfo,
    restart,
    exit,
    getUserState,
    getHotelInfo,
    getSiteInfo,
    getRestInfo
};
  
export default Service;
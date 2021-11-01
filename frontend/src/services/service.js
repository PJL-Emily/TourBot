import api from "./api";
import TokenService from "./token.service";

const submitUserInfo = async (purpose, gender, age) => {
    var data = {
        purpose: purpose,
        gender: gender,
        age: age
    };
    console.log("data to send: ", data);
    const response = await api
        .post("submitUserInfo", data);
    if (response.data.data.user_id) {
        TokenService.setUser(response.data.data);
    }
    return response.data;
};

const sendUserUtter = async (utterance) => {
    var data = { user_id: TokenService.getUser().user_id };
    // var data = { user_id: "test_id" };

    const response = await api
        .post("sendUserUtter", {
            ...data, msg: utterance
        });

    return response.data;
};

const restart = async () => {
    var data = { user_id: TokenService.getUser().user_id };
    // var data = { user_id: "test_id" };
    console.log("restart: data ", data);
    const response = await api
        .post("restartSession", data);
    console.log(response);

    return response.data;
};

const getUserState = async () => {
    var data = { user_id: TokenService.getUser().user_id };
    console.log("data: ", data);
    // var data = { user_id: "test_id" };

    const response = await api
        .get("getUserState", data);
    
    return response.data;
};

const getHotelInfo = async () => {
    var data = { user_id: TokenService.getUser().user_id };
    // var data = { user_id: "test_id" };

    const response = await api
        .get("getHotelInfo", data);

    return response.data;
};

const getSiteInfo = async () => {
    var data = { user_id: TokenService.getUser().user_id };
    // var data = { user_id: "test_id" };

    const response = await api
        .get("getSiteInfo", data);

    return response.data;
};

const getRestInfo = async () => {
    var data = { user_id: TokenService.getUser().user_id };
    // var data = { user_id: "test_id" };

    const response = await api
        .get("getRestInfo", data);

    return response.data;
};


const Service = {
    submitUserInfo,
    sendUserUtter,
    restart,
    getUserState,
    getHotelInfo,
    getSiteInfo,
    getRestInfo
};
  
export default Service;
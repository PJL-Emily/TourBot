import api from "./api";
import TokenService from "./token.service";

const submitUserInfo = async (purpose, gender, age) => {
    const response = await api
        .post("auth/submitUserInfo", {
            purpose: purpose,
            gender: gender,
            age: age
        });
    if (response.data.accessToken) {
        TokenService.setUser(response.data);
    }
    return response.data;
};

const restart = async (user_id) => {
    try {
        const res = await api
            .post("auth/getChatStatus", {
                user_id: user_id,
                stat: 'restart'
            });
        console.log(res);
    } 
    catch (err) {
        console.log(err);
    }
};

const exit = async (user_id) => {
    try {
        await api
            .post("auth/getChatStatus", {
                user_id: user_id,
                stat: 'exit'
            });
        TokenService.removeUser();
    } 
    catch (err) {
        console.log(err);
    }
};

const AuthService = {
    submitUserInfo,
    restart,
    exit
};
  
export default AuthService;
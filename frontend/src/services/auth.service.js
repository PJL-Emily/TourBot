import api from "./api";
import TokenService from "./token.service";

const submitUserInfo = async (purpose, gender, age) => {
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
    try {
        const res = await api
            .post("restartSession", {
                // user_id: user_id,
                // stat: 'restart'
            });
        console.log(res);
    } 
    catch (err) {
        console.log(err);
    }
};

const exit = async () => {
    try {
        await api
            .post("exit", {
                // user_id: user_id,
                // stat: 'exit'
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
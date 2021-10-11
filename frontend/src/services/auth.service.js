import api from "./api";
import TokenService from "./token.service";

const submitUserInfo = (purpose, gender, age) => {
    return api
    .post("auth/submitUserInfo", {
      purpose: purpose,
      gender: gender,
      age: age
    })
    .then((response) => {
        if (response.data.accessToken) {
            TokenService.setUser(response.data);
        }

        return response.data;
    });
};

const restart = () => {
    return api
    .post("auth/getChatStatus", {
        stat: 'restart'
    })
    .then(res => {
        console.log(res);
        // TODO: clear chatroom and state
    })
    .catch(err => {
        console.log(err);
    });
};

const exit = () => {
    return api
    .post("auth/getChatStatus", {
      stat: 'exit'
    })
    .then(() => {
        TokenService.removeUser();
        // TODO: redirect to homepage
    })
    .catch(err => {
        console.log(err);
    });
};

const AuthService = {
    submitUserInfo,
    restart,
    exit
};
  
export default AuthService;
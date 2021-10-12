import axios from "axios";
import TokenService from "./token.service";

const instance = axios.create({
    baseURL: "http://localhost:8888/api",
    headers: {
      "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = TokenService.getLocalAccessToken();
        if (token) {
            config.headers["x-access-token"] = token; // Node.js
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
  
      if (originalConfig.url !== "/auth/submitUserInfo" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
  
            try {
                // post header includes original accessToken （不管是否 expire）
                // 所以應該不需要在 data 包含 user_id
                let refreshToken = TokenService.getLocalRefreshToken();
                if (refreshToken) {
                    const rs = await instance.post("/auth/getChatStatus", {
                        user_id: '',
                        stat: 'refresh'
                    });
                    const { accessToken } = rs.data;
                    TokenService.updateLocalAccessToken(accessToken);
                }
    
                return instance(originalConfig);
            } 
            catch (_error) {
                return Promise.reject(_error);
            }
        }
      }
  
      return Promise.reject(err);
    }
);

export default instance;
import axios, { AxiosRequestConfig } from "axios";

// type RequestReturnType = {
//     _embedded: {
//         events: DataItem[];
//     };
//     _links?: {
//         self: {
//             href: string;
//         };
//         next: {
//             href: string;
//         };
//     };
//     page?: {
//         size: number;
//         totalElements: number;
//         totalPages: number;
//         number: number;
//     };
//     errors?: [];
// };

const request = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

request.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem("token");
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        const apiKey = process.env.EXPO_PUBLIC_API_KEY1;
        if (apiKey) {
            config.params = {
                ...config.params,
                apikey: apiKey,
            };
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.log("未授权，请重新登录");
                    break;
                case 403:
                    console.log("拒绝访问");
                    break;
                case 404:
                    console.log("请求地址出错");
                    break;
                case 500:
                    console.log("服务器内部错误");
                    break;
                default:
                    console.log(`请求失败: ${error.response.data.message}`);
            }
        } else if (error.request) {
            console.log("网络错误，请检查网络连接");
        } else {
            console.log("请求配置出错");
        }
        return Promise.reject(error);
    },
);

async function httpProxy<T = any>(config: AxiosRequestConfig): Promise<T> {
    return request(config);
}
export default httpProxy;

// export default request;

import axios, { AxiosInstance } from "axios";
const DEBUG_LEVEL = process.env.NEXT_PUBLIC_HTTP_LOG_LEVEL;

export const httpInterceptorLog = (...data: unknown[]) => {
  console.log(`❗http[${DEBUG_LEVEL}] -`, ...data);
};

export const setupGlobalHttpInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      // do something before request is sent
      if (DEBUG_LEVEL === "debug") {
        httpInterceptorLog("[global]", "req:");
      }
      return config;
    },
    (error) => {
      // do something with request error
      httpInterceptorLog("[global]", "req error:", error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      // do something with response data
      if (DEBUG_LEVEL === "debug") {
        httpInterceptorLog("[global]", "res:");
      }
      return response;
    },
    (error) => {
      // do something with response error
      httpInterceptorLog("[global]", "res error:", {
        url: error.config?.url,
        code: error.code,
        message: error.message,
        resStatus: error.response?.status,
        resStatusText: error.response?.statusText,
        resData: error.response?.data,
      });
      return Promise.reject(error);
    }
  );
};

const http = axios.create();
setupGlobalHttpInterceptors(http);
export default http;

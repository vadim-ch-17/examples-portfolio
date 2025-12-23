"use server";

import axios from "axios";
import http, { setupGlobalHttpInterceptors } from "../global.http";

const serverHttp = axios.create({
  ...http.defaults,
});

serverHttp.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    throw new Error("This http client is only for server-side");
  }
  config.headers["Accept-Language"] = "es-US";

  return config;
});

serverHttp.interceptors.response.use((config) => {
  if (typeof window !== "undefined") {
    throw new Error("This http client is only for server-side");
  }
  config.headers["Accept-Language"] = "es-US";
  return config;
});

setupGlobalHttpInterceptors(serverHttp);
export default serverHttp;

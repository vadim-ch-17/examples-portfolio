"use client";

import axios from "axios";
import http, { setupGlobalHttpInterceptors } from "../global.http";
import store from "@/store";
import { setGlobalLoading } from "@/store/slices/appearanceSlice";

const clientHttp = axios.create({
  ...http.defaults,
});

// NOTE: store is possibly undefined, because we make it on the fly
clientHttp.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    throw new Error("This http client is only for client-side");
  }
  store?.dispatch(setGlobalLoading(true));
  config.headers["Accept-Language"] = "es-US";

  return config;
});

clientHttp.interceptors.response.use((config) => {
  if (typeof window === "undefined") {
    throw new Error("This http client is only for client-side");
  }
  store?.dispatch(setGlobalLoading(false));
  config.headers["Accept-Language"] = "es-US";
  return config;
});

setupGlobalHttpInterceptors(clientHttp);
export default clientHttp;

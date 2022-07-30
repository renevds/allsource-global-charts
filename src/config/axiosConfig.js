import axios from 'axios';
import lzwCompress from "lzwcompress";

//Utils
import {decompressArray} from "../utils/axiosTools";

const isProduction = process.env.NODE_ENV !== "development";

//Set server URLS
const socialServerHost = isProduction ? "https://social.allsource.io" : "http://localhost:3063";
const analyticsServerHost = isProduction ? "https://analytics.allsource.io" : "http://localhost:3080";
const profileServerHost = isProduction ? "https://profile.allsource.io" : "https://profile.juicescan.com";
const juiceServerHost = isProduction ? "https://juice.allsource.io" : "https://juice.juicescan.com";
//const authServerHost = isProduction ? "https://auth.allsource.io" : "https://auth.juicescan.com";
const projectServerHost = "https://projects.allsource.io";
//const chartDataHost = "https://analytics.teamedin.io/";/ /TODO on production change back to this
const chartDataHost = "https://delta.extensionsworld.com/";

// export const authFetch = axios.create({
//     baseURL: `${serverAuthURL}`,
// })

export const juiceFetch = axios.create({
  baseURL: `${juiceServerHost}`,
});
export const profileFetch = axios.create({
  baseURL: `${profileServerHost}`,
});
export const projectFetch = axios.create({
  baseURL: `${projectServerHost}`,
});
export const socialFetch = axios.create({
  baseURL: `${socialServerHost}`,

});

export const analyticsFetch = axios.create({
  baseURL: `${analyticsServerHost}`,
  credentials: "include",
  withCredentials: true
});

export const chartDataFetch = axios.create({
  baseURL: `${chartDataHost}`
})

chartDataFetch.interceptors.response.use(function (response) {
  const decoded = lzwCompress.unpack(response.data.data);
  try {
    response.data.data = JSON.parse(decoded);
  } catch (e) {
    console.log("Could not decode.")
    console.log(response.request.responseURL)
    response.data = {data: []};
    return response;
  }
  if(Array.isArray(response.data.data)){
    response.data.data = decompressArray(response.data.data, response.data.keys);
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

export const chartDataFetchNoLZW = axios.create({
  baseURL: `${chartDataHost}`
})

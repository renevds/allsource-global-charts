import axios from 'axios';
import lzwCompress from "lzwcompress";

//Utils
import {decompressArray} from "../utils/axiosTools";
import {cachedAxiosInstance} from "../utils/axiosCache";

const isProduction = process.env.NODE_ENV !== "development";

//Set server URLS
//const chartDataHost = "https://analytics.teamedin.io/";/ /TODO on production change back to this
const chartDataHost = "https://delta.extensionsworld.com/";

export const chartDataFetch = new cachedAxiosInstance(axios.create({
  baseURL: `${chartDataHost}`
}))

chartDataFetch.axiosInstance.interceptors.response.use(function (response) {
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

export const chartDataFetchNoLZW = new cachedAxiosInstance(axios.create({
  baseURL: `${chartDataHost}`
}))

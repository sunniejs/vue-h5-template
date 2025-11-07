import axios from 'axios';
import { showToast } from 'vant';

const service = axios.create({
  withCredentials: false,
  timeout: 10000,
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      showToast(res.msg);
      return Promise.reject(res.msg || 'Error');
    } else {
      return res.data;
    }
  },
  (error) => {
    console.log('err' + error);
    showToast(error.message);
    return Promise.reject(error.message);
  },
);

export const http = {
  get(url, config) {
    return service.get(url, config);
  },

  post(url, data, config) {
    return service.post(url, data, config);
  },

  put(url, data, config) {
    return service.put(url, data, config);
  },

  delete(url, config) {
    return service.delete(url, config);
  },
};

export default service;

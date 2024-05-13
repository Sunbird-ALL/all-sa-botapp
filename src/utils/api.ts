// utils/api.ts
import axios from 'axios';

const pendingRequests = new Array(); //new Map();

function getRequestKey(config: any) {
  const { method, url } = config;
  return `${method}_${url}`;
}

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://dev.aiassistant.sunbird.org/all_bot/v1/', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const key = getRequestKey(config);
    const currentTime = Date.now();
    const requestIndex = pendingRequests.findIndex((req) => req.key === key);
    if (requestIndex !== -1) {
      const request = pendingRequests[requestIndex];
      if (currentTime - request.timestamp < 3000) {
        // 2000 milliseconds = 2 seconds
        // Cancel the current request if it's within 2 seconds
        config.cancelToken = new axios.CancelToken((cancel) =>
          cancel('Duplicate request within 2 seconds: ' + key)
        );
      } else {
        // Update the timestamp and keep the request
        pendingRequests[requestIndex] = {
          key,
          timestamp: currentTime,
          cancel: request.cancel,
        };
      }
    } else {
      // Add new request to pending array with current timestamp
      config.cancelToken = new axios.CancelToken((cancel) => {
        pendingRequests.push({ key, timestamp: currentTime, cancel });
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    const key = getRequestKey(response.config);
    const index = pendingRequests.findIndex((req) => req.key === key);
    if (index !== -1) {
      pendingRequests.splice(index, 1);
    }
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.resolve();
    } else {
      const key = getRequestKey(error.config);
      const index = pendingRequests.findIndex((req) => req.key === key);
      if (index !== -1) {
        pendingRequests.splice(index, 1);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

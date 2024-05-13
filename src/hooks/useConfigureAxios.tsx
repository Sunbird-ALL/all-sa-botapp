// lib/axios.ts
import axios from 'axios';
import { isLoadingAtom } from '../store/loadingAtom';
import { useAtom, useSetAtom } from 'jotai';
import api from '@/utils/api';

const pendingRequests = new Array(); //new Map();

function getRequestKey(config: any) {
  const { method, url } = config;
  return `${method}_${url}`;
}

const useConfigureAxios = () => {
  //const setIsLoading = useAtom(isLoadingAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

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
        setIsLoading(true);
      }
      return config;
    },
    (error) => {
      setIsLoading(false);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      const key = getRequestKey(response.config);
      const index = pendingRequests.findIndex((req) => req.key === key);
      if (index !== -1) {
        pendingRequests.splice(index, 1);
      }
      setIsLoading(false);
      return response;
    },
    (error) => {
      if (axios.isCancel(error)) {
        setIsLoading(false);
        return Promise.resolve();
      } else {
        const key = getRequestKey(error.config);
        const index = pendingRequests.findIndex((req) => req.key === key);
        if (index !== -1) {
          pendingRequests.splice(index, 1);
        }
      }
      setIsLoading(false);
      return Promise.reject(error);
    }
  );
};

export default useConfigureAxios;

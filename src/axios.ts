import axios from 'axios'
import axiosRetry from 'axios-retry'
import { BASE_URL } from './consts'

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 seconds timeout
})

axiosRetry(api, {
  retries: 3, // Number of retry attempts
  retryDelay: axiosRetry.exponentialDelay, // Use exponential backoff
  retryCondition: (error) => {
    // Retry on network errors and 5xx server errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           (error.response?.status ? error.response.status >= 500 : false)
  },
})

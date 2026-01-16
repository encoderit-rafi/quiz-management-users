import axios from 'axios'
import { BASE_URL } from './consts'
// import { toast } from "sonner";
// import { useToken, useCurrentUser } from "./store";

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token automatically
api.interceptors.request.use((config) => {
  // const { token } = useToken.getState()

  config.headers.Authorization = `Bearer ${'19|Xmy5pqBjCiX9AFZV6uegnm5C0920FondAkMLldLMf2a5b6fd'}`
  return config
})

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       useToken.getState().setToken(null)
//       useCurrentUser.getState().clearUser()
//       if (typeof window !== 'undefined') {
//         window.location.href = '/login'
//       }
//       toast.error('Session expired. Please login again.')
//     }
//     return Promise.reject(error)
//   },
// )

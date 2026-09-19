import axios from "axios";

import {
  useAuthStore,
} from "@/store/authStore";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:8000/api",

  headers: {
    "Content-Type":
      "application/json",
  },
});

// Public endpoints
const publicEndpoints = [
  "/auth/jwt/create/",
  "/auth/register/",
];

// -----------------------------------
// Attach JWT Token
// -----------------------------------

api.interceptors.request.use(
  (config) => {

    const token =
      useAuthStore
        .getState()
        .token;

    const isPublicEndpoint =
      publicEndpoints.some(
        (endpoint) =>
          config.url?.includes(
            endpoint
          )
      );

    console.log(
      "TOKEN:",
      token
    );

    if (
      token &&
      !isPublicEndpoint
    ) {

      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(
      error
    );
  }
);

// -----------------------------------
// Response Interceptor
// -----------------------------------

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (
      error.response?.status ===
      401
    ) {

      console.log(
        "Unauthorized request"
      );
    }

    return Promise.reject(
      error
    );
  }
);

export default api;

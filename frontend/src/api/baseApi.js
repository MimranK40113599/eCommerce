/* import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../constants/constants";

// Helper to get token from localStorage
const getToken = () => localStorage.getItem("hzaluna_token");

// Base query configuration
export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
  credentials: "include",
});

// Base API with common configuration
export const baseApi = createApi({
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ["User", "Product", "Order", "Review"],
});

// Export a function to create API services
export const createApiService = (reducerPath, endpoints, tagTypes = []) => {
  return createApi({
    reducerPath,
    baseQuery,
    endpoints,
    tagTypes: [...baseApi.tagTypes, ...tagTypes],
  });
};

export default baseApi;
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../constants/constants";

const getToken = () => localStorage.getItem("hzaluna_token");

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
  credentials: "include",
});

export const baseApi = createApi({
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ["User", "Product", "Order", "Review"],
});

export default baseApi;

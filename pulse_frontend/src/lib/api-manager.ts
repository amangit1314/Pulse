import axios from "axios";
import { API_ENDPOINTS, getApiBaseUrl } from "./api-endpoints";

const baseUrl = getApiBaseUrl();

// Create axios instance with default config
const apiManager = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiManager.interceptors.request.use(
  (config) => {
    apiLogger.logRequest(config);

    // Get token from localStorage
    // const token = localStorage.getItem("snapcart_access_token");
    // console.log(`Access token in interceptor: ${token}`);

    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    //   config.headers.access_token = "snapcart_access_token";
    // }
    return config;
  },
  (error) => {
    apiLogger.logError(error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiManager.interceptors.response.use(
  (response) => {
    apiLogger.logResponse(response);
    return response;
  },
  async (error) => {
    apiLogger.logError(error);

    // const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;

    //   try {
    //     // Try to refresh the token
    //     const refreshToken = localStorage.getItem("snapcart_refresh_token");
    //     if (!refreshToken) {
    //       throw new Error("No refresh token available");
    //     }

    //     const response = await axios.post(API_ENDPOINTS.REFRESH_TOKEN, {
    //       refreshToken,
    //     });

    //     const { access_token, refresh_token } = response.data;

    //     // Update tokens in localStorage
    //     localStorage.setItem("snapcart_access_token", access_token);
    //     localStorage.setItem("snapcart_refresh_token", refresh_token);

    //     // Update the original request with the new token
    //     originalRequest.headers.Authorization = `Bearer ${access_token}`;
    //     return apiManager(originalRequest);
    //   } catch (refreshError) {
    //     // If refresh token fails, clear tokens and redirect to login
    //     localStorage.removeItem("snapcart_access_token");
    //     localStorage.removeItem("snapcart_refresh_token");
    //     window.location.href = "/login";
    //     return Promise.reject(refreshError);
    //   }
    // }

    return Promise.reject(error);
  }
);

// Custom logger function with formatted JSON
const apiLogger = {
  logRequest: (config: any) => {
    if (process.env.NODE_ENV === "development") {
      console.groupCollapsed(
        `🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
      console.log("📤 Headers:", JSON.stringify(config.headers, null, 2));
      if (config.data) {
        console.log("📦 Request Data:", JSON.stringify(config.data, null, 2));
      }
      console.log(
        "⚙️ Config:",
        JSON.stringify(
          {
            baseURL: config.baseURL,
            timeout: config.timeout,
            withCredentials: config.withCredentials,
          },
          null,
          2
        )
      );
      console.groupEnd();
    }
  },

  logResponse: (response: any) => {
    if (process.env.NODE_ENV === "development") {
      console.groupCollapsed(
        `✅ API Response: ${response.status} ${
          response.statusText
        } - ${response.config.method?.toUpperCase()} ${response.config.url}`
      );
      console.log(
        "📥 Response Headers:",
        JSON.stringify(response.headers, null, 2)
      );
      console.log("📦 Response Data:", JSON.stringify(response.data, null, 2));
      console.log(
        "⚙️ Response Config:",
        JSON.stringify(
          {
            baseURL: response.config.baseURL,
            timeout: response.config.timeout,
          },
          null,
          2
        )
      );
      console.groupEnd();
    }
  },

  logError: (error: any) => {
    if (process.env.NODE_ENV === "development") {
      console.groupCollapsed(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }`
      );

      if (error.response) {
        // Server responded with error status
        console.log(
          "🚨 Error Response:",
          JSON.stringify(
            {
              status: error.response.status,
              statusText: error.response.statusText,
              headers: error.response.headers,
              data: error.response.data,
            },
            null,
            2
          )
        );
      } else if (error.request) {
        // Request was made but no response received
        console.log(
          "📡 No Response Received:",
          JSON.stringify(
            {
              request: error.request,
            },
            null,
            2
          )
        );
      } else {
        // Something else happened
        console.log("⚡ Error Message:", error.message);
      }

      console.log(
        "⚙️ Request Config:",
        JSON.stringify(
          {
            method: error.config?.method,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            headers: error.config?.headers,
            data: error.config?.data,
          },
          null,
          2
        )
      );

      console.groupEnd();
    }
  },
};

export default apiManager;

import axios from "axios";
import Fingerprint2 from "@fingerprintjs/fingerprintjs";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ============================================================================
// FINGERPRINT GENERATION
// ============================================================================

let cachedFingerprint = null;

const getFingerprint = async () => {
  if (cachedFingerprint) return cachedFingerprint;

  try {
    const fp = await Fingerprint2.load();
    const result = await fp.get();
    cachedFingerprint = result.visitorId;
    return cachedFingerprint;
  } catch (error) {
    console.error("Error generating fingerprint:", error);
    return null;
  }
};

// ============================================================================
// AXIOS INSTANCES
// ============================================================================

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const privateApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const multipartApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

// ============================================================================
// REQUEST INTERCEPTORS
// ============================================================================

const addFingerprintInterceptor = async (config) => {
  const fingerprint = await getFingerprint();
  if (fingerprint) {
    config.headers["x-fingerprint"] = fingerprint;
  }
  return config;
};

publicApi.interceptors.request.use(addFingerprintInterceptor);
privateApi.interceptors.request.use(addFingerprintInterceptor);
multipartApi.interceptors.request.use(addFingerprintInterceptor);

const addPageContextInterceptor = (config) => {
  if (window.$router?.currentRoute?.value) {
    const currentRoute = window.$router.currentRoute.value;
    const pageContext = {
      name: currentRoute.name || "unknown",
      path: currentRoute.path,
      description: currentRoute.meta?.description || "",
      level: currentRoute.meta?.level || 0,
      requiresAuthorization: currentRoute.meta?.requiresAuth || false,
      hasSensitiveInformation: currentRoute.meta?.sensitive || false,
    };
    config.headers["x-path"] = JSON.stringify(pageContext);
  }
  return config;
};

privateApi.interceptors.request.use(addPageContextInterceptor);
multipartApi.interceptors.request.use(addPageContextInterceptor);

// ============================================================================
// RESPONSE INTERCEPTORS
// ============================================================================

const handleTokenRefresh = async (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 498 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      await privateApi.patch("/api/v1/auth/refresh-token");
      return privateApi(originalRequest);
    } catch (refreshError) {
      if (window.$router) {
        window.$router.push({ name: "login" });
      }
      return Promise.reject(refreshError);
    }
  }

  if (error.response?.status === 401) {
    if (
      window.$router &&
      window.$router.currentRoute?.value?.name !== "login"
    ) {
      window.$router.push({ name: "login" });
    }
  }

  return Promise.reject(error);
};

privateApi.interceptors.response.use(
  (response) => response,
  handleTokenRefresh,
);

multipartApi.interceptors.response.use(
  (response) => response,
  handleTokenRefresh,
);

const handleGlobalErrors = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 429:
        console.warn("Too many requests:", data?.message);
        break;
      case 500:
        console.error("Server error:", data?.message);
        break;
      case 503:
        console.error("Service unavailable:", data?.message);
        break;
    }
  } else if (error.request) {
    console.error("Network error: No response from server");
  } else {
    console.error("Request error:", error.message);
  }

  return Promise.reject(error);
};

publicApi.interceptors.response.use((response) => response, handleGlobalErrors);
privateApi.interceptors.response.use(undefined, handleGlobalErrors);
multipartApi.interceptors.response.use(undefined, handleGlobalErrors);

// ============================================================================
// BOOT FUNCTION
// ============================================================================

export default function boot({ app }) {
  app.config.globalProperties.$axios = {
    public: publicApi,
    private: privateApi,
    multipart: multipartApi,
  };

  app.config.globalProperties.$api = {
    public: publicApi,
    private: privateApi,
    multipart: multipartApi,
  };
}

export { publicApi, privateApi, multipartApi };

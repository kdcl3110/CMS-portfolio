import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { baseURL } from "../utils/baseUrl";

/**
 * Axios defaults
 */
const { VITE_BACKEND_URL } = import.meta.env;
axios.defaults.baseURL = baseURL;

// Headers
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common.Accept = "application/json";

// Types
interface RefreshTokenResponse {
  access: string;
}

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Variable pour éviter les appels multiples simultanés de refresh
let isRefreshing: boolean = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach((prom: QueueItem) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  
  failedQueue = [];
};

/**
 * Request Interceptor
 */
axios.interceptors.request.use(
  async (inputConfig: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const config = inputConfig;

    // Check for and add the stored Auth Token to the header request
    let token: string = "";
    try {
      token = localStorage.getItem("@Auth:token") || "";
    } catch (error) {
      /* Nothing */
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor pour gérer le renouvellement automatique du token
 */
axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Vérifier si l'erreur est due à un token expiré
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, mettre la requête en attente
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axios(originalRequest);
        }).catch((err: any) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken: string | null = localStorage.getItem("@Auth:refresh");

      if (!refreshToken) {
        // Pas de refresh token, rediriger vers la page de login
        localStorage.removeItem("@Auth:token");
        localStorage.removeItem("@Auth:refresh");
        localStorage.removeItem("user");
        window.location.href = "/signin"; // Ou utilisez votre système de navigation
        return Promise.reject(error);
      }

      try {
        // Appel à l'endpoint de refresh
        const response: AxiosResponse<RefreshTokenResponse> = await axios.post("api/token/refresh/", {
          refresh: refreshToken
        });

        const newAccessToken: string = response.data.access;
        
        // Sauvegarder le nouveau token
        localStorage.setItem("@Auth:token", newAccessToken);

        // Mettre à jour le header de la requête originale
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Traiter la queue des requêtes en attente
        processQueue(null, newAccessToken);

        isRefreshing = false;

        // Rejouer la requête originale avec le nouveau token
        return axios(originalRequest);

      } catch (refreshError) {
        // Échec du refresh, déconnecter l'utilisateur
        console.log("Refresh token error:", refreshError);
        
        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.removeItem("@Auth:token");
        localStorage.removeItem("@Auth:refresh");
        localStorage.removeItem("user");
        
        // Rediriger vers la page de login ou dispatcher une action de déconnexion
        window.location.href = "/signin"; // Ou utilisez votre système de navigation
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
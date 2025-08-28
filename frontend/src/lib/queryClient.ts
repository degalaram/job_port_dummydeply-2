import { QueryClient, QueryFunction } from "@tanstack/react-query";

// API Base URL configuration for Render deployment
const getApiBaseUrl = () => {
  // Check for environment variable first (this should be set in Render)
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    return apiUrl;
  }

  // For production deployment on Render
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If this is your Render frontend URL, point to your backend
    if (hostname === 'job-render-deploy-dummy-2.onrender.com') {
      return 'https://job-render-deploy-dummy-2-backend.onrender.com';
    }
    
    // Generic Render detection
    if (hostname.includes('onrender.com')) {
      // Extract the base name and append -backend
      const baseName = hostname.split('.')[0];
      return `https://${baseName}-backend.onrender.com`;
    }
  }
  
  // Fallback for development
  return 'http://localhost:10000';
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const baseUrl = getApiBaseUrl();
  const fullUrl = baseUrl + url;
  
  console.log(`API Request: ${method} ${fullUrl}`); // Debug logging
  
  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = getApiBaseUrl();
    const url = baseUrl + "/" + queryKey.join("/");
    
    console.log(`Query: GET ${url}`); // Debug logging
    
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
      },
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
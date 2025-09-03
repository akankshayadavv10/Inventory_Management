// // api.js  (centralized API config)
// import axios from "axios";

// import Cookies from "js-cookie";

// const API = axios.create({
//   baseURL: process.env.baseUrl || "http://localhost:5000/api", // fallback for local
//   headers: { "Content-Type": "application/json" },
// });

// // Request interceptor to attach token + companyId
// API.interceptors.request.use((config) => {
//   const token = Cookies.get("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   const companyId = localStorage.getItem("selectedCompanyId");
//   if (companyId) {
//     if (config.method?.toLowerCase() === "get") {
//       config.params = config.params || {};
//       config.params.companyId = companyId; // add as query param for GET
//     } else if (["post", "put", "patch"].includes(config.method?.toLowerCase())) {
//       if (config.data && typeof config.data === "object") {
//         config.data.companyId = companyId; // add in body for others
//       }
//     }
//   }
//   return config;
// });

// export default API;








import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to attach token + companyId
API.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const companyId = localStorage.getItem("selectedCompanyId");
  if (companyId) {
    if (config.method?.toLowerCase() === "get") {
      config.params = config.params || {};
      config.params.companyId = companyId; // add as query param for GET
    } else if (["post", "put", "patch"].includes(config.method?.toLowerCase())) {
      if (config.data && typeof config.data === "object") {
        config.data.companyId = companyId; // add in body for others
      }
    }
  }
  return config;
});

export default API;

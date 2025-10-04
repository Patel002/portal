import axios from "axios";

const API_BASE = "http://localhost:7171/api";

const api = axios.create({
  baseURL: API_BASE,
});

export const getJobTitles = () => api.get("/job-title/job-title").then(res => res.data.data);
export const getCountryCodes = () => api.get("/country-code/country-code").then(res => res.data.data);
export const getSkills = () => api.get("/skill/skill").then(res => res.data.data);
export const getCareFacilities = () => api.get("/care-facility/care-facility").then(res => res.data.data);
export const getClientNeeds = () => api.get("/client-needs/needs").then(res => res.data.data);

export default api;

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Helper to unwrap a friendly error message
const getErrorMessage = (error) =>
  error?.response?.data?.message || "Something went wrong. Please try again.";

// ---------- Auth ----------
export const signupUser = async (payload) => {
  try {
    const { data } = await api.post("/auth/signup", payload);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const loginUser = async (payload) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// ---------- Tasks ----------
export const fetchTasks = async (userId, params = {}) => {
  try {
    const { data } = await api.get("/tasks", { params: { userId, ...params } });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createTask = async (payload) => {
  try {
    const { data } = await api.post("/tasks", payload);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateTask = async (id, payload) => {
  try {
    const { data } = await api.put(`/tasks/${id}`, payload);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteTask = async (id) => {
  try {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export default api;

import api from "./api";

export const menuService = {
  getMenu: (params) => api.get("/menu", { params }),
  getItem: (id) => api.get(`/menu/${id}`),
  createItem: (payload) => api.post("/menu", payload),
  updateItem: (id, payload) => api.put(`/menu/${id}`, payload),
  deleteItem: (id) => api.delete(`/menu/${id}`),
  getCategories: () => api.get("/categories"),
  createCategory: (payload) => api.post("/categories", payload),
  updateCategory: (id, payload) => api.put(`/categories/${id}`, payload)
};

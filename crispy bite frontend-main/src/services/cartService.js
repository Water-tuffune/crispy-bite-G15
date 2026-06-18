import api from "./api";

export const cartService = {
  getCart: () => api.get("/cart"),
  addItem: (payload) => api.post("/cart/items", payload),
  updateItem: (id, payload) => api.put(`/cart/items/${id}`, payload),
  removeItem: (id) => api.delete(`/cart/items/${id}`),
  clearCart: () => api.delete("/cart/clear")
};

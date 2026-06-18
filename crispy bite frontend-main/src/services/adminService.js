import api from "./api";

export const adminService = {
  stats: () => api.get("/admin/stats"),
  users: () => api.get("/admin/users"),
  orders: () => api.get("/admin/orders"),
  menu: () => api.get("/admin/menu"),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status })
};

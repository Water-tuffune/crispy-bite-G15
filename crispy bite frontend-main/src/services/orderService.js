import api from "./api";

export const orderService = {
  placeOrder: (payload) => api.post("/orders", payload),
  myOrders: () => api.get("/orders/my-orders"),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  staffOrders: () => api.get("/staff/orders"),
  accept: (id) => api.put(`/staff/orders/${id}/accept`),
  reject: (id) => api.put(`/staff/orders/${id}/reject`),
  preparing: (id) => api.put(`/staff/orders/${id}/preparing`),
  ready: (id) => api.put(`/staff/orders/${id}/ready`),
  assignRider: (id, rider_id) => api.put(`/staff/orders/${id}/assign-rider`, { rider_id }),
  riderOrders: () => api.get("/rider/orders"),
  pickedUp: (id, delivery_notes) => api.put(`/rider/orders/${id}/picked-up`, { delivery_notes }),
  onTheWay: (id, delivery_notes) => api.put(`/rider/orders/${id}/on-the-way`, { delivery_notes }),
  delivered: (id, delivery_notes) => api.put(`/rider/orders/${id}/delivered`, { delivery_notes })
};

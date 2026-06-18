import api from "./api";

export const trackingService = {
  getOrderTracking: (orderId) => api.get(`/tracking/order/${orderId}`)
};

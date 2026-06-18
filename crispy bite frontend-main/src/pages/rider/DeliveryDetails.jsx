import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import TrackingTimeline from "../../components/TrackingTimeline";
import { orderService } from "../../services/orderService";
import { trackingService } from "../../services/trackingService";

const DeliveryDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const [orderResponse, trackingResponse] = await Promise.all([
      orderService.getOrder(id),
      trackingService.getOrderTracking(id)
    ]);
    setOrder(orderResponse.data);
    setEvents(trackingResponse.data);
  };

  useEffect(() => {
    load();
  }, [id]);

  const update = async (action) => {
    await orderService[action](id, notes);
    setMessage("Delivery status updated.");
    setNotes("");
    load();
  };

  if (!order) return <LoadingSpinner />;

  return (
    <>
      <h1>{order.order_number}</h1>
      <AlertMessage type="success" message={message} />
      <div className="dashboard-card mb-3">
        <div className="d-flex justify-content-between">
          <div>
            <strong>{order.customer_name}</strong>
            <div>{order.area}, {order.street}, {order.district}</div>
            <div className="text-muted">{order.delivery_phone}</div>
          </div>
          <OrderStatusBadge status={order.order_status} />
        </div>
        <label className="form-label mt-3">Delivery notes</label>
        <textarea className="form-control mb-3" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="btn-group">
          <button className="btn btn-outline-primary" onClick={() => update("pickedUp")}>Picked Up</button>
          <button className="btn btn-outline-warning" onClick={() => update("onTheWay")}>On the Way</button>
          <button className="btn btn-success" onClick={() => update("delivered")}>Delivered</button>
        </div>
      </div>
      <div className="dashboard-card">
        <h2 className="h5">Tracking</h2>
        <TrackingTimeline events={events} />
      </div>
    </>
  );
};

export default DeliveryDetails;

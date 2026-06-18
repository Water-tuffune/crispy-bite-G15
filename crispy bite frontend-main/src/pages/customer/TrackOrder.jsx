import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TrackingTimeline from "../../components/TrackingTimeline";
import { trackingService } from "../../services/trackingService";

const TrackOrder = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    trackingService.getOrderTracking(id).then((response) => setEvents(response.data));
  }, [id]);

  return (
    <>
      <h1>Track Order #{id}</h1>
      <div className="dashboard-card">
        <TrackingTimeline events={events} />
      </div>
    </>
  );
};

export default TrackOrder;

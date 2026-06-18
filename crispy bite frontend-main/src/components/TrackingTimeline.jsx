import { formatDate } from "../utils/formatDate";

const TrackingTimeline = ({ events = [] }) => {
  if (!events.length) {
    return <p className="text-muted">No tracking events yet.</p>;
  }

  return (
    <div className="timeline">
      {events.map((event) => (
        <div className="timeline-item" key={event.id}>
          <strong>{event.status}</strong>
          <div className="text-muted small">{formatDate(event.created_at)}</div>
          <div>{event.description}</div>
          {event.updated_by_name && <div className="small text-muted">Updated by {event.updated_by_name}</div>}
        </div>
      ))}
    </div>
  );
};

export default TrackingTimeline;

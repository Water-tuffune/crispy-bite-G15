const LoadingSpinner = ({ label = "Loading..." }) => (
  <div className="d-flex align-items-center gap-2 py-4">
    <div className="spinner-border text-danger" role="status" aria-hidden="true"></div>
    <span>{label}</span>
  </div>
);

export default LoadingSpinner;

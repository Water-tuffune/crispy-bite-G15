const About = () => (
  <main className="container py-5">
    <h1>About QuickBite</h1>
    <p className="lead">
      QuickBite is a fictional student project that demonstrates a complete restaurant ordering workflow without using real restaurant trademarks or copyrighted menu assets.
    </p>
    <div className="row g-4 mt-2">
      <div className="col-md-4">
        <div className="dashboard-card h-100">
          <h2 className="h5">Customers</h2>
          <p>Browse food, manage carts, checkout, and track orders from placement through delivery.</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="dashboard-card h-100">
          <h2 className="h5">Restaurant Staff</h2>
          <p>Accept orders, prepare food, mark pickup readiness, and assign riders to delivery orders.</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="dashboard-card h-100">
          <h2 className="h5">Admins and Riders</h2>
          <p>Admins manage the system while riders update delivery progress for assigned orders.</p>
        </div>
      </div>
    </div>
  </main>
);

export default About;

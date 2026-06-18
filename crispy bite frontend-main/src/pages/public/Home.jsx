import { Link } from "react-router-dom";
import { menuService } from "../../services/menuService";
import { useEffect, useState } from "react";
import FoodCard from "../../components/FoodCard";

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    menuService.getMenu({ availability: "available" }).then((response) => {
      setItems(response.data.slice(0, 3));
    });
  }, []);

  return (
    <>
      <section className="hero-band">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h1 className="display-4 fw-bold">CrispyBite</h1>
              <p className="lead">A fictional fast-food ordering app for learning full-stack development with React, Express, JWT, and MariaDB.</p>
              <Link className="btn btn-danger btn-lg" to="/menu">Browse Menu</Link>
            </div>
            <div className="col-lg-5">
              <img className="img-fluid rounded" src="https://placehold.co/700x480/cc1f1a/ffffff?text=CrispyBite+Meals" alt="CrispyBite meals" />
            </div>
          </div>
        </div>
      </section>
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 mb-0">Popular Picks</h2>
          <Link to="/menu" className="text-danger">View all</Link>
        </div>
        <div className="row g-4">
          {items.map((item) => (
            <div className="col-md-4" key={item.id}>
              <FoodCard item={item} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;

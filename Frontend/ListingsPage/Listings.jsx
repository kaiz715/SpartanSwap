import React from "react";
import "./style.css"

const products = [
  {
    id: 1,
    image: "https://via.placeholder.com/300",
    title: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    price: "$120.23",
    orders: "24 Orders",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/300",
    title: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    price: "$120.23",
    orders: "24 Orders",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/300",
    title: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    price: "$120.23",
    orders: "24 Orders",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/300",
    title: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    price: "$120.23",
    orders: "24 Orders",
  },
];

const ListingsPage = () => {
  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">SpartanSwap</div>
        <ul className="nav-links">
          <li>Home Goods</li>
          <li>Clothes</li>
          <li>Rental</li>
          <li>Tickets</li>
        </ul>
        <div className="auth-buttons">
          <button className="create-btn">Create Listing</button>
          <button className="sign-in-btn">Sign In</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>PRICES</h3>
          <input type="range" min="50" max="500" />
          <p>$120 - $300</p>

          <h3>FILTERS</h3>
          <label><input type="checkbox" /> Women</label>
          <label><input type="checkbox" /> Ladies</label>
          <label><input type="checkbox" /> Girls</label>
          <label><input type="checkbox" /> Babies</label>

          <h3>CATEGORIES</h3>
          <label><input type="checkbox" /> Dresses</label>
          <label><input type="checkbox" /> Tops</label>
          <label><input type="checkbox" /> Lingerie & Lounge Wear</label>
          <label><input type="checkbox" /> Blouse</label>
        </aside>

        {/* Product Grid */}
        <section className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.title} />
              <h4>{product.title}</h4>
              <p className="price">{product.price}</p>
              <p className="orders">{product.orders}</p>
              <button className="wishlist">❤️</button>
            </div>
          ))}
        </section>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button>←</button>
        <button className="active">1</button>
        <button>2</button>
        <button>...</button>
        <button>13</button>
        <button>→</button>
      </div>
    </div>
  );
};

export default ListingsPage;

import React from "react";
import "./index.css";

export default function Main() {
  return (
    <div className="main-container">
      <div className="header">
        <div className="fashion-store-logo">
          <div className="fashion-store-logo-1" />
        </div>
        <div className="navigation-pill-list">
          <button className="navigation-pill">
            <span className="home-goods-title">Home Goods</span>
          </button>
          <div className="navigation-pill-2">
            <span className="clothes-title">Clothes</span>
          </div>
          <div className="navigation-pill-3">
            <span className="rental-title">Rental</span>
          </div>
          <div className="navigation-pill-4">
            <span className="title">Tickets</span>
          </div>
          <div className="navigation-pill-5" />
          <div className="navigation-pill-6" />
        </div>
        <button className="button">
          <span className="create-listing">Create Listing</span>
        </button>
        <button className="button-7">
          <span className="sign-in">Sign in</span>
        </button>
      </div>
      <div className="frame" />
      <div className="page-product">
        <div className="section">
          <div className="image" />
          <div className="column">
            <div className="body">
              <div className="title-8">
                <div className="text-heading">
                  <span className="text-heading-9">Item Name</span>
                </div>
                <div className="price">
                  <div className="text-price">
                    <div className="price-a">
                      <span className="dollar">$</span>
                      <span className="fifty">50</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="fields">
              <div className="select-field">
                <span className="label">Color</span>
                <div className="select">
                  <span className="value">Value</span>
                  <div className="chevron-down" />
                </div>
              </div>
              <div className="select-field-b">
                <span className="label-c">Type</span>
                <div className="select-d">
                  <span className="value-e">Value</span>
                  <div className="chevron-down-f" />
                </div>
              </div>
            </div>
            <button className="button-10">
              <span className="button-11">Contact Seller</span>
            </button>
            <div className="accordion">
              <div className="accordion-item">
                <div className="accordion-title">
                  <span className="title-12">Description</span>
                  <div className="chevron-up" />
                </div>
                <div className="accordion-content">
                  <span className="body-13">
                    Answer the frequently asked question in a simple sentence, a
                    longish paragraph, or even in a list.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="icon-button">
            <div className="heart" />
          </div>
        </div>
      </div>
    </div>
  );
}

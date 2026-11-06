import React, { useState } from 'react';
import { StarIcon, CheckIcon, CartIcon } from './Icons';

export default function ProductCard({ product, onAddToCart, isBuggyMode }) {
  const [selectedQty, setSelectedQty] = useState(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAdd = () => {
    // Dans le mode bug: la quantité est passée brute (String) pour reproduire le bug #1
    // Dans le mode corrigé: conversion stricte en entier positif
    const qtyToPass = isBuggyMode ? String(selectedQty) : Number(selectedQty);
    onAddToCart(product, qtyToPass);

    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 1200);
  };

  const isLowStock = product.stock <= 5;

  return (
    <article className="product-card" data-product-id={product.id}>
      <div className="product-image-container">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="product-image-fallback">
            <span>{product.name}</span>
          </div>
        )}
        <span className="product-category-tag">{product.category}</span>
        {isLowStock && <span className="low-stock-badge">Stock limité : {product.stock}</span>}
      </div>

      <div className="product-info">
        <div className="product-rating">
          <StarIcon size={14} />
          <span className="rating-value">{product.rating}</span>
          <span className="stock-count">({product.stock} disponibles)</span>
        </div>

        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-footer">
          <div className="product-price-box">
            <span className="price-label">Prix unitaire</span>
            <span className="product-price">{Number(product.price).toFixed(2)} DT</span>
          </div>

          <div className="card-actions">
            <div className="qty-selector">
              <label htmlFor={`qty-${product.id}`} className="sr-only">Quantité</label>
              <select
                id={`qty-${product.id}`}
                className="qty-dropdown"
                value={selectedQty}
                onChange={(e) => setSelectedQty(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <button
              className={`add-to-cart-btn ${isAddedFeedback ? 'added' : ''}`}
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              {isAddedFeedback ? (
                <>
                  <CheckIcon size={14} />
                  <span>Ajouté</span>
                </>
              ) : (
                <>
                  <CartIcon size={14} />
                  <span>Ajouter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

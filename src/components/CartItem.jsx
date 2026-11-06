import React, { useState } from 'react';
import { PlusIcon, MinusIcon, TrashIcon } from './Icons';

export default function CartItem({
  item,
  onUpdateQuantity,
  onDelete, // Nom de prop attendu par le composant
  isBuggyMode
}) {
  const [imgError, setImgError] = useState(false);
  const itemTotal = (Number(item.price) * Number(item.quantity)).toFixed(2);

  const handleQtyChange = (e) => {
    const rawVal = e.target.value;
    // En mode bug: la valeur du champ texte n'est pas castée en nombre (ex: "1" + 1 = "11")
    // En mode corrigé: conversion parseInt
    if (isBuggyMode) {
      onUpdateQuantity(item.id, rawVal);
    } else {
      const parsed = parseInt(rawVal, 10);
      if (!isNaN(parsed) && parsed > 0) {
        onUpdateQuantity(item.id, parsed);
      }
    }
  };

  const handleIncrement = () => {
    // En mode bug: concaténation de chaînes
    const nextQty = isBuggyMode ? item.quantity + 1 : Number(item.quantity) + 1;
    onUpdateQuantity(item.id, nextQty);
  };

  const handleDecrement = () => {
    const current = Number(item.quantity);
    if (current > 1) {
      onUpdateQuantity(item.id, current - 1);
    }
  };

  const handleRemoveClick = () => {
    // DÉMONSTRATION BUG #2:
    // Si onDelete est undefined (parce que le parent passe onRemoveItem au lieu de onDelete),
    // l'appel direct déclenche: TypeError: onDelete is not a function.
    if (typeof onDelete === 'function') {
      onDelete(item.id);
    } else {
      console.error(
        '[React DevTools Diagnostic]: Prop `onDelete` manquante sur <CartItem> ! Props reçues :',
        { item, onDelete }
      );
      alert(
        `[Diagnostic React DevTools - Bug #2 Déclenché] :\n\n` +
        `'onDelete' n'est pas une fonction (reçu: ${typeof onDelete}).\n\n` +
        `Inspectez <CartItem> dans l'onglet Components de React Developer Tools : la prop 'onDelete' est 'undefined' car le composant parent <Cart> a transmis la prop sous le nom 'onRemoveItem'.`
      );
    }
  };

  return (
    <div className="cart-item-row" data-cart-id={item.id}>
      <div className="cart-item-image">
        {!imgError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="cart-item-placeholder">{item.name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>

      <div className="cart-item-details">
        <h4 className="cart-item-title">{item.name}</h4>
        <div className="cart-item-meta">
          <span className="cart-unit-price">{Number(item.price).toFixed(2)} DT</span>
          <span className="cart-category-tag">{item.category}</span>
        </div>
      </div>

      <div className="cart-item-quantity-controls">
        <button
          className="qty-btn"
          onClick={handleDecrement}
          disabled={Number(item.quantity) <= 1}
          title="Diminuer la quantité"
        >
          <MinusIcon size={12} />
        </button>

        <input
          type="number"
          min="1"
          max="99"
          className="qty-input"
          value={item.quantity}
          onChange={handleQtyChange}
          aria-label={`Quantité pour ${item.name}`}
        />

        <button
          className="qty-btn"
          onClick={handleIncrement}
          title="Augmenter la quantité"
        >
          <PlusIcon size={12} />
        </button>
      </div>

      <div className="cart-item-total">
        <span className="item-subtotal-price">{itemTotal} DT</span>
        <button
          className="remove-item-btn"
          onClick={handleRemoveClick}
          title="Supprimer l'article"
          aria-label="Supprimer cet article"
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </div>
  );
}

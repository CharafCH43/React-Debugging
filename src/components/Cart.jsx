import React, { useState, useMemo } from 'react';
import CartItem from './CartItem';
import { DISCOUNT_CODES } from '../data/initialData';
import { CartIcon, CheckIcon, CloseIcon, ArrowRightIcon } from './Icons';

export default function Cart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  isBuggyMode,
  onNavigateToShop
}) {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const qty = isBuggyMode ? Number(item.quantity) || 0 : Number(item.quantity);
      return acc + Number(item.price) * qty;
    }, 0);
  }, [cartItems, isBuggyMode]);

  const discountRate = appliedPromo ? DISCOUNT_CODES[appliedPromo] || 0 : 0;
  const discountAmount = subtotal * discountRate;
  const taxRate = 0.19; // TVA 19%
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const finalTotal = Math.max(0, subtotal - discountAmount + taxAmount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();

    if (!code) {
      setPromoError('Veuillez saisir un code promo.');
      return;
    }

    if (DISCOUNT_CODES[code]) {
      setAppliedPromo(code);
      setPromoInput('');
    } else {
      setPromoError(`Code "${code}" non reconnu. Codes valides : DEV10, GMC20, CHARF30`);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      onClearCart();
    }, 1200);
  };

  if (orderComplete) {
    return (
      <div className="cart-empty-view">
        <div className="order-success-card">
          <div className="success-badge-icon">
            <CheckIcon size={32} />
          </div>
          <h2>Commande validée avec succès</h2>
          <p>La commande a été enregistrée et sera expédiée à l'adresse de Charf Eddine.</p>
          <div className="order-details-box">
            <p><strong>Référence :</strong> #{Math.floor(100000 + Math.random() * 900000)}</p>
            <p><strong>Statut :</strong> Prêt pour vérification dans React DevTools</p>
          </div>
          <button
            className="action-btn primary-btn"
            onClick={() => {
              setOrderComplete(false);
              onNavigateToShop();
            }}
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-view">
        <div className="empty-cart-card">
          <div className="empty-cart-icon-wrapper">
            <CartIcon size={40} />
          </div>
          <h2>Votre panier est vide</h2>
          <p>Sélectionnez des articles dans notre catalogue pour tester les calculs d'état et le passage de props.</p>
          <button className="action-btn primary-btn" onClick={onNavigateToShop}>
            Découvrir le catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <div>
          <h2>Mon Panier ({cartItems.reduce((acc, i) => acc + Number(i.quantity), 0)} article{cartItems.length > 1 ? 's' : ''})</h2>
          <p className="cart-subtitle">Ajustement des quantités et validation des codes de remise</p>
        </div>
        <button className="clear-cart-btn" onClick={onClearCart}>
          Vider le panier
        </button>
      </div>

      <div className="cart-content-layout">
        <div className="cart-items-column">
          {cartItems.map((item, index) => {
            // BUG #2 :
            // Mode bug : passe onRemoveItem au lieu de onDelete attendu par CartItem
            // Mode corrigé : passe onDelete
            return (
              <CartItem
                key={isBuggyMode ? index : item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                {...(isBuggyMode
                  ? { onRemoveItem: onRemoveItem }
                  : { onDelete: onRemoveItem }
                )}
                isBuggyMode={isBuggyMode}
              />
            );
          })}
        </div>

        <div className="cart-summary-column">
          <div className="summary-card">
            <h3>Récapitulatif de commande</h3>

            <div className="promo-form-section">
              <form onSubmit={handleApplyPromo} className="promo-form">
                <input
                  type="text"
                  placeholder="Code promo (ex: GMC20)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="promo-input"
                />
                <button type="submit" className="apply-promo-btn">
                  Appliquer
                </button>
              </form>
              {promoError && <p className="promo-error-msg">{promoError}</p>}
              {appliedPromo && (
                <div className="applied-promo-tag">
                  <span>Code <strong>{appliedPromo}</strong> actif (-{discountRate * 100}%)</span>
                  <button onClick={() => setAppliedPromo(null)} className="remove-promo-btn" title="Retirer ce code">
                    <CloseIcon size={12} />
                  </button>
                </div>
              )}
            </div>

            <div className="summary-breakdown">
              <div className="summary-line">
                <span>Sous-total HT</span>
                <span>{subtotal.toFixed(2)} DT</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-line discount-line">
                  <span>Remise ({discountRate * 100}%)</span>
                  <span>-{discountAmount.toFixed(2)} DT</span>
                </div>
              )}

              <div className="summary-line">
                <span>TVA (19%)</span>
                <span>{taxAmount.toFixed(2)} DT</span>
              </div>

              <div className="summary-line">
                <span>Livraison</span>
                <span className="free-shipping">Offerte</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-line total-line">
                <span>Total TTC</span>
                <span className="final-total-price">{finalTotal.toFixed(2)} DT</span>
              </div>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut || cartItems.length === 0}
            >
              <span>{isCheckingOut ? 'Traitement...' : 'Passer la commande'}</span>
              {!isCheckingOut && <ArrowRightIcon size={16} />}
            </button>

            <div className="devtools-tip-callout">
              <strong>Point de contrôle React DevTools :</strong>
              <p>
                Sélectionnez <code>Cart</code> dans l'arbre des composants pour observer le tableau <code>cartItems</code> dans l'onglet Hooks &gt; State.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import UserProfile from './components/UserProfile';
import BugTracker from './components/BugTracker';
import DevToolsGuide from './components/DevToolsGuide';
import { INITIAL_PRODUCTS, INITIAL_USER } from './data/initialData';
import { AlertIcon, ReactLogo } from './components/Icons';

export default function App() {
  const [products] = useState(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState([
    {
      id: 'prod-101',
      name: 'Sony WH-1000XM5 Casque Sans Fil',
      category: 'Audio',
      price: 349.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'prod-103',
      name: 'Keychron K2 V2 Clavier Mécanique',
      category: 'Périphériques',
      price: 99.50,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80'
    }
  ]);

  const [user, setUser] = useState(INITIAL_USER);
  const [activeTab, setActiveTab] = useState('shop'); // 'shop' | 'cart' | 'profile' | 'audit' | 'guide'
  const [searchTerm, setSearchTerm] = useState('');
  const [isBuggyMode, setIsBuggyMode] = useState(false);

  // GESTION DU BUG #1 :
  // Mode bug : mutation directe de tableau et manipulation brute de chaînes de caractères
  // Mode corrigé : mise à jour immuable avec .map() et conversion stricte en entier
  const handleAddToCart = (product, qtyToAdd = 1) => {
    if (isBuggyMode) {
      // ❌ Code présentant l'anomalie : mutation directe du tableau dans le state
      const existing = cartItems.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity = existing.quantity + qtyToAdd;
        setCartItems(cartItems); // Même référence : React n'ordonne pas de nouveau rendu
      } else {
        cartItems.push({ ...product, quantity: qtyToAdd });
        setCartItems(cartItems);
      }
      return;
    }

    // ✅ Version corrigée : création d'une nouvelle référence de tableau
    const numericQty = Math.max(1, parseInt(qtyToAdd, 10) || 1);
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        return prevItems.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: Number(item.quantity) + numericQty }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: numericQty,
            image: product.image
          }
        ];
      }
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (isBuggyMode) {
      // ❌ Code avec anomalie :
      const targetItem = cartItems.find((i) => i.id === productId);
      if (targetItem) {
        targetItem.quantity = newQuantity; // Mutation directe
        setCartItems(cartItems);
      }
      return;
    }

    // ✅ Version corrigée :
    const safeQty = Math.max(1, parseInt(newQuantity, 10) || 1);
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: safeQty } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0);

  return (
    <div className="app-root">
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartItemCount={totalCartCount}
        onCartClick={() => setActiveTab('cart')}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isBuggyMode={isBuggyMode}
        onToggleBuggyMode={() => setIsBuggyMode(!isBuggyMode)}
        user={user}
      />

      {isBuggyMode && (
        <div className="buggy-mode-banner">
          <div className="banner-content">
            <AlertIcon size={18} className="banner-icon" />
            <div>
              <strong>Mode Simulation d'Anomalies Actif :</strong> Les bugs #1, #2, #3 et #4 sont actuellement injectés dans l'arborescence des composants.
              Ouvrez les <strong>React Developer Tools</strong> pour inspecter l'arbre des composants, les props et les valeurs d'état.
            </div>
            <button
              className="banner-switch-btn"
              onClick={() => setIsBuggyMode(false)}
            >
              Rétablir la version corrigée
            </button>
          </div>
        </div>
      )}

      <main className="main-content-area">
        {activeTab === 'shop' && (
          <ProductList
            products={products}
            searchTerm={searchTerm}
            onAddToCart={handleAddToCart}
            isBuggyMode={isBuggyMode}
          />
        )}

        {activeTab === 'cart' && (
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            isBuggyMode={isBuggyMode}
            onNavigateToShop={() => setActiveTab('shop')}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfile
            user={user}
            onUpdateUser={handleUpdateUser}
            isBuggyMode={isBuggyMode}
          />
        )}

        {activeTab === 'audit' && (
          <BugTracker
            isBuggyMode={isBuggyMode}
            onToggleBuggyMode={() => setIsBuggyMode(!isBuggyMode)}
          />
        )}

        {activeTab === 'guide' && <DevToolsGuide />}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <ReactLogo size={20} />
            <span>Projet Checkpoint — Débogage d'application React avec React Developer Tools</span>
          </div>
          <div className="footer-links">
            <button onClick={() => setActiveTab('guide')}>Guide DevTools</button>
            <span>•</span>
            <button onClick={() => setActiveTab('audit')}>Analyse des 5 Bugs</button>
            <span>•</span>
            <button onClick={() => setActiveTab('profile')}>Compte Charf</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

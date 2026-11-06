import React from 'react';
import {
  SearchIcon,
  CartIcon,
  UserIcon,
  ReactLogo,
  CloseIcon,
  BugIcon,
  PackageIcon,
  BookIcon,
  AlertIcon,
  CheckIcon
} from './Icons';

export default function Navbar({
  searchTerm,
  onSearchChange,
  cartItemCount,
  onCartClick,
  activeTab,
  onTabChange,
  isBuggyMode,
  onToggleBuggyMode,
  user
}) {
  return (
    <header className="navbar-container">
      <div className="navbar-top">
        <div className="brand-section">
          <button className="brand-logo" onClick={() => onTabChange('shop')} title="Accueil de la boutique">
            <ReactLogo size={28} className="logo-icon" />
            <div className="brand-text">
              <span className="brand-title">TechStore</span>
              <span className="brand-subtitle">Laboratoire React DevTools</span>
            </div>
          </button>
        </div>

        <div className="search-bar-wrapper">
          <SearchIcon size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un produit, une référence, une catégorie..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Effacer la recherche"
            >
              <CloseIcon size={13} />
            </button>
          )}
        </div>

        <div className="nav-actions">
          {/* Debug Mode Switcher */}
          <div className="mode-toggle-box" title="Bascule entre version corrigée et simulation de bugs pour inspection DevTools">
            <button
              className={`toggle-switch-btn ${isBuggyMode ? 'buggy' : 'fixed'}`}
              onClick={onToggleBuggyMode}
            >
              {isBuggyMode ? (
                <>
                  <AlertIcon size={14} />
                  <span>Mode Anomalies Actif</span>
                </>
              ) : (
                <>
                  <CheckIcon size={14} />
                  <span>Version Corrigée</span>
                </>
              )}
            </button>
          </div>

          {/* Cart Icon & Count Badge */}
          <button
            className="cart-nav-btn"
            onClick={onCartClick}
            aria-label="Voir le panier"
          >
            <CartIcon size={18} />
            <span className="cart-label">Panier</span>
            <span className="cart-badge">{cartItemCount}</span>
          </button>

          {/* User profile avatar / initials */}
          <button
            className="user-nav-chip"
            onClick={() => onTabChange('profile')}
            title="Inspecter le composant UserProfile dans DevTools"
          >
            <span className="user-initials-badge">{user?.initials || 'CE'}</span>
            <span className="user-name">{user?.name ? user.name.split(' ')[0] : 'Charf'}</span>
          </button>
        </div>
      </div>

      <nav className="navbar-nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => onTabChange('shop')}
        >
          <PackageIcon size={16} />
          <span>Catalogue Produits</span>
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => onTabChange('cart')}
        >
          <CartIcon size={16} />
          <span>Panier ({cartItemCount})</span>
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          <UserIcon size={16} />
          <span>Profil Client</span>
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => onTabChange('audit')}
        >
          <BugIcon size={16} />
          <span>Diagnostic des 5 Bugs</span>
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
          onClick={() => onTabChange('guide')}
        >
          <BookIcon size={16} />
          <span>Guide React DevTools</span>
        </button>
      </nav>
    </header>
  );
}

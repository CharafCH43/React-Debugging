import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { SearchIcon, AlertIcon } from './Icons';

export default function ProductList({
  products,
  searchTerm,
  onAddToCart,
  isBuggyMode
}) {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState('featured');

  const categories = useMemo(() => {
    const list = ['Tous', ...new Set(products.map((p) => p.category))];
    return list;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'Tous' || p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <section className="product-list-section">
      <div className="catalog-toolbar">
        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sort-controls">
          <label htmlFor="sort-select" className="sort-label">Trier par :</label>
          <select
            id="sort-select"
            className="sort-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Sélection</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
            <option value="rating">Meilleures notes</option>
          </select>
        </div>
      </div>

      <div className="catalog-status-bar">
        <span><strong>{filteredProducts.length}</strong> référence{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}</span>
        {isBuggyMode && (
          <span className="buggy-warning-inline">
            <AlertIcon size={14} />
            <span>Mode Bug Actif : inspectez <code>&lt;ProductList&gt;</code> dans DevTools pour observer <code>key={`{index}`}</code>.</span>
          </span>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-catalog-state">
          <SearchIcon size={36} className="empty-icon" />
          <h3>Aucun produit ne correspond à votre recherche</h3>
          <p>Modifiez votre filtre ou recherchez un autre terme dans le catalogue.</p>
          <button
            className="reset-filters-btn"
            onClick={() => {
              setSelectedCategory('Tous');
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product, index) => {
            // BUG #3 : Utilisation de l'index comme clé dans le mode bug
            // Clé stable et persistante product.id dans la version corrigée
            const keyProp = isBuggyMode ? index : product.id;

            return (
              <ProductCard
                key={keyProp}
                product={product}
                onAddToCart={onAddToCart}
                isBuggyMode={isBuggyMode}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

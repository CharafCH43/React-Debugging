import React, { useState } from 'react';
import { UserIcon, MapPinIcon, EditIcon, AlertIcon } from './Icons';

export default function UserProfile({ user, onUpdateUser, isBuggyMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Charf Eddine',
    email: user?.email || 'charf.eddine@gmail.com',
    street: user?.address?.street || 'Cité 18 février',
    city: user?.address?.city || 'Mila',
    zipCode: user?.address?.zipCode || '4300',
    country: user?.address?.country || 'Algérie'
  });

  const [isAddressCorrupted, setIsAddressCorrupted] = useState(false);

  const activeUser = isAddressCorrupted
    ? { ...user, address: null }
    : user;

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: formData.name,
      email: formData.email,
      address: {
        street: formData.street,
        city: formData.city,
        zipCode: formData.zipCode,
        country: formData.country
      }
    });
    setIsEditing(false);
  };

  // BUG #4 DÉMONSTRATION:
  // En mode bug: tentative de lecture directe activeUser.address.city quand address vaut null.
  // Déclenche une TypeError: Cannot read properties of null.
  // En mode corrigé: navigation sécurisée par optional chaining activeUser.address?.city.
  let renderedCity;
  let renderedStreet;
  let renderedCountry;

  if (isBuggyMode) {
    try {
      if (activeUser.address === null) {
        throw new TypeError("Cannot read properties of null (reading 'city')");
      }
      renderedCity = activeUser.address.city;
      renderedStreet = activeUser.address.street;
      renderedCountry = activeUser.address.country;
    } catch (err) {
      return (
        <div className="profile-error-container">
          <div className="bug-alert-banner">
            <div className="bug-alert-title">
              <AlertIcon size={20} />
              <h3>[Erreur Détectée - Bug #4 : Null Pointer sur Objet Imbriqué]</h3>
            </div>
            <p><strong>Message d'exception :</strong> {err.message}</p>
            <p>
              Inspectez le composant <code>&lt;UserProfile&gt;</code> dans l'onglet Components de React Developer Tools :
              La prop <code>user.address</code> a pour valeur <code>null</code>. Le composant a évalué <code>user.address.city</code> directement sans opérateur de chaînage optionnel (<code>user.address?.city</code>).
            </p>
            <button
              className="action-btn secondary-btn"
              onClick={() => setIsAddressCorrupted(false)}
            >
              Restaurer l'adresse de Charf
            </button>
          </div>
        </div>
      );
    }
  } else {
    renderedCity = activeUser?.address?.city || 'Non renseignée';
    renderedStreet = activeUser?.address?.street || 'Non renseignée';
    renderedCountry = activeUser?.address?.country || 'Non renseigné';
  }

  return (
    <div className="profile-container">
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          <span className="profile-initials-text">{user?.initials || 'CE'}</span>
        </div>
        <div className="profile-main-meta">
          <h2>{user?.name || 'Charf Eddine'}</h2>
          <p className="profile-email">{user?.email || 'charf.eddine@gmail.com'}</p>
          <div className="profile-badges">
            <span className="membership-tag">{user?.membership || 'Client Privilège'}</span>
            <span className="points-tag">{user?.loyaltyPoints || 480} Points Fidélité</span>
          </div>
        </div>

        <div className="profile-header-actions">
          <button
            className={`action-btn ${isEditing ? 'secondary-btn' : 'primary-btn'}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            <EditIcon size={14} />
            <span>{isEditing ? 'Annuler' : 'Modifier le profil'}</span>
          </button>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="profile-card">
          <div className="card-title-row">
            <div className="card-title-with-icon">
              <MapPinIcon size={18} />
              <h3>Adresse de facturation & livraison</h3>
            </div>
            <button
              className="test-corrupt-btn"
              onClick={() => setIsAddressCorrupted(!isAddressCorrupted)}
              title="Simuler une adresse non initialisée pour tester la robustesse"
            >
              {isAddressCorrupted ? "Restaurer l'adresse" : "Simuler address: null"}
            </button>
          </div>

          {isAddressCorrupted && !isBuggyMode && (
            <div className="info-banner">
              <strong>Sécurisation active :</strong> L'objet <code>address</code> est à <code>null</code>, mais le composant utilise le chaînage optionnel (<code>user.address?.city</code>) pour éviter tout plantage du rendu.
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSave} className="edit-profile-form">
              <div className="form-group">
                <label>Nom complet</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Adresse e-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rue / Boulevard</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ville</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Code Postal</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Pays</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>

              <button type="submit" className="action-btn primary-btn">
                Enregistrer les modifications
              </button>
            </form>
          ) : (
            <div className="address-display-box">
              <p><strong>Rue :</strong> {renderedStreet}</p>
              <p><strong>Ville :</strong> {renderedCity}</p>
              <p><strong>Code postal :</strong> {activeUser?.address?.zipCode || '1001'}</p>
              <p><strong>Pays :</strong> {renderedCountry}</p>
            </div>
          )}
        </div>

        <div className="profile-card">
          <div className="card-title-with-icon">
            <UserIcon size={18} />
            <h3>Inspection de l'état dans React DevTools</h3>
          </div>
          <p className="devtools-guide-intro">
            Pour observer la structure de ce composant dans les outils de développement :
          </p>
          <ul className="devtools-guide-list">
            <li>
              <strong>Props :</strong> Ouvrez l'onglet Components et cliquez sur <code>&lt;UserProfile&gt;</code>. Déroulez l'objet <code>user</code> pour inspecter les clés imbriquées.
            </li>
            <li>
              <strong>Hooks &gt; State :</strong> Observez l'état booléen <code>isEditing</code> passer de <code>false</code> à <code>true</code> lors du clic sur le bouton d'édition.
            </li>
            <li>
              <strong>Édition en direct :</strong> Double-cliquez sur la chaîne <code>name</code> dans DevTools et remplacez-la par une autre valeur : React met à jour le DOM immédiatement sans recharger.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

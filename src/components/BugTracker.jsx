import React, { useState } from 'react';
import { BugIcon, AlertIcon, CheckIcon } from './Icons';

export default function BugTracker({ isBuggyMode, onToggleBuggyMode }) {
  const [activeBugId, setActiveBugId] = useState('bug-1');

  const bugs = [
    {
      id: 'bug-1',
      title: 'Bug 1 : Mutation directe du state et concaténation de chaînes dans la quantité',
      category: 'Gestion d\'état & Typage',
      severity: 'Critique',
      symptom: 'Lors de l\'incrémentation de la quantité dans le panier, "1" + 1 devenait "11" au lieu de 2. De plus, modifier les articles ne déclenchait pas systématiquement de nouveau rendu.',
      devtoolsRole: 'Onglet Components > Panneau Props & State',
      inspectionSteps: [
        'Ouvrir l\'onglet Components de React DevTools et rechercher <CartItem>.',
        'Vérifier la prop item dans le panneau de droite : remarquer que quantity vaut "1" (chaîne) au lieu d\'un Number.',
        'Dans <App>, inspecter le state cartItems : lors d\'une mutation directe (ex: cart[i].quantity = ...), React ne détecte aucun changement de référence mémoire et ignore le re-render.'
      ],
      rootCause: '1) La valeur brute de l\'input HTML était injectée dans le state sans conversion parseInt / Number. 2) Le state était muté sur place, violant le principe d\'immuabilité de React.',
      buggyCode: `// AVANT (Bug) : Mutation directe du state & valeur non castée
const handleUpdateQuantity = (productId, newQty) => {
  const item = cartItems.find(i => i.id === productId);
  if (item) {
    item.quantity = newQty; // Mutation directe de l'objet dans le tableau
    setCartItems(cartItems); // Même référence mémoire : React ignore le re-render
  }
};`,
      fixedCode: `// APRÈS (Corrigé) : Mise à jour immuable avec parseInt
const handleUpdateQuantity = (productId, newQty) => {
  const parsedQty = Math.max(1, parseInt(newQty, 10) || 1);
  setCartItems(prevItems =>
    prevItems.map(item =>
      item.id === productId
        ? { ...item, quantity: parsedQty } // Nouvelle référence d'objet
        : item
    )
  );
};`
    },
    {
      id: 'bug-2',
      title: 'Bug 2 : Incohérence de nommage de prop (onRemoveItem vs onDelete)',
      category: 'Props & Communication inter-composants',
      severity: 'Élevé',
      symptom: 'Le clic sur l\'icône de suppression d\'un article déclenchait une erreur JavaScript non gérée : "TypeError: onDelete is not a function".',
      devtoolsRole: 'Onglet Components > Arborescence & Panneau des Props',
      inspectionSteps: [
        'Inspecter le composant <CartItem> dans l\'arbre des composants DevTools.',
        'Regarder le panneau des props de <CartItem> : la prop onDelete est marquée comme undefined.',
        'Sélectionner le composant parent <Cart> : remarquer que <Cart> transmet onRemoveItem={handleRemove} au lieu de onDelete={handleRemove}.'
      ],
      rootCause: 'Écart entre le contrat attendu par le composant enfant (<CartItem> attend props.onDelete) et le nom fourni par le composant parent (<Cart> a passé onRemoveItem).',
      buggyCode: `// AVANT (Bug) : Nom de prop erroné passé par le parent
// Dans Cart.jsx :
<CartItem
  item={item}
  onRemoveItem={handleRemove} // Le composant attend 'onDelete'
/>

// Dans CartItem.jsx :
<button onClick={() => onDelete(item.id)}>Supprimer</button> // CRASH : onDelete est undefined`,
      fixedCode: `// APRÈS (Corrigé) : Alignement du nom de prop et vérification défensive
// Dans Cart.jsx :
<CartItem
  key={item.id}
  item={item}
  onDelete={handleRemove} // Nom de prop aligné
/>

// Dans CartItem.jsx :
const handleRemoveClick = () => {
  if (typeof onDelete === 'function') {
    onDelete(item.id);
  }
};`
    },
    {
      id: 'bug-3',
      title: 'Bug 3 : Index de tableau utilisé comme "key" dans la réconciliation de listes',
      category: 'Virtual DOM & Réconciliation',
      severity: 'Moyen',
      symptom: 'Avertissement en console : "Each child in a list should have a unique key prop". Lors du tri ou de la suppression d\'articles, les états internes des champs se décalaient.',
      devtoolsRole: 'Onglet Components > Surlignage des rendus & Inspection des clés',
      inspectionSteps: [
        'Ouvrir les paramètres DevTools > Activer "Highlight updates when components render".',
        'Inspecter les éléments <ProductCard> dans l\'arbre Components.',
        'Observer l\'attribut key : il affiche des entiers séquentiels (0, 1, 2) au lieu de l\'identifiant unique de produit.',
        'Trier la liste par prix et observer que React réutilise les mauvais noeuds DOM.'
      ],
      rootCause: 'Utilisation de l\'index de tableau key={index} au lieu d\'un identifiant stable et unique key={product.id}.',
      buggyCode: `// AVANT (Bug) : Utilisation de l'index comme clé
{products.map((product, index) => (
  <ProductCard
    key={index} // Clé instable lors des tris et filtrages
    product={product}
  />
))}`,
      fixedCode: `// APRÈS (Corrigé) : Identifiant unique stable comme clé
{products.map((product) => (
  <ProductCard
    key={product.id} // Clé pérenne associée à l'entité
    product={product}
  />
))}`
    },
    {
      id: 'bug-4',
      title: 'Bug 4 : Plantage sur lecture d\'une propriété imbriquée d\'un objet null',
      category: 'Rendu conditionnel & Données asynchrones',
      severity: 'Élevé',
      symptom: 'Plantage de l\'application : "TypeError: Cannot read properties of null (reading city)" lorsque les données utilisateur sont partielles ou en cours de chargement.',
      devtoolsRole: 'Onglet Components > Inspection des valeurs du state',
      inspectionSteps: [
        'Dans l\'arbre Components, naviguer vers <UserProfile>.',
        'Inspecter la prop user : user.address est à la valeur null.',
        'Observer que l\'évaluation directe user.address.city interrompt le cycle de rendu React avant affichage.'
      ],
      rootCause: 'Accès direct à une propriété imbriquée sans vérification préalable ni chaînage optionnel (?.).',
      buggyCode: `// AVANT (Bug) : Accès direct risqué
function UserProfile({ user }) {
  // Si user.address est null, cette ligne bloque tout le composant
  return <div>{user.address.city}</div>;
}`,
      fixedCode: `// APRÈS (Corrigé) : Chaînage optionnel et valeur de repli
function UserProfile({ user }) {
  // Rendu sécurisé affichant une valeur de repli si address est absent
  return <div>{user?.address?.city || 'Non renseignée'}</div>;
}`
    },
    {
      id: 'bug-5',
      title: 'Bug 5 : Re-rendus excessifs causés par des dépendances d\'objets instables dans useEffect',
      category: 'Performance & Gestion des dépendances de hooks',
      severity: 'Élevé',
      symptom: 'Ralentissement notable lors de la saisie de coupons ou message "Maximum update depth exceeded" en console.',
      devtoolsRole: 'Onglet Profiler > Flamegraph & Analyse des commits',
      inspectionSteps: [
        'Basculer sur l\'onglet Profiler dans React DevTools.',
        'Lancer l\'enregistrement, interagir avec la page, puis arrêter.',
        'Examiner le graphique Flamegraph : identifier les composants colorés en jaune/orange.',
        'Vérifier la colonne "Why did this render?" : Hook a changé à chaque commit car un objet de configuration était réinstancié inline à chaque rendu.'
      ],
      rootCause: 'Passage d\'un objet non mémorisé dans le tableau de dépendances d\'un useEffect.',
      buggyCode: `// AVANT (Bug) : Référence recréée à chaque rendu
useEffect(() => {
  recalculateTotal(config); // config = { currency: 'DT' } créé inline
}, [config]); // Référence différente à chaque passe -> boucle infinie`,
      fixedCode: `// APRÈS (Corrigé) : Dépendance sur valeur primitive ou mémorisée
const config = useMemo(() => ({ currency: 'DT' }), []);

useEffect(() => {
  recalculateTotal(config);
}, [config]); // Référence stable garantie`
    }
  ];

  const selectedBug = bugs.find((b) => b.id === activeBugId) || bugs[0];

  return (
    <div className="bug-tracker-container">
      <div className="bug-tracker-header">
        <div>
          <h2>Diagnostic des Anomalies React</h2>
          <p>
            Analyse détaillée des 5 anomalies identifiées, diagnostiquées via React DevTools et résolues.
          </p>
        </div>

        <div className="simulation-control">
          <span className="control-label">État du projet :</span>
          <button
            className={`mode-badge-btn ${isBuggyMode ? 'is-buggy' : 'is-fixed'}`}
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
                <span>Version Corrigée Active</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bug-tracker-layout">
        <aside className="bug-nav-list">
          {bugs.map((bug) => (
            <button
              key={bug.id}
              className={`bug-nav-item ${activeBugId === bug.id ? 'active' : ''}`}
              onClick={() => setActiveBugId(bug.id)}
            >
              <div className="bug-item-header">
                <span className={`bug-severity-pill ${bug.severity.toLowerCase()}`}>
                  {bug.severity}
                </span>
                <span className="bug-id-tag">{bug.id.toUpperCase()}</span>
              </div>
              <h4 className="bug-item-title">{bug.title}</h4>
              <span className="bug-category-label">{bug.category}</span>
            </button>
          ))}
        </aside>

        <main className="bug-detail-content">
          <div className="bug-detail-header">
            <div>
              <span className="badge-category">{selectedBug.category}</span>
              <h3>{selectedBug.title}</h3>
            </div>
            <div className="devtools-role-badge">
              <strong>Outil utilisé :</strong> {selectedBug.devtoolsRole}
            </div>
          </div>

          <div className="detail-section">
            <h4>Comportement observé (Symptôme)</h4>
            <div className="symptom-box">{selectedBug.symptom}</div>
          </div>

          <div className="detail-section">
            <h4>Procédure de diagnostic avec React Developer Tools</h4>
            <ol className="diagnostic-steps-list">
              {selectedBug.inspectionSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="detail-section">
            <h4>Origine du problème (Root Cause)</h4>
            <p className="root-cause-text">{selectedBug.rootCause}</p>
          </div>

          <div className="code-comparison-grid">
            <div className="code-box buggy-side">
              <div className="code-header">Version Présentant le Bug</div>
              <pre>
                <code>{selectedBug.buggyCode}</code>
              </pre>
            </div>

            <div className="code-box fixed-side">
              <div className="code-header">Version Corrigée</div>
              <pre>
                <code>{selectedBug.fixedCode}</code>
              </pre>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

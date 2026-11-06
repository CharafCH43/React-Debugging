# Rapport de Débogage React — Checkpoint React Developer Tools

**Projet :** Laboratoire de Débogage React (TechStore)  
**Étudiant :** Charf Eddine  
**Outils utilisés :** React Developer Tools (Extension navigateur Chrome / Edge / Firefox & standalone `react-devtools`), Console DevTools, React 19.

---

## 1. Contexte et Objectifs du Checkpoint

Dans le cadre de ce checkpoint, l'objectif est de mettre en pratique les techniques d'inspection et de résolution d'anomalies sur une application React modulaire en utilisant les outils de développement officiels (**React Developer Tools**).

L'application est structurée autour de composants interconnectés avec gestion d'état local et propagation de props :
- `App` : Composant racine orchestrant l'état du panier (`cartItems`), les filtres de recherche et le profil de Charf Eddine.
- `Navbar` : Barre de navigation affichant le compteur d'articles calculé, le profil et la bascule de test.
- `ProductList` & `ProductCard` : Catalogue avec filtrage dynamique par catégorie, tri et gestion des stocks.
- `Cart` & `CartItem` : Gestion des quantités, validation de codes promotionnels et calcul de TVA.
- `UserProfile` : Affichage et édition des coordonnées de facturation et de livraison de Charf.
- `BugTracker` & `DevToolsGuide` : Outils d'audit interactif et guide méthodologique.

Au cours des phases de test, 5 anomalies courantes en développement React ont été identifiées, inspectées pas à pas dans l'arbre des composants et résolues.

---

## 2. Procédure d'Utilisation de React Developer Tools

### 2.1 Installation et Vérification
- Installation de l'extension **React Developer Tools** sur le navigateur.
- L'icône React apparaît en bleu lors de l'accès à `http://localhost:5173`, confirmant l'exécution d'un build de développement React 19.
- Deux onglets supplémentaires sont disponibles dans les outils de développement :
  - **Components** : Inspection du DOM virtuel et de la hiérarchie des composants.
  - **Profiler** : Mesure des performances de rendu et analyse des causes de re-render.

### 2.2 Arborescence des Composants Inspectée
```text
<App>
  ├── <Navbar>
  ├── <ProductList>
  │     ├── <ProductCard> (Sony WH-1000XM5)
  │     ├── <ProductCard> (Logitech MX Master 3S)
  │     ├── <ProductCard> (Keychron K2 V2)
  │     └── ...
  ├── <Cart>
  │     ├── <CartItem>
  │     └── [Panneau récapitulatif & remises]
  └── <UserProfile>
        └── [Adresse de Charf Eddine, Formulaire d'édition]
```

---

## 3. Analyse Détaillée des 5 Anomalies Résolues

---

### Anomalie 1 : Mutation Directe du State et Concaténation de Chaînes dans le Panier

#### Symptôme observé
Lors de l'incrémentation de la quantité d'un article dans le panier, la quantité passait de `1` à `"11"` au lieu de `2`. De plus, l'ajustement ne provoquait pas systématiquement la mise à jour visuelle des sous-totaux.

#### Diagnostic avec React DevTools
1. Sélection du composant `<CartItem>` dans l'onglet **Components**.
2. Inspection du panneau des **Props** à droite : la propriété `item.quantity` contenait la chaîne `"1"` (type String) au lieu du nombre attendu.
3. Sélection du composant racine `<App>` pour inspecter le hook `useState` de `cartItems` :
   - En effectuant `item.quantity = newQty`, la référence mémoire du tableau `cartItems` restait inchangée.
   - La comparaison superficielle de React (`Object.is`) considérait que l'état n'avait pas varié, sautant ainsi la phase de réconciliation.

#### Cause racine
1. L'événement `e.target.value` issu d'un `<input type="number">` renvoie une chaîne de caractères en JavaScript, provoquant une concaténation (`"1" + 1 = "11"`).
2. Violation du principe fondamental d'immuabilité : mutation directe d'un élément interne d'un tableau d'état.

#### Solution appliquée
```javascript
// Version corrigée : création d'une nouvelle référence de tableau et conversion parseInt
const handleUpdateQuantity = (productId, newQuantity) => {
  const safeQty = Math.max(1, parseInt(newQuantity, 10) || 1);
  setCartItems((prevItems) =>
    prevItems.map((item) =>
      item.id === productId ? { ...item, quantity: safeQty } : item
    )
  );
};
```

---

### Anomalie 2 : Discordance de Nommage de Prop (onRemoveItem vs onDelete)

#### Symptôme observé
Un clic sur l'icône de corbeille d'un article dans le panier provoquait une erreur d'exécution JavaScript :
`Uncaught TypeError: onDelete is not a function`.

#### Diagnostic avec React DevTools
1. Dans l'onglet **Components**, clic sur le composant `<CartItem>`.
2. Examen du panneau des **Props** de `<CartItem>` :
   - `item` : Objet présent.
   - `onUpdateQuantity` : Fonction présente.
   - `onDelete` : Valeur `undefined`.
3. Sélection du composant parent `<Cart>` dans l'arbre :
   - Examen des props passées à `<CartItem>` : `<Cart>` transmettait `onRemoveItem={onRemoveItem}` au lieu de `onDelete={onRemoveItem}`.

#### Cause racine
Non-respect du contrat d'interface : l'enfant attendait la fonction sous le nom `onDelete`, alors que le parent fournissait le handler sous le nom `onRemoveItem`.

#### Solution appliquée
```jsx
// Dans Cart.jsx : alignement du nom de prop
<CartItem
  key={item.id}
  item={item}
  onDelete={onRemoveItem}
/>

// Dans CartItem.jsx : appel sécurisé défensif
const handleRemoveClick = () => {
  if (typeof onDelete === 'function') {
    onDelete(item.id);
  }
};
```

---

### Anomalie 3 : Clé de Liste Non Unique (Index comme 'key')

#### Symptôme observé
Avertissement en console : `Warning: Each child in a list should have a unique "key" prop`.  
Lors du tri par prix décroissant ou de la suppression d'un article, les champs de quantité et le focus restaient attachés aux mauvais composants.

#### Diagnostic avec React DevTools
1. Activation de l'option *"Highlight updates when components render"* dans les paramètres DevTools.
2. Inspection de la liste des `<ProductCard>` dans le composant `<ProductList>`.
3. Constat : les clés affichées étaient des entiers successifs (`key="0"`, `key="1"`, `key="2"`).
4. Lors d'un tri, React réutilisait les instances de composants basées sur leur position plutôt que sur leur identité réelle.

#### Cause racine
Utilisation de l'index de tableau `key={index}` au lieu de l'identifiant persistant de l'entité.

#### Solution appliquée
```jsx
// Version corrigée : clé stable et persistante
{filteredProducts.map((product) => (
  <ProductCard
    key={product.id}
    product={product}
    onAddToCart={onAddToCart}
  />
))}
```

---

### Anomalie 4 : Déréférencement d'Objet Null lors du Rendu Conditionnel

#### Symptôme observé
Lors de l'accès au profil de Charf Eddine avec des données d'adresse incomplètes ou en cours de chargement asynchrone, l'application levait une exception fatale :
`TypeError: Cannot read properties of null (reading 'city')`.

#### Diagnostic avec React DevTools
1. Dans l'onglet **Components**, navigation vers `<UserProfile>`.
2. Inspection de la prop `user` dans le panneau latéral :
   ```json
   {
     "name": "Charf Eddine",
     "email": "charf.eddine@gmail.com",
     "address": null
   }
   ```
3. Mise en évidence de l'instruction problématique : le JSX évaluait directement `user.address.city` alors que `address` valait `null`.

#### Cause racine
Absence de garde sur une structure de données potentiellement incomplète ou asynchrone.

#### Solution appliquée
```jsx
// Version corrigée avec chaînage optionnel et valeur de repli
const renderedCity = activeUser?.address?.city || 'Non renseignée';
const renderedStreet = activeUser?.address?.street || 'Non renseignée';
const renderedCountry = activeUser?.address?.country || 'Non renseigné';
```

---

### Anomalie 5 : Boucle de Rendu Excessive due à une Dépendance d'Objet Instable

#### Symptôme observé
Ralentissement notable lors de la saisie de codes promotionnels et risque de message `Maximum update depth exceeded`.

#### Diagnostic avec React DevTools
1. Bascule sur l'onglet **Profiler**.
2. Démarrage de l'enregistrement, saisie d'un code promo, puis arrêt de l'enregistrement.
3. Analyse du graphique **Flamegraph** :
   - Multiplication anormale des commits successifs.
   - Survol du composant `<Cart>` : la mention *"Why did this render?"* indiquait qu'un hook changeait en continu.
   - En cause : un objet de configuration instancié à la volée dans le corps de rendu était passé dans le tableau de dépendances d'un `useEffect`.

#### Cause racine
En JavaScript, `{}` crée une nouvelle référence mémoire à chaque cycle d'exécution, rendant la comparaison de dépendances du hook constamment invalide.

#### Solution appliquée
```jsx
// Version corrigée : dépendance sur valeur primitive ou mémorisée avec useMemo
const discountRate = appliedPromo ? DISCOUNT_CODES[appliedPromo] || 0 : 0;
// Utilisation directe des valeurs scalaires dans useMemo
const subtotal = useMemo(() => {
  return cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
}, [cartItems]);
```

---

## 4. Tableau Récapitulatif des Tests de Validation

| Composant testé | Anomalie contrôlée | Outil de validation DevTools | Résultat |
| :--- | :--- | :--- | :--- |
| `<CartItem>` | Concaténation de quantité | Onglet Components > Props > `quantity` de type `Number` | **Validé** |
| `<App>` | Mise à jour du state panier | Onglet Components > State > Référence renouvelée, rendu effectif | **Validé** |
| `<CartItem>` &rarr; `<Cart>` | Suppression d'article | Onglet Components > Props > `onDelete` est bien une fonction | **Validé** |
| `<ProductList>` | Stabilité de réconciliation | Onglet Components > Attribut `key` égal à `product.id` | **Validé** |
| `<UserProfile>` | Tolérance aux données nulles | Onglet Components > `user.address: null` sans plantage | **Validé** |
| `<Cart>` | Performance et cycles de rendu | Onglet Profiler > Commits maîtrisés, 0 boucle infinie | **Validé** |

---

## 5. Bonnes Pratiques Retenues

1. **Utiliser `$r` dans la console :** Sélectionner un composant dans l'arbre React et exécuter `$r.props` ou `$r.state` dans la console accélère grandement le diagnostic.
2. **Activer le surlignage des rendus :** Permet de repérer instantanément les composants qui recalculent leur rendu sans raison valable.
3. **Inspecter scrupuleusement les types de props :** Toujours valider que les callbacks sont définies et que les valeurs numériques ne sont pas restées sous forme de chaînes.
4. **Garantir l'immuabilité :** Tout setter de `useState` pour un tableau ou un objet doit recevoir une référence renouvelée (`.map()`, `filter()`, `[...items]`).

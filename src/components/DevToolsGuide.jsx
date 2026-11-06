import React from 'react';
import { CheckIcon, BookIcon } from './Icons';

export default function DevToolsGuide() {
  return (
    <div className="guide-container">
      <div className="guide-hero">
        <div className="guide-hero-icon-box">
          <BookIcon size={32} />
        </div>
        <h2>Guide Pratique : React Developer Tools</h2>
        <p>
          Mémento technique pour diagnostiquer et inspecter les composants, les props, le state et les cycles de rendu dans une application React.
        </p>
      </div>

      <div className="guide-grid">
        {/* Section 1: Installation */}
        <section className="guide-card">
          <div className="guide-card-header">
            <span className="step-number">1</span>
            <h3>Installation & Activation</h3>
          </div>
          <p>
            React Developer Tools est disponible sous forme d'extension de navigateur ou en application autonome (standalone).
          </p>
          <div className="install-options">
            <div className="install-badge">
              <strong>Google Chrome / Brave / Edge :</strong>
              <p>Installer l'extension officielle "React Developer Tools" depuis le Chrome Web Store.</p>
            </div>
            <div className="install-badge">
              <strong>Mozilla Firefox :</strong>
              <p>Installer le module complémentaire "React Developer Tools" depuis Firefox Add-ons.</p>
            </div>
            <div className="install-badge">
              <strong>Version Autonome (Terminal) :</strong>
              <code>npm install -g react-devtools</code>
              <p>Permet de déboguer sans extension navigateur via la commande <code>react-devtools</code>.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Inspecting Components Tree */}
        <section className="guide-card">
          <div className="guide-card-header">
            <span className="step-number">2</span>
            <h3>Arborescence des Composants (Onglet Components)</h3>
          </div>
          <p>
            L'onglet <strong>Components</strong> affiche l'arbre hiérarchique réel des composants React plutôt que les balises HTML brutes du DOM.
          </p>
          <ul className="guide-feature-list">
            <li>
              <strong>Filtre par nom :</strong> Tapez le nom d'un composant (ex : <code>CartItem</code> ou <code>ProductCard</code>) pour y accéder immédiatement.
            </li>
            <li>
              <strong>Outil d'inspection visuelle :</strong> Cliquez sur l'icône de mire en haut à gauche du panneau DevTools, puis cliquez sur un élément dans la page pour cibler son composant.
            </li>
            <li>
              <strong>Rendered by :</strong> Retrace la chaîne des composants parents responsables du rendu de l'élément sélectionné.
            </li>
            <li>
              <strong>Lien vers la source :</strong> Cliquez sur l'icône <code>&lt;&gt;</code> pour ouvrir le fichier source correspondant directement dans l'onglet Sources du navigateur.
            </li>
          </ul>
        </section>

        {/* Section 3: Props, State & Hooks Inspection */}
        <section className="guide-card">
          <div className="guide-card-header">
            <span className="step-number">3</span>
            <h3>Inspection et Modification en Direct (Props & State)</h3>
          </div>
          <p>
            Le panneau latéral droit affiche les données associées au composant actif :
          </p>
          <ul className="guide-feature-list">
            <li>
              <strong>Panneau Props :</strong> Permet de vérifier les types passés (ex : s'assurer qu'une quantité est bien un <code>Number</code> et non une <code>String</code>) et de vérifier que les fonctions de rappel (ex : <code>onDelete</code>) ne sont pas <code>undefined</code>.
            </li>
            <li>
              <strong>Panneau Hooks :</strong> Affiche les états créés avec <code>useState</code>, <code>useMemo</code>, <code>useReducer</code>.
            </li>
            <li>
              <strong>Édition en direct :</strong> Double-cliquez sur n'importe quelle valeur de prop ou de state pour la modifier directement dans DevTools : React effectue un re-render instantané, idéal pour tester des cas limites.
            </li>
          </ul>
        </section>

        {/* Section 4: The $r Console Superpower */}
        <section className="guide-card">
          <div className="guide-card-header">
            <span className="step-number">4</span>
            <h3>Raccourci Console <code>$r</code></h3>
          </div>
          <p>
            Fonctionnalité très pratique pour tester des composants depuis la console JavaScript :
          </p>
          <div className="console-tip-box">
            <p>
              Lorsque vous cliquez sur un composant dans l'arbre Components, React DevTools assigne automatiquement son instance à la variable globale <code>$r</code> dans la console du navigateur.
            </p>
            <div className="code-example">
              <code>$r.props // Affiche les props du composant sélectionné</code>
              <code>$r.state // Inspecte le state interne</code>
            </div>
            <p>
              Vous pouvez également déclencher des callbacks directement : <code>$r.props.onAddToCart(...)</code>.
            </p>
          </div>
        </section>

        {/* Section 5: The Profiler Tab */}
        <section className="guide-card">
          <div className="guide-card-header">
            <span className="step-number">5</span>
            <h3>Onglet Profiler (Performance & Rendu)</h3>
          </div>
          <p>
            L'onglet <strong>Profiler</strong> enregistre l'activité de rendu pour identifier les lenteurs et les re-rendus superflus :
          </p>
          <ul className="guide-feature-list">
            <li>
              <strong>Vue Flamegraph :</strong> Visualise chaque commit de rendu. Un code couleur indique la durée : gris (aucun re-render), bleu/vert (rapide), jaune/orange (composants les plus lents).
            </li>
            <li>
              <strong>Vue Ranked :</strong> Classe les composants par temps de rendu décroissant pour un commit donné.
            </li>
            <li>
              <strong>Option "Why did this render?" :</strong> Activez cette option dans les réglages DevTools pour voir exactement quelle prop ou quel hook a changé et forcé le nouveau rendu.
            </li>
          </ul>
        </section>

        {/* Section 6: Render Highlighting */}
        <section className="guide-card">
          <div className="guide-card-header">
            <span className="step-number">6</span>
            <h3>Surlignage Visuel des Rendus</h3>
          </div>
          <p>
            Dans les paramètres de React DevTools (icône engrenage) &gt; Général &gt; Cochez <strong>"Highlight updates when components render"</strong>.
          </p>
          <p>
            Chaque fois qu'un composant effectue un re-render, un contour coloré clignote brièvement autour de lui. Si un élément clignote en continu sans action utilisateur, cela révèle immédiatement une boucle infinie de rendu.
          </p>
        </section>
      </div>

      <div className="debugging-checklist-card">
        <h3>Checklist de Vérification pour Déboguer React</h3>
        <div className="checklist-grid">
          <div className="checklist-item">
            <span className="check-icon"><CheckIcon size={14} /></span>
            <div>
              <strong>Consulter la console en premier :</strong> Repérer les warnings React relatifs aux clés manquantes ou aux types invalides.
            </div>
          </div>
          <div className="checklist-item">
            <span className="check-icon"><CheckIcon size={14} /></span>
            <div>
              <strong>Vérifier le nom exact des props :</strong> S'assurer que le composant parent fournit précisément le nom attendu par l'enfant (ex: <code>onDelete</code> vs <code>onRemoveItem</code>).
            </div>
          </div>
          <div className="checklist-item">
            <span className="check-icon"><CheckIcon size={14} /></span>
            <div>
              <strong>Contrôler le typage des inputs :</strong> Les champs de formulaires HTML renvoient des chaînes (string) : toujours utiliser <code>parseInt()</code> ou <code>Number()</code> avant un calcul.
            </div>
          </div>
          <div className="checklist-item">
            <span className="check-icon"><CheckIcon size={14} /></span>
            <div>
              <strong>Respecter l'immuabilité du state :</strong> Ne jamais muter un tableau ou un objet en direct : créer de nouvelles références avec <code>[...items]</code> ou <code>.map()</code>.
            </div>
          </div>
          <div className="checklist-item">
            <span className="check-icon"><CheckIcon size={14} /></span>
            <div>
              <strong>Utiliser des clés stables dans les listes :</strong> Toujours privilégier <code>item.id</code> plutôt que <code>index</code> pour garantir une réconciliation Virtual DOM correcte.
            </div>
          </div>
          <div className="checklist-item">
            <span className="check-icon"><CheckIcon size={14} /></span>
            <div>
              <strong>Sécuriser les objets imbriqués :</strong> Utiliser le chaînage optionnel <code>user?.address?.city</code> pour éviter les erreurs de type <code>Cannot read properties of null</code>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

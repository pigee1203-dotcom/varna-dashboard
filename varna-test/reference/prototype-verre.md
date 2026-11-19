# Prototype verre et lumière — étape 1

## État examiné

Le dépôt contient l'application Next.js dans `src/app` et un laboratoire indépendant dans `varna-test`. L'accueil du laboratoire possède déjà une composition en trois colonnes avec Javie au centre, une conversation et des cartes de planification et de finances. Il constitue le point de départ retenu.

Le laboratoire est servi par Node sur le port 3100, sans dépendance graphique. Ses fonctions sont locales et ses finances sont des exemples. Le portrait original est un PNG ; le filtre SVG et le balayage donnent un effet de projection, sans mouvement du corps. Aucun fichier GLB, GLTF ou FBX n'a été trouvé dans les sources examinées.

Les styles comportent plusieurs couches de corrections successives. Les fonds des panneaux et de certains sous-panneaux restent opaques ou très chargés. Ajouter encore une correction globale rendrait la comparaison et les réglages difficiles.

## Écran retenu pour l'étape 2

Créer un écran de comparaison distinct dans le laboratoire, avec une feuille de style dédiée. Reprendre le portrait original intact et trois thèmes existants : Ma journée, Mes tâches et Mes prochaines échéances. Employer des données de démonstration explicitement signalées pour juger le rendu sans dépendre d'une connexion externe.

Direction corrigée avec l'utilisateur : décor sombre commun, portrait central immobile et cartes de verre individuelles de chaque côté. Aucune grande plaque commune. Premier prototype limité à deux cartes : Ma journée et Mes échéances. Vue de face pour préserver la lisibilité ; une colonne sur petit écran.

## Critères visuels avant de poursuivre

- Le décor reste perceptible à travers les cartes individuelles.
- Chaque carte possède un contour de verre fin ; l'espace central de Javie reste dégagé.
- Les panneaux ne ressemblent plus à des blocs bleus pleins.
- Le cyan éclaire les traits, textes importants et graphiques, avec un halo discret.
- Les textes de détail restent nets et lisibles à taille normale.
- Le portrait original conserve son identité et ses proportions.
- L'écran reste utilisable sur mobile et au clavier.

Comparer l'écran aux références fournies dans la conversation. Ne pas déclarer une fidélité visuelle vérifiée sans observation du rendu dans un navigateur. Les captures de référence ne sont pas actuellement des fichiers locaux du projet.

## Ordre technique

1. Construire la composition et le verre avec HTML/CSS, sans nouvelle dépendance.
2. Observer le prototype et régler transparence, reflets et halo.
3. Déterminer si un effet précis nécessite WebGL ; son ajout n'est pas requis pour commencer.
4. Après validation visuelle, choisir ou produire un modèle 3D fidèle à Javie avec squelette, puis vérifier sa licence et ses performances.
5. Réaliser une interaction complète : sélectionner une carte, orienter Javie, pointer la carte et l'illuminer.

Une image seule ne fournit ni géométrie 3D, ni squelette, ni animation des mains. La qualité de ce futur modèle est une dépendance réelle pour reproduire les gestes de la seconde référence.

## Limites de cette étape

Le prototype local est disponible à `/verre.html`, avec ses propres fichiers `verre.css` et `verre.js`. Les boutons accentuent la lumière d'une carte ; aucune animation du corps n'est simulée. Le PNG original est intact et intégré avec un mélange d'affichage pour atténuer son fond sombre. Les données sont illustratives.

Vérifications : syntaxe JavaScript et réponses HTTP 200 de la page, des styles, du script et du portrait. Aucun navigateur contrôlable n'est disponible dans cette session : la fidélité visuelle reste à observer. Aucune installation ni publication. Les fichiers de l'interface existante sont conservés.

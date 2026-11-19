# VARNA — espace de test indépendant

## VARNA VERSION VERRE — adresse à utiliser

Quand l’utilisateur demande « VARNA VERRE » ou « version test verre », lancer `npm --prefix varna-test run dev` depuis la racine et ouvrir **http://localhost:3100/verre.html**. Le fichier correspondant est `public/verre.html` (« VARNA · Javie — cartes en verre »). Ne pas donner la page `/` pour cette demande.

La conversation de cette variante utilise une surface givrée, des reflets de tranche et des bulles assorties aux cartes. Les suggestions de journée et de factures répondent dans le fil ; leurs boutons ouvrent les outils correspondants. « Garder une idée » prépare une commande de note à compléter. Les commandes de création présentent une action de vérification avant ouverture du formulaire. Les réponses locales ont un indicateur animé ; aucune IA distante n’est connectée. Les animations respectent la préférence de réduction des mouvements.

Cette base est neuve. Les fichiers de l’application principale restent dans le dossier parent et ne sont pas modifiés par ce laboratoire.

## Lancer la version de test

Depuis la racine du projet :

```sh
npm --prefix varna-test run dev
```

Ouvrir http://localhost:3100. Pour les environnements distants, transférer le port 3100 dans l’éditeur.

Aucune installation nécessaire : le serveur utilise uniquement Node.js. Le serveur refuse de démarrer si son port est déjà occupé. Il ne remplace pas le serveur VARNA existant.

## Organisation

- `public/index.html` : disposition des cartes du prototype Javie, clairement identifiée comme laboratoire.
- `public/style.css` : styles indépendants, trois colonnes sur PC et réorganisation sur mobile.
- `public/app.js` : interactions locales du prototype.
- `public/assets/varna-logo.png` : copie du logo original, sans modification.
- `server.mjs` : serveur local indépendant sur le port 3100.
- `reference/varna-actuel.tar.gz` : copie locale de référence du code et des ressources de l’application actuelle, sans secrets ni données utilisateur.

Le serveur expose uniquement `public/`. Il ne charge aucun fichier `.env` et ne se connecte à aucun service. Aucun script ne copie les modifications vers le projet principal. La nouvelle interface de planification pourra être développée ici, puis comparée à l’application actuelle avant toute intégration.

## Étape 1 — disposition de l’interface Javie

La maquette reprend la disposition de la référence : outils et raccourcis à gauche, portrait et conversation au centre, finances et agenda à droite. Sur mobile, les cartes passent sur une colonne avec une navigation fixe en bas.

Fonctions essayables : ajout de tâches avec une heure facultative, liste de planification triée, tâches terminées, notes, prénom du profil de test et aperçu du portrait. Les tâches, notes et le prénom sont conservés dans le stockage local de ce navigateur sous la clé `varna-test.javie.v1` ; le portrait choisi reste temporaire et n’est pas envoyé au serveur.

La conversation affiche une démonstration explicite, sans IA connectée. Le microphone n’est pas actif. Les montants et documents présentés sont des exemples. Aucune opération ne modifie les comptes, documents ou données de l’application principale.

Le portrait personnalisé peut être essayé via « Ajouter mon portrait » (PNG, JPEG ou WebP, maximum 15 Mo). Pour l’intégrer définitivement à la maquette, placer ensuite son fichier dans `public/assets/` et adapter la source de l’image centrale.

## Variante du logo Javie

`public/assets/varna-logo-javie-v1.png` est une variante holographique générée avec l’outil intégré de création d’image : cyan et bleu glacé, nom clair, symbole de document et personne conservé, transparence réelle. Elle est utilisée seulement dans le laboratoire. Le fichier original `varna-logo.png` est conservé.

La demande de génération figure dans `reference/logo-javie-prompt.md`.

## Étape 2 — planification de la journée

La carte « Ma journée » permet de changer de date et de suivre la durée totale restante et l’avancement. Chaque tâche ou rendez-vous a une date, une durée, une priorité, un horaire facultatif pour les tâches et un détail facultatif. Le titre ouvre la modification ; la case à droite termine ou rouvre l’élément. La suppression demande une confirmation dans l’interface de test.

La fenêtre de planification affiche tous les éléments du jour et propose les filtres Tout / À faire / Terminés. Les chevauchements d’horaires sont signalés. Les tâches de l’ancienne maquette sont reprises sans perdre leur titre ou leur état.

Pour placer les tâches sans heure : ouvrir « Organiser ma journée », régler le début et la fin de journée, puis choisir « Proposer des horaires ». Les priorités passent d’abord ; les rendez-vous et autres horaires déjà fixés restent en place. Vérifier la proposition puis « Appliquer ce planning ». Si la plage ne suffit pas, les tâches restantes restent sans horaire. Cette proposition utilise des règles locales et ne nécessite pas d’IA.

Vérification de la logique :

```sh
npm --prefix varna-test test
```

Les données restent dans le stockage local du laboratoire ; la modification d’une date ou d’un planning ne synchronise aucun calendrier externe.

## Portrait original de Jarvie

La variante régénérée n’est plus utilisée dans l’interface. Le bouton « Choisir mon image originale » affiche le fichier sélectionné sans régénération, filtre de couleur, détourage ni anneaux ajoutés. Le fichier original est conservé tel quel dans IndexedDB (`varna-test.original-portrait`), localement dans ce navigateur, et restauré après rechargement. Aucun envoi au serveur.

La variante rejetée reste uniquement comme fichier de travail ; elle n’est plus chargée par la page.

### Image originale intégrée

Le portrait affiché par défaut est maintenant `public/assets/Portrait holographique bleu électrique futuriste.png`, le fichier original déposé par l’utilisateur. Il est référencé directement, sans modification de l’image. Une ancienne image mémorisée dans le navigateur ne remplace pas ce nouveau fichier. Un nouveau choix manuel reste possible via le bouton de changement de portrait.

### Fond du portrait et effet électrique

Le fichier original est intact. Le rendu utilise un filtre SVG qui rend transparents les pixels sombres du fond, à la place du mélange `screen` qui laissait un rectangle visible. La surbrillance et la saturation cyan ajoutées ont été retirées : les couleurs viennent du portrait original, avec une légère transparence de projection. Le balayage lumineux lent reste actif ; les animations sont coupées si la préférence de réduction du mouvement est activée. Aucun visage n’est régénéré. Ces effets sont calculés à l’affichage et ne créent pas de nouvelle image.

### Scan optique du portrait

Le balayage suit maintenant la silhouette et les détails lumineux de l’image, plutôt qu’un rectangle par-dessus. Un front lumineux légèrement courbé, un reflet fin et une traînée s’estompant simulent une projection optique. Le passage dure 7,2 secondes avec une courte pause ; les couleurs permanentes du portrait ne sont pas renforcées. Le scan s’adapte aux dimensions d’un éventuel portrait choisi et se désactive en mode de réduction du mouvement. Le fichier source reste intact.

## Étape 3 — cartes connectées et commandes écrites

Les factures de démonstration peuvent préparer un rappel dans la planification. Le formulaire reprend la date d’échéance, le montant de référence et une durée de 15 minutes. Le rappel conserve un identifiant de facture même si son titre est modifié ; rouvrir la facture propose donc de modifier son rappel existant plutôt que de créer un doublon. Terminer le rappel ne marque pas la facture comme payée.

La nouvelle carte « Mes prochaines échéances » permet d’ouvrir ces rappels. Les dates d’échéance utilisent une date de référence locale conservée entre les visites.

La conversation accepte des commandes locales explicites, sans IA connectée :

- `montre mes factures`
- `organise ma journée`
- `ajoute une tâche Appeler le dentiste demain à 14 h pendant 30 minutes prioritaire`
- `crée un rendez-vous Dentiste le 2026-12-01 à 09:15 pendant 1 heure`
- `note : Préparer mes documents`
- `bonjour`

Les commandes de création ouvrent un formulaire prérempli et n’enregistrent rien avant validation. Les dates, horaires et durées invalides sont signalés. Une commande inconnue affiche l’aide sans modifier les données. Le micro et la connexion à une IA restent des étapes séparées.

## Étape 4 — pages complètes de l’espace personnel

Les boutons Calendrier, Tâches, Factures, Documents, Notes et Banque ouvrent maintenant une page complète dans le laboratoire, avec une adresse propre (`/#/calendrier`, `/#/taches`, etc.), un titre, la navigation commune et des panneaux cohérents avec l’accueil. Les formulaires de création et de modification restent des fenêtres au-dessus de la page. Le retour à l’accueil et l’historique du navigateur fonctionnent ; les données locales restent partagées entre les pages.

Le calendrier propose les onglets Jour / Semaine / Mois, la navigation par période, une date sélectionnable, des créneaux pour créer un rendez-vous et une colonne récapitulant la journée. Les éléments en chevauchement sont affichés côte à côte. Les tâches sans horaire restent visibles et peuvent recevoir une proposition de planning. Les vues et la date sont conservées dans l’adresse du calendrier au rechargement. Sur mobile, la vue Jour est choisie initialement ; la semaine peut défiler à l’intérieur de sa carte, sans élargir toute la page.

Les pages Tâches et Documents ont leurs propres filtres. Le bloc-notes affiche toutes les notes. Les pages Factures et Banque conservent la mention de démonstration et ne connectent pas de service externe.

## Mes finances et paiements

Les onglets Vue d’ensemble, Paiements, Budget et Bourse regroupent les indicateurs de démonstration, échéances liées aux rappels existants, budget par catégorie, projection illustrative de trésorerie et objectifs d’épargne. L’ajout/retrait de dépenses actualise le solde et le budget de démonstration. Le rapport exporte les dépenses en CSV. Les dépenses et la liste de suivi Bourse sont conservées dans `varna-test.finances.v1` dans ce navigateur. Le bouton d’épargne active uniquement une simulation locale. Aucun paiement, virement, cours de marché, alerte automatique ou numérisation OCR n’est connecté.

## Rendez-vous adaptatifs dans Calendrier

Sur `verre.html`, ouvrir Calendrier → Ajouter un rendez-vous. Le formulaire commence par six catégories (Médical, Professionnel, Familial, Automobile, Personnel, Autre), puis affiche les champs pertinents, une durée ou une heure de fin et les options de suivi. Le formulaire sert aussi à modifier les rendez-vous existants. Les chevauchements sont signalés ; les horaires au-delà de minuit et les dates incohérentes des rappels sont refusés.

L’étape « Les propositions de JAVIE » récapitule le rendez-vous et demande une confirmation explicite pour chaque action, décochée par défaut. Les actions confirmées créent des tâches ou rappels liés, un départ calculé selon la durée de trajet saisie, des documents, ou une dépense estimée en CAD. Les identifiants des tâches associées restent stables pour éviter les doublons à la modification. Les actions déjà créées sont conservées si elles ne sont pas reconfirmées ; une dépense déjà confirmée garde son montant tant qu’une nouvelle estimation n’est pas confirmée.

Les fichiers PDF, PNG, JPEG et WebP (10 fichiers maximum par ajout, 10 Mo chacun) restent en IndexedDB dans ce navigateur. Ils sont accessibles et téléchargeables via Documents → Rendez-vous et ordonnances. Les dépenses confirmées apparaissent dans Finances et paiements → Budget, avec leur lien au rendez-vous. Aucun paiement, notification externe, itinéraire en direct ou réservation de suivi n’est effectué. Les propositions sont calculées localement à partir du formulaire.

Vérifications : `npm --prefix varna-test test`, dont `tests/appointments.test.mjs` couvre les dates, le consentement, la persistance des détails, le départ la veille et l’absence de doublons.

## Briefing du jour — carte d’accueil et page complète

Le panneau de droite est désormais « Briefing du jour ». Ses quatre indicateurs ouvrent la même page détaillée à la section choisie, via `verre.html#/briefing?date=AAAA-MM-JJ&section=agenda`. Aucune entrée n’est ajoutée au menu principal. Le calendrier, les tâches et leurs formulaires, les routines, les factures importées, les documents de rendez-vous et les notes restent les sources de référence.

La synthèse exclut les tâches `demo-*` et les rappels des factures d’exemple. Les factures réellement importées doivent avoir une échéance valide et le statut explicite « Impayée » pour apparaître dans les compteurs et priorités. Leur statut, montant et récurrence se précisent dans la fiche Factures. Une confirmation « Payée » modifie la fiche d’origine sans effectuer de paiement bancaire. Les statuts inconnus et montants manquants sont signalés. Les dépenses estimées d’un rendez-vous ne sont pas assimilées à des factures impayées. Le prénom n’est utilisé dans la synthèse que si le profil a été explicitement enregistré.

La page complète comprend l’agenda, les priorités expliquées, les tâches par statut, les routines et leurs étapes, les paiements, les échéances filtrées, les documents liés, les notes pertinentes et les suggestions locales. Les commandes passent par les formulaires existants ou une confirmation explicite. Les tâches converties depuis une note et les rappels de facture réutilisent la fiche liée pour éviter les doublons. Les propositions de créneaux reprennent le planificateur existant ; les horaires déjà fixés ne sont pas déplacés automatiquement. Les notes et le contenu des documents restent masqués dans les aperçus du briefing.

Les routines personnalisées et leur progression partagent `varna-test.routines.v2` avec le module Routines. Les anciens journaux effectivement enregistrés sont repris ; aucune routine d’exemple n’est comptée par défaut. Les notes peuvent être associées à une date dans leur formulaire ou depuis le briefing.

Personnalisation : sections visibles, ordre, sections réduites, niveau Express / Complet / Approfondi, ordre des priorités, activation des suggestions locales, heure et fréquence des rappels dans VARNA. Les rappels sont dédupliqués par date et créneau et fonctionnent uniquement lorsque la page est ouverte. Les préférences sont conservées localement.

« Écouter mon briefing » emploie `speechSynthesis` si le navigateur le propose, avec interruption de la lecture. Aucun microphone ou service d’IA distante n’est présenté comme connecté. La météo, la circulation, les notifications système et l’exécution en arrière-plan sont explicitement indisponibles. Les estimations de déplacement déjà confirmées sont identifiées comme saisies par l’utilisateur.

Validation : tests purs `tests/briefing.test.mjs` et tests navigateur Chromium sur 1440 × 1080, 768 × 1024 et 390 × 844. Les parcours contrôlés incluent l’état vide, les données de test isolées, l’accès direct aux sections, la tâche commencée/terminée, les priorités, les routines, la conversion de note sans doublon, une facture marquée payée, les préférences après rechargement et le changement de date. Aucun compte ni navigateur utilisateur n’a servi aux tests.

### Présentation du briefing en cartes

Le briefing complet reprend la disposition de la référence fournie, dans le thème VARNA Verre : portrait et message JAVIE à gauche de l’aperçu météo/déplacement, six indicateurs (rendez-vous, tâches, factures, activités familiales, conflits, priorités), agenda et tâches à gauche, priorités/finances/échéances à droite, puis suggestions et bien-être. Les informations complémentaires restent accessibles sous ces cartes. Les actions détaillées des éléments se déplient via « Actions ». La météo, le trafic et les métriques de bien-être ne présentent aucune valeur fictive. Sur téléphone, les indicateurs passent sur deux rangées et les cartes s’empilent.
